type Options = { width: number; height: number; fontSize: number };
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
  centerText: boolean;
};

export default class TWVOTT {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private pages: string[];
  public currentPage: number;
  private fontSize: number;
  private colors: Colors;

  constructor(
    canvasId: string,
    options: Options = {
      width: 0,
      height: 0,
      fontSize: 0,
    }
  ) {
    // Setup canvas
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context could not be initialized');
    }
    this.context = context;

    // Set up canvas dimensions and font settings
    this.canvas.width = options.width || 320;
    this.canvas.height = options.height || 240;
    this.pages = [];
    this.currentPage = 1;

    this.fontSize = options.fontSize || 14;
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
    this.context.font = `${fontWeight}${fontSize}${fontFamily}`;
  }

  /**
   * Renders a page of content using custom syntax.
   * @param content The content to render
   */
  private renderPage(content: string) {
    const lines = content.split('\n');
    let y = 0;
    this.clearScreen();

    lines.forEach((line) => {
      this.parseLine(line, y);
      y += this.fontSize;
    });
  }

  /**
   * Parses a line from page contents.
   * @param line The line to parse
   * @param y The y coordinate to insert the parsed line
   */
  private parseLine(line: string, y: number) {
    const tokens = line.split(' ').filter((token) => token !== '');

    if (tokens[0] === '>') {
      this.handleTextLine(tokens.slice(1), y);
    } else if (tokens[0] === '$') {
      this.handlePixelLine(tokens.slice(1), y);
    }
  }

  /**
   * Handles text tokens (>).
   * @param tokens The tokens to handle
   * @param y The y coordinate to insert the parsed line
   */
  private handleTextLine(tokens: string[], y: number) {
    let x = 0;

    let layers = {
      textColor: 'white',
      backgroundColor: '',
      fontSize: this.fontSize,
      fontWeight: '',
      centerText: false,
    };

    tokens.forEach((token) => {
      token = token.replace(/\¶/g, ' ');

      if (this.isColorTag(token)) {
        this.applyColorTag(token, layers);
      } else if (this.isCommandTag(token)) {
        this.applyCommandTag(token, layers);
      } else {
        x = this.drawTextToken(token, x, y, layers);
      }
    });
  }

  /**
   * Handles pixel tokens ($).
   * @param tokens The tokens to handle
   * @param y The y coordinate to insert the parsed line
   */
  private handlePixelLine(tokens: string[], y: number) {
    let x = 0;
    let fontSize = this.fontSize;
    let currentColor = '#FFFFFF';

    tokens.forEach((token) => {
      if (this.isColorTag(token)) {
        currentColor = this.getColorFromTag(token);
        this.context.fillStyle = currentColor;
      } else if (this.isCommandTag(token)) {
        fontSize = this.getFontSizeFromTag(token, fontSize);
      } else {
        x = this.drawPixelToken(token, x, y, fontSize);
      }
    });
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

    const textWidth = this.context.measureText(token).width;
    const spaceWidth = this.context.measureText(' ').width;
    const finalWidth = textWidth + spaceWidth;

    if (layers.centerText) {
      x = (this.canvas.width - textWidth) / 2;
    }

    if (layers.backgroundColor) {
      this.context.fillStyle = layers.backgroundColor;
      this.context.fillRect(x, y - 1, finalWidth, layers.fontSize);
    }

    this.context.fillStyle = layers.textColor;
    this.context.fillText(token, x, y);

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
        this.context.fillRect(x, y, fontSize, fontSize);
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
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Load and render a specific page content.
   * @param pageNumber The page to render
   */
  public loadPage(pageNumber: number) {
    if (this.pages[pageNumber]) {
      this.clearScreen();
      this.renderPage(this.pages[pageNumber]);
    } else {
      this.renderPage('> #red Page Not Found');
    }
    this.currentPage = pageNumber;
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
}
