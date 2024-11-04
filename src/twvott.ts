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
type TextLayers = {
  textColor: string;
  backgroundColor: string;
  fontSize: number;
  fontWeight: string;
};

class TWVOTT {
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
  private setFont(layers: TextLayers) {
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
   * Parses a line.
   * @param line The line to parse
   * @param y The y coordinate of the line
   */
  private parseLine(line: string, y: number) {
    const tokens = line.split(' ').filter((token) => token !== '');

    // Handling text
    if (tokens[0] === '>') {
      tokens.shift();
      let x = 0;

      let layers = {
        textColor: 'white',
        backgroundColor: '',
        fontSize: this.fontSize,
        fontWeight: '',
      };

      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        token = token.replace(/\¶/g, ' ');

        if (token.startsWith('#')) {
          // Handle color tags for text and background
          const tagLength = token.match(/#+/)?.[0].length;
          const colorKey = token.slice(tagLength);
          const color =
            this.colors[colorKey as keyof typeof this.colors] ||
            this.colors.white;

          if (tagLength === 1) layers.textColor = color;
          else if (tagLength === 2) layers.backgroundColor = color;
        } else if (token.startsWith(':')) {
          const command = token.slice(1);

          if (command === 'b') {
            layers.fontWeight = 'bold';
          } else if (command === 'i') {
            layers.fontWeight = 'italic';
          } else if (command === 'n') {
            layers.fontWeight = '';
          } else if (!isNaN(+command)) {
            layers.fontSize = Number(command);
          }
        } else {
          this.setFont(layers);

          // Calculate both widths seperatly
          const textWidth = this.context.measureText(token).width;
          const spaceWidth = this.context.measureText(' ').width;

          // Used to remove background color for the last space after changing to another
          const finalWidth = textWidth + spaceWidth;

          if (layers.backgroundColor) {
            this.context.fillStyle = layers.backgroundColor;
            this.context.fillRect(x, y - 1, finalWidth, this.fontSize);
          }

          this.context.fillStyle = layers.textColor;
          this.context.fillText(token, x, y);

          // Move x position for the next token
          x += finalWidth;
        }
      }
    }

    // Handling pixels
    else if (tokens[0] === '$') {
      tokens.shift();
      let x = 0;
      let fontSize = this.fontSize;

      let currentColor = '#FFFFFF';

      tokens.forEach((token) => {
        if (token.startsWith('#')) {
          // Change the pixel color
          const colorKey = token.slice(1);
          currentColor =
            this.colors[colorKey as keyof typeof this.colors] || '#FFFFFF';
          this.context.fillStyle = currentColor;
        } else if (token.startsWith(':')) {
          const command = token.slice(1);
          if (!isNaN(+command)) {
            fontSize = Number(command);
          }
        } else {
          // Draw pixels based on characters
          for (const character of token) {
            if (character === '0') {
              this.context.fillRect(x, y, fontSize, fontSize);
            }
            x += fontSize;
          }
        }
      });
    }
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
