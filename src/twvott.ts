type Options = {
  width?: number;
  height?: number;
  fontSize?: number;
  lineHeight?: number;
  errorPage?: string;
  preload?: boolean;
};
type Colors = {
  white: '#FFFFFF';
  black: '#000000';
  red: '#FF0000';
  green: '#00FF00';
  blue: '#0000FF';
  yellow: '#FFFF00';
  magenta: '#FF00FF';
  cyan: '#00FFFF';
};
type Layers = {
  textColor: string;
  backgroundColor: string;
  fontSize: number;
  fontWeight: string;
  underline: boolean;
  striketrough: boolean;
  centerText: boolean;
};

export default class TWVOTT {
  public currentPage: number;
  private canvas: HTMLCanvasElement;
  private offscreenCanvas: OffscreenCanvas;
  private context: CanvasRenderingContext2D;
  private offscreenContext: OffscreenCanvasRenderingContext2D;
  private pages: string[];
  private fontSize: number;
  private colors: Colors;
  private lineHeight: number;
  private errorPage: string;
  private preload: boolean;
  private preloadedPages: HTMLImageElement[];
  private preloadedErrorPage: HTMLImageElement;
  private useOffscreenContext: Boolean;

  constructor(
    canvasId: string,
    options?: Options,
    pages?: { pageNumber: number; content: string }[]
  ) {
    const finalOptions = {
      ...{
        width: 300,
        height: 300,
        fontSize: 12,
        errorPage: '> #red Page Not Found',
        lineHeight: 2,
        preload: false,
      },
      ...options,
    };

    // Setup canvas
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context could not be initialized');
    }
    this.context = context;

    // Setup offscreen canvas
    const offscreen = new OffscreenCanvas(
      finalOptions.width,
      finalOptions.height
    );
    this.offscreenCanvas = offscreen;
    const offscreenContext = offscreen.getContext('2d');
    if (!offscreenContext) {
      throw new Error('Offscreen canvas context could not be initialized');
    }
    this.offscreenContext = offscreenContext;

    // Other options
    this.errorPage = finalOptions.errorPage;
    this.preloadedErrorPage = new Image();
    this.preload = finalOptions.preload;
    this.preloadedPages = [];
    this.lineHeight = finalOptions.lineHeight;
    this.useOffscreenContext = false;

    // Set up canvas dimensions and font settings
    this.canvas.width = finalOptions.width;
    this.canvas.height = finalOptions.height;
    this.pages = [];
    this.currentPage = 1;

    this.fontSize = finalOptions.fontSize;
    this.colors = {
      white: '#FFFFFF',
      black: '#000000',
      red: '#FF0000',
      green: '#00FF00',
      blue: '#0000FF',
      yellow: '#FFFF00',
      magenta: '#FF00FF',
      cyan: '#00FFFF',
    };

    // Set a fixed-width font
    this.context.font = `${this.fontSize}px monospace`;
    this.context.textBaseline = 'top';
    this.offscreenContext.font = `${this.fontSize}px monospace`;
    this.offscreenContext.textBaseline = 'top';

    // Add pages if the argument is provided
    if (pages?.length) {
      for (const page of pages) {
        this.addPage(page.pageNumber, page.content);
      }
    }
  }

  /**
   * Modifies the global font.
   * @param layers The text layer object
   */
  private setFont(layers: Layers) {
    // Define font components
    const fontSize = `${layers.fontSize}px `;
    const fontFamily = 'monospace ';
    const fontWeight = `${layers.fontWeight} `;
    this.getContext().font = `${fontWeight}${fontSize}${fontFamily}`;
  }

  /**
   * Renders a page of content using custom syntax.
   * @param content The content to render
   */
  private async renderPage(content: string) {
    const lines = content.split('\n');
    let yRef: { y: number } = { y: 0 };
    this.clearScreen();

    for (const line of lines) {
      await this.parseLine(line, yRef);
    }
  }

  /**
   * Parses a line from page contents.
   * @param line The line to parse
   * @param yRef The y coordinate reference used to insert the parsed line
   */
  private async parseLine(line: string, yRef: { y: number }) {
    const tokens = line.split(' ').filter((token) => token !== '');

    if (tokens[0] === '>') {
      this.handleTextLine(tokens.slice(1), yRef);
    } else if (tokens[0] === '$') {
      this.handlePixelLine(tokens.slice(1), yRef);
    } else if (tokens[0] === '@') {
      await this.handleImageLine(tokens.slice(1), yRef);
    }
  }

  /**
   * Handles text tokens (>).
   * @param tokens The tokens to handle
   * @param yRef The y coordinate reference used to insert the parsed line
   */
  private handleTextLine(tokens: string[], yRef: { y: number }) {
    let x = 0;

    let layers = {
      textColor: 'white',
      backgroundColor: '',
      fontSize: this.fontSize,
      fontWeight: '',
      centerText: false,
      underline: false,
      striketrough: false,
    };

    tokens.forEach((token) => {
      token = token.replace(/\¶/g, ' ');

      if (this.isColorTag(token)) {
        this.applyColorTag(token, layers);
      } else if (this.isCommandTag(token)) {
        this.applyCommandTag(token, layers);
      } else {
        x = this.drawTextToken(token, x, yRef.y, layers);
      }
    });

    // Add height
    yRef.y += layers.fontSize + this.lineHeight;
  }

  /**
   * Handles pixel tokens ($).
   * @param tokens The tokens to handle
   * @param y The y coordinate reference used to insert the parsed line
   */
  private handlePixelLine(tokens: string[], yRef: { y: number }) {
    let x = 0;
    let fontSize = this.fontSize;
    let currentColor = '#FFFFFF';

    tokens.forEach((token) => {
      if (this.isColorTag(token)) {
        currentColor = this.getColorFromTag(token);
        this.getContext().fillStyle = currentColor;
      } else if (this.isCommandTag(token)) {
        fontSize = this.getFontSizeFromTag(token, fontSize);
      } else {
        x = this.drawPixelToken(token, x, yRef.y, fontSize);
      }
    });

    // Add height
    yRef.y += this.fontSize;
  }

  /**
   * Handles image tokens (@).
   * @param tokens The tokens to handle
   * @param y The y coordinate reference used to insert the parsed line
   */
  private async handleImageLine(tokens: string[], yRef: { y: number }) {
    const isNumeric = (value: string) => /^-?\d+$/.test(value);

    const width = isNumeric(tokens[0]) ? Number(tokens[0]) : 100;
    const height = isNumeric(tokens[1]) ? Number(tokens[1]) : 100;
    const padding = isNumeric(tokens[2])
      ? this.getContext().measureText(' '.repeat(Number(tokens[2]))).width
      : 0;
    const src = tokens[3];
    const data = await this.fetchImage(src);
    this.getContext().drawImage(data, 0 + padding, yRef.y, width, height);

    // Add height
    yRef.y += height + this.lineHeight;
  }

  /**
   * Check if the token is a color tag (#).
   * @param token The token to check.
   * @returns A boolean value indicating if the token is a color tag
   */
  private isColorTag(token: string): boolean {
    return token.startsWith('#');
  }

  /**
   * Check if the token is a command tag (:).
   * @param token The token to check.
   * @returns A boolean value indicating if the token is a command tag
   */
  private isCommandTag(token: string): boolean {
    return token.startsWith(':');
  }

  /**
   * Fetches an image from a URL.
   */
  private async fetchImage(url: string): Promise<HTMLImageElement> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create an HTMLImageElement from the blob
      const img = await this.loadImageFromBlob(blob);

      return img;
    } catch (error) {
      throw new Error(`Error fetching image: ${error}`);
    }
  }

  /**
   * Loads an image from a blob.
   * @param blob The blob to load.
   * @returns A ImageElement.
   */
  private loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Applies color to a token.
   * @param token The token to apply color to
   * @param layers An object defining text properties
   */
  private applyColorTag(token: string, layers: Layers) {
    const tagLength = token.match(/#+/)?.[0].length;
    const colorKey = token.slice(tagLength);
    const color =
      this.colors[colorKey as keyof typeof this.colors] || this.colors.white;

    if (tagLength === 1) {
      layers.textColor = color;
    } else if (tagLength === 2) {
      layers.backgroundColor = color;
    }
  }

  /**
   * Applies a command to a token.
   * @param token The token to apply the command to
   * @param layers An object defining text properties
   */
  private applyCommandTag(token: string, layers: Layers) {
    const command = token.slice(1);

    if (command === 'b') {
      layers.fontWeight = 'bold';
    } else if (command === 'i') {
      layers.fontWeight = 'italic';
    } else if (command === 'n') {
      layers.fontWeight = '';
    } else if (command === 'c') {
      layers.centerText = true;
    } else if (command === 'u') {
      layers.underline = true;
    } else if (command === 'x') {
      layers.striketrough = true;
    } else if (!isNaN(+command)) {
      layers.fontSize = Number(command);
    }
  }

  /**
   * Draws text based on token.
   * @param token The token containing the text to draw.
   * @param x The x position to draw the text
   * @param y The y position to draw the text
   * @param layers  An object defining text properties
   * @returns The new x position
   */
  private drawTextToken(
    token: string,
    x: number,
    y: number,
    layers: Layers
  ): number {
    this.setFont(layers);

    const textWidth = this.getContext().measureText(token).width;
    const spaceWidth = this.getContext().measureText(' ').width;
    const finalWidth = textWidth + spaceWidth;

    if (layers.centerText) {
      x = (this.canvas.width - textWidth) / 2;
    }

    if (layers.backgroundColor) {
      this.getContext().fillStyle = layers.backgroundColor;
      this.getContext().fillRect(x, y - 1, finalWidth, layers.fontSize);
    }

    if (layers.underline) {
      this.getContext().fillStyle = layers.textColor;
      this.getContext().fillRect(x, y + layers.fontSize, finalWidth, 2);
    }

    if (layers.striketrough) {
      this.getContext().fillStyle = layers.textColor;
      this.getContext().fillRect(x, y + layers.fontSize / 2, finalWidth, 1);
    }

    this.getContext().fillStyle = layers.textColor;
    this.getContext().fillText(token, x, y);

    return x + finalWidth;
  }

  /**
   * Gets color from a tag
   * @param token The token to get color from
   * @returns The color
   */
  private getColorFromTag(token: string): string {
    const colorKey = token.slice(1);
    return this.colors[colorKey as keyof typeof this.colors] || '#FFFFFF';
  }

  /**
   * Gets font size from a tag
   * @param token The token to get size from
   * @param defaultSize The default size
   * @returns The font size
   */
  private getFontSizeFromTag(token: string, defaultSize: number): number {
    const command = token.slice(1);
    return !isNaN(+command) ? Number(command) : defaultSize;
  }

  /**
   * Draws pixels based on token,
   * @param token The token containing the pixels to draw
   * @param x The x position to draw the pixel
   * @param y The y poisiton to draw the pixel
   * @param fontSize The size of the pixel
   * @returns The new x position
   */
  private drawPixelToken(
    token: string,
    x: number,
    y: number,
    fontSize: number
  ): number {
    for (const character of token) {
      if (character === '0') {
        this.getContext().fillRect(x, y, fontSize, fontSize);
      }
      x += fontSize;
    }
    return x;
  }

  /**
   * Clears screen with background color.
   * @param color The color to fill the background of
   */
  public clearScreen(color = this.colors.black) {
    this.getContext().fillStyle = color;
    this.getContext().fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Load and render a specific page content.
   * @param pageNumber The page to render
   */
  public async loadPage(pageNumber: number) {
    if (this.pages[pageNumber]) {
      this.clearScreen();

      if (this.preload) {
        this.loadPreloadedPage(pageNumber);
      } else {
        await this.renderPage(this.pages[pageNumber]);
      }
    } else {
      if (this.preload) {
        this.loadPreloadedPage(0, true);
      } else {
        await this.renderPage(this.errorPage);
      }
    }
    this.currentPage = pageNumber;
  }

  /**
   * Loads a page from the array of preloaded pages.
   * @param pageNumber The page to load
   * @param exists If the page exists or not
   */
  private loadPreloadedPage(pageNumber: number, exists?: boolean) {
    if (exists) {
      this.getContext().drawImage(this.preloadedErrorPage, 0, 0);
    } else {
      try {
        this.getContext().drawImage(this.preloadedPages[pageNumber], 0, 0);
      } catch (e) {
        throw new Error(
          'Could not preload page. Use the preloadPage function before loading a page or set preload option to false.'
        );
      }
    }
  }

  /**
   * Preload predefined pages.
   */
  public async preloadPages() {
    if (!this.preload) {
      throw new Error(
        'Do not use the preloadPages function unless the preload option is set true!'
      );
    }
    if (!this.pages.length) {
      throw new Error('No pages to preload!');
    }

    // Since we don't want to render on the normal canvas
    this.useOffscreenContext = true;

    // Render all pages
    for (const page of this.pages) {
      if (page) {
        await this.renderPage(page);
        const blob = await this.offscreenCanvas.convertToBlob({
          type: 'image/png',
        });
        if (blob) {
          const img = await this.loadImageFromBlob(blob);
          this.preloadedPages.push(img);
        }
      } else {
        this.preloadedPages.push(new Image());
      }
    }

    // Render error page separately
    await this.renderPage(this.errorPage);
    const blob = await this.offscreenCanvas.convertToBlob({
      type: 'image/png',
    });
    if (blob) {
      const img = await this.loadImageFromBlob(blob);
      this.preloadedErrorPage = img;
    }

    // Since we now want to render on the normal canvas
    this.useOffscreenContext = false;
  }

  /**
   * Add a page to the library
   * @param pageNumber The page number
   * @param content The content of the page
   */
  public addPage(pageNumber: number, content: string) {
    this.pages[pageNumber] = content;
  }

  /**
   * Modify a page in the library (alias for addPage)
   * @param pageNumber The page number
   * @param content The content of the page
   */
  public modifyPage(pageNumber: number, content: string) {
    this.addPage(pageNumber, content);
  }

  /**
   * Goes to the next page
   */
  public nextPage() {
    this.loadPage(this.currentPage + 1);
  }

  /**
   * Goes to the previous page
   */
  public previousPage() {
    this.loadPage(this.currentPage - 1);
  }

  /**
   * Retrives a canvas context
   * @param offscreen If the offscreen context should be used
   * @returns The context
   */
  private getContext() {
    if (this.useOffscreenContext) {
      return this.offscreenContext;
    } else {
      return this.context;
    }
  }
}
