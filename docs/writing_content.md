# Writing content

There are tree modes: "text", "pixel" and "image".

## Text Mode

Lets look at an example:

```
>
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

The second thing you notice is the the two `¶` characters. These act as blank space, and can effectively be used as padding. Multiple subsequent normal spaces does not create a larger gap, but multiple `¶` does.

Next up, there is a `:30` at the first row. The `:` character acts as a "command" or "modifier" to text after it. In this case, the size is changed to 30. You can also make text bold with `:b`, italic with `:i` or normal with `:n`.

Lastly, there are colors. You can change the text color with one hashtag followed by a color name, for example: `#green`. Two hashtags instead modify the background color, for example: `##green`.

## Pixel Mode

Lets look at an example:

```
>
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

Lines with pixels must start with a `$`. Just as with the text, the `¶` acts as empty space and `#` followed by a color changes the color. A `0` represents an actual pixel. You cannot change pixel size, it is locked to the font size you set on the `fontSize` option in the class constructor.

## Image Mode

Lets look at an example:

```
>
> ¶¶ You can also draw images from a URL
>
@ 100 100 3 https://fastly.picsum.photos/id/473/200/300.jpg?hmac=WYG6etF60iOJeGoFVY1hVDMakbBRS32ZDGNkVZhF6-8
>
> ¶¶ Here is the same image but in another width
>
@ 200 200 3 https://fastly.picsum.photos/id/473/200/300.jpg?hmac=WYG6etF60iOJeGoFVY1hVDMakbBRS32ZDGNkVZhF6-8
```

This creates the following image:

![image](https://github.com/user-attachments/assets/1af5fdb3-7142-4d54-8f9f-685cd01c7e83)

Images are activated using the `@` symbol. Four arguments are then needed to render the image: `width`, `height`, `padding` and `url`. These are added after each other in the aftermentioned order. The first image has a width and height of 200, a padding of 3 (how far to the right it will be) and a image from lorem picsum.
