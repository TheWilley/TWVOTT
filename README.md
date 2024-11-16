# TWVOTT - The Worse Version Of Text-TV

This is a library to communicate information using a [Text-TV](https://www.svt.se/text-tv/100) alike system. It is currently extremely basic and serves more as a learning experience rather than something one would consider useful. The project name should become self explonatory once you've read the documentation.

Please see the example folder if you're (understandably) confused.

## Installation

You can install the library via NPM:

```bash
npm install twvott
```

## Links

- [Documentation](https://github.com/TheWilley/TWVOTT/blob/main/docs/docs.md)
- [Writing Content](https://github.com/TheWilley/TWVOTT/blob/main/docs/writing_content.md)

## Changelog

- **0.1.0** - First release
- **0.2.0** - Added text centering, underline and striketrough commands
- **0.3.0** - Added image support and error page customization
- **0.4.0** - Added preload support
- **0.5.0** - Added lineHeight option, an editPage function and fixed multiple bugs regarding line coordinates
- **0.5.1** - Options are no longer required
- **0.5.2** - Implemented 0.5.1 as I forgot to build before publishing
- **0.5.3** - Fixed bug where preloaded pages would be added before finishing rendering
- **0.6.0** - Removed flicker when preloading and added callback support for page contents in "pages" parameter
- **0.7.0** - Added new function for adding multiple pages as well as a new tag to insert data
- **0.7.1** - Typescript now expects an array in the "addPages" function

## License

[MIT](https://github.com/TheWilley/twvott/blob/main/LICENSE)
