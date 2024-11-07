# TWVOTT - The Worse Version Of Text Tv

This is a library to communicate information using a [Text-TV](https://www.svt.se/text-tv/100) alike system. It is currently extremely basic and serves more as a learning experience rather than something one would consider useful. The project name should become self explonatory once you've read the documentation.

Please see the example folder if you're (understandably) confused.

## Setup

```bash
# Installing deps
$ npm i

# Running tsc
$ npm run build

# Running tsc with watch mode
$ npm run dev
```

```html
<script src="twvott.js"></script>
```

## Writing content

There are two modes: "text" and "pixel".

### Text Mode

Lets look at an example:

```
> ¶¶ :30 #green Welcome!
>
>
> ¶¶ TWVOTT (The Worse Version Of Text TV) is a custom class I've
> ¶¶ built to communicate info trough the canvas element. The name is
> ¶¶ confusing on purpose...

> ¶¶ It works very well for basic stuff, like text
> ¶¶ with #green support for inline text colors #white and  ##blue #red inline background colors ##black
> ¶¶ and other cool stuff like :b bold text :n or :i italic text.
>
> ¶¶ #yellow Read more on page 2
```

This creates the following image:

![text](https://github.com/user-attachments/assets/553a753c-4fe8-4b6b-8695-12b3000338dd)

The first thing you may notice is that every line starts with a `>`. This indicates that you're writing text on that line. If you do not provide it, no text will be rendered.

The second thing you notice is the the two `¶` characters. These act as blank space, and can effectively be used as padding. For technical reasons, you can not just add many normal spaces after each other.

Next up, there is a `:30` at the first row. The `:` character acts as a "command" or "modifier" to text after it. In this case, the size is changed to 30. You can also make text bold with `:b`, italic with `:i` or normal with `:n`.

Lastly, there are colors. You can change the text color with one hashtag followed by a color name, for example: `#green`. Two hashtags instead modify the background color, for example: `##green`.

### Pixel Mode

Lets look at an example:

```
> ¶¶ You can also draw, wow!
>
$ ¶¶¶0¶0¶0¶0¶0¶
$ ¶¶0¶0¶0¶0¶0¶0
$ ¶¶¶0¶0¶0¶0¶0¶
$ ¶¶0¶0¶0¶0¶0¶0
>
> ¶¶ Different pixels colors are supported too:
>
$ ¶¶ #red ¶¶0¶0¶¶
$ ¶¶ #red ¶0¶0¶0
$ ¶¶ #red ¶0¶¶¶0
$ ¶¶ #red ¶¶0¶0
$ ¶¶ #red ¶¶¶0
```

This creates the following image:

![pixel](https://github.com/user-attachments/assets/f80afbcf-ff92-4b65-8841-1bb2dbce3c72)

Just as with the text, the `¶` acts as empty space and `#` followed by a color changes the color. A `0` represents an actual pixel. You cannot change pixel size, it is locked to the font size you set on the `fontSize` option in the class construcctor.

## Documentation

### TWVITT Class

```javascript
const textTV = new TWVOTT(targetCanvas, options);
```

#### Parameters

- **`targetCanvas`** (String):

  - The `id` of the target `<canvas>` HTML element where the text will be displayed.

- **`options`** (Object):
  - A configuration object with the following properties:
    - **`width`** (Number): Width of the canvas in pixels.
    - **`height`** (Number): Height of the canvas in pixels.
    - **`fontSize`** (Number): Font size of the text in pixels.

#### Example Usage

```javascript
const textTV = new TWVOTT('textTVCanvas', {
  width: 500,
  height: 500,
  fontSize: 12,
});
```

In this example:

- The `textTVCanvas` canvas element is targeted to render the text.
- The display area is set to `500x500` pixels.
- The font size of the text is set to `12` pixels.

### Methods

#### `clearScreen(color)`

Clears the screen and fills the background with the specified color.

- **Parameters:**

  - **`color`** (String, optional): The background color to fill the screen with. Defaults to `this.colors.black`.

- **Example:**

  ```javascript
  textTV.clearScreen('#000000'); // Clears the screen with black color
  ```

#### `loadPage(pageNumber)`

Loads and renders a specific page content on the canvas.

- **Parameters:**

  - **`pageNumber`** (Number): The page number to render.

- **Example:**

  ```javascript
  textTV.loadPage(3); // Loads and displays page number 3
  ```

#### `addPage(pageNumber, content)`

Adds a new page with the specified page number and content.

- **Parameters:**

  - **`pageNumber`** (Number): The page number to assign to the new page.
  - **`content`** (String): The content to display on the page.

- **Example:**

  ```javascript
  textTV.addPage(5, '> Welcome to page 5!'); // Adds page 5 with content
  ```

#### `nextPage()`

Navigates to the next page.

- **Example:**

  ```javascript
  textTV.nextPage(); // Advances to the next page
  ```

#### `previousPage()`

Navigates to the previous page.

- **Example:**

  ```javascript
  textTV.previousPage(); // Goes back to the previous page
  ```

### Text Formatting

- **Text Mode**
  - Activated using `>`
  - **Colors**
    - **Text Colors**:
      - Use `#color` to set the text color.
    - **Background Colors**:
      - Use `##color` for inline background colors (e.g., `##red`).
    - **Supported colors**:
      - `#white`
      - `#black`
      - `#red`
      - `#green`
      - `#blue`
      - `#yellow`
      - `#magenta`
      - `#cyan`
  - **Text Styling**:
    - **Bold Text**: Use `:b` to make text bold.
    - **Italic Text**: Use `:i` for italicized text.
    - **Normal Text**: Use `:n` to revert to normal text.
    - **Center Text**: Use `:c` to center text.
    - **Underline Text**: Use `:u` to underline text.
    - **Striketrough Text**: Use `:x` to striketrough text.
  - **Font Size**:
    - Use `:number` to set the font size, where `number` is a specific size.
- **Pixel Mode**:
  - Activated using `$`.
  - **Drawing**
    - Use `¶` for space, `0` for pixels, and specify colors with `#color`.

## Changelog

- **0.1.0** - First release
- **0.2.0** - Added text centering, underline and striketrough commands

## License

[MIT](https://github.com/TheWilley/md-links-archiver/blob/main/LICENSE)
