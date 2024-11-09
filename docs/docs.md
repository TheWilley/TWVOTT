# Documentation

## TWVOTT Class

```javascript
const textTV = new TWVOTT(targetCanvas, options?);
```

### Parameters

- **`targetCanvas`** (String):

  - The `id` of the target `<canvas>` HTML element where the text will be displayed.

- **`options`** (Object):
  - A configuration object which can have the following properties:
    - **`width`** (Number): Width of the canvas in pixels.
    - **`height`** (Number): Height of the canvas in pixels.
    - **`fontSize`** (Number): Font size of the text in pixels.
    - **`errorPage`** (String): The error page to show on pages without content

### Example Usage

```javascript
const textTV = new TWVOTT('textTVCanvas', {
  width: 500,
  height: 500,
  fontSize: 12,
});
```

## Methods

### `clearScreen(color)`

Clears the screen and fills the background with the specified color.

- **Parameters:**

  - **`color`** (String, optional): The background color to fill the screen with. Defaults to `this.colors.black`.

- **Example:**

  ```javascript
  textTV.clearScreen('#000000'); // Clears the screen with black color
  ```

### `loadPage(pageNumber)`

Loads and renders a specific page content on the canvas.

- **Parameters:**

  - **`pageNumber`** (Number): The page to render.

- **Example:**

  ```javascript
  textTV.loadPage(3); // Loads and displays page number 3
  ```

### `addPage(pageNumber, content)`

Adds a new page with the specified page number and content.

- **Parameters:**

  - **`pageNumber`** (Number): The page number to assign to the new page.
  - **`content`** (String): The content to display on the page.

- **Example:**

  ```javascript
  textTV.addPage(5, '> Welcome to page 5!'); // Adds page 5 with content
  ```

### `nextPage()`

Navigates to the next page.

- **Example:**

  ```javascript
  textTV.nextPage(); // Advances to the next page
  ```

### `previousPage()`

Navigates to the previous page.

- **Example:**

  ```javascript
  textTV.previousPage(); // Goes back to the previous page
  ```

## Text Formatting

### **Text Mode**

- **Activation**: `>`
- **Colors**
  - **Text Colors**: Use `#color` to set the text color.
  - **Background Colors**: Use `##color` for inline background colors (e.g., `##red`).
  - **Supported Colors**:
    - `#white`, `#black`, `#red`, `#green`, `#blue`, `#yellow`, `#magenta`, `#cyan`
- **Text Styling**
  - **Bold Text**: `:b` for bold text.
  - **Italic Text**: `:i` for italicized text.
  - **Normal Text**: `:n` to revert to normal text.
  - **Center Text**: `:c` to center text.
  - **Underline Text**: `:u` to underline text.
  - **Strikethrough Text**: `:x` for strikethrough text.
- **Font Size**
  - Use `:number` to set the font size (replace `number` with a specific size).

### **Pixel Mode**

- **Activation**: `$`
- **Drawing Elements**
  - Use `¶` for space.
  - Use `0` for pixels.
  - Specify colors with `#color`.

### **Image Mode**

- **Activation**: `@`
  - Syntax: `[width] [height] [padding] [url]`
    - `width` is the image width
    - `height` is the image height
    - `padding` is the amount of spacing between the left side border and the image
    - `url` is the URL to a non [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) restricted image
