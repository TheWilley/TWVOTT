const textTV = new TWVOTT("textTVCanvas", { width: 500, height: 500, fontSize: 12 });

textTV.addPages([
    {
        pageNumber: 1,
        content: `
        >
        > ¶¶ :30 #green Welcome!
        >
        >
        > ¶¶ TWVOTT (The Worse Version Of Text TV) is a custom clsas I've 
        > ¶¶ built to communicate info trough the canvas element. The name is
        > ¶¶ confusing on purpose...
        
        > ¶¶ It works very well for basic stuff, like text
        > ¶¶ with #green support for inline text colors #white and ##blue #red inline background colors
        > ¶¶ and other cool stuff like :b bold text :n or :i italic text.
        > 
        > :c Here¶is¶some¶centered¶text...
        > :c :u and¶some¶underlined¶text...
        >
        > :c :x and¶some¶striketrough¶text
        >
        > ¶¶ :b You can also insert data:
        > ¶¶ This is page ^p of ^pc and todays date is ^d and a random
        > ¶¶ number between 1-99 is ^r1-9 and the current time is ^t
        >
        > ¶¶ #yellow Read more on page 2
    `
    }, {
        pageNumber: 2,
        content: `
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
    `
    }, {
        pageNumber: 3,
        content: `
        >
        > ¶¶ You can also draw images from a URL
        >
        @ 100 100 3 https://fastly.picsum.photos/id/473/200/300.jpg?hmac=WYG6etF60iOJeGoFVY1hVDMakbBRS32ZDGNkVZhF6-8
        > 
        > ¶¶ Here is the same image but in another width
        >
        @ 200 200 3 https://fastly.picsum.photos/id/473/200/300.jpg?hmac=WYG6etF60iOJeGoFVY1hVDMakbBRS32ZDGNkVZhF6-8
    `
    }
])

textTV.loadPage(1);

document.getElementById("nextPage").addEventListener("click", () => {
    textTV.nextPage()
    document.getElementById("currentPage").innerText = textTV.currentPage
})

document.getElementById("prevPage").addEventListener("click", () => {
    textTV.previousPage()
    document.getElementById("currentPage").innerText = textTV.currentPage
})

document.getElementById("currentPage").innerText = textTV.currentPage


