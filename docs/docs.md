# Documentation

## TWVOTT Class

```javascript
const textTV = new TWVOTT(targetCanvas, options?, pages?);
```

### Parameters

- **`targetCanvas`** (String):

  - The `id` of the target `<canvas>` HTML element where the text will be displayed.

- **`options`** (Object):
  - A configuration object which can have the following properties:
    - **`width`** (Number): Width of the canvas in pixels.
    - **`height`** (Number): Height of the canvas in pixels.
    - **`fontSize`** (Number): Font size of the text in pixels.
    - **`errorPage`** (String): The error page to show on pages without content.
    - **`preload`** (Boolean): If the pages should be [preloaded](#async-preloadpages).
    - **`lineHeight`** (Number): The line height between each line.
- **`pages`** (Object Array):
  - An array of objects representing pages. Can be used in place of the [`addPage`](#addpagepagenumber-content) function. An object requires the following properties:
    - **`pageNumber`** (Number): The page number to assign to the new page.
    - **`content`** (String): The content to display on the page.

### Example Usage

```javascript
const textTV = new TWVOTT('textTVCanvas', {
  width: 500,
  height: 500,
  fontSize: 12,
  errorPage: '> #red Nothing on this page!',
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

### `async preloadPages()`

Preloads pages before rendering them. This means that instead of re-rendering all pages everytime they are only rendered
once, then stored and loaded from memory. This is more efficent if you're using alot of image tags, but generally unnecessary if you
only use text and pixel tags.

- **Example:**

```javascript
await textTV.preloadPages();
loadPage(1);
```

### `async loadPage(pageNumber)`

Loads and renders a specific page content on the canvas.

- **Parameters:**

  - **`pageNumber`** (Number): The page to render.

- **Example:**

  ```javascript
  await textTV.loadPage(3); // Loads and displays page number 3
  ```

### `async addPage(pageNumber, content)`

Adds a new page with the specified page number and content.

- **Parameters:**

  - **`pageNumber`** (Number): The page number to assign to the new page.
  - **`content`** (String | Function | Promise): The content to display on the page, can be a string, function or promise returning a string.

- **Example:**

  ```javascript
  textTV.addPage(5, '> Welcome to page 5!'); // Adds page 5 with content
  ```

### `async addPages(pageContents)`

Adds multiple new page with the specified page number and content.

- **Parameters:**

  - **pageContent**: An array of objects, where each object consists of the following properties:
    - **`pageNumber`** (Number): The page number to assign to the new page.
    - **`content`** (String | Function | Promise): The content to display on the page, can be a string, function or promise returning a string.

- **Example:**

  ```javascript
  textTV.addPages([
    {
      pageNumber: 5,
      content: '> Welcome to page 5!',
    },
    {
      pageNumber: 6,
      content: '> Welcome to page 6!',
    },
    {
      pageNumber: 7,
      content: '> Welcome to page 7!',
    },
  ]);
  ```

### `modifyPage(pageNumber, content)`

Modifies a page with the specified page number and content. It serves as an alias for [`addPage`](#addpagepagenumber-content).

- **Parameters:**

  - **`pageNumber`** (Number): The number of the page to edit.
  - **`content`** (String): The content to display on the page.

- **Example:**

  ```javascript
  textTV.editPage(5, '> Edit to page 5!'); // Edit page 5 with content
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
  - **Text Colors**: Use `#[color]` to set the text color.
  - **Background Colors**: Use `##[color]` for inline background colors (e.g., `##red`).
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
  - Use `:[number]` to set the font size (replace `number` with a specific size).
- **Inserts**
  - **Current Page**: `^p` for the current page number.
  - **Number of Pages**: `^pc` for the total number of pages.
  - **Date**: `^d` for todays date.
  - **Time**: `^t` for current time.
  - **Random Number**: `^r[number]-[number]` for a random number between two ranges.

### **Pixel Mode**

- **Activation**: `$`
- **Drawing Elements**
  - Use `¶` for space.
  - Use `0` for pixels.
  - Specify colors with `#color`.

### **Image Mode**

- **Activation**: `@`
  **Syntax**
  - Use the following syntax: `[width] [height] [padding] [url]`
  - `width` is the image width
  - `height` is the image height
  - `padding` is the amount of spacing between the left side border and the image
  - `url` is the URL to a [non-CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) restricted image
