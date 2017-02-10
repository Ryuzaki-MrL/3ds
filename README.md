# The Homebrew Database

Overview:
It's a website aimed to show information about every single 3DS homebrew published on this scene to date.
For this to happen, I will need the help and colaboration of the homebrew community as a whole.
You can start by forking this repository. From there you can add new entries to the database (maintained in JSON format and manually updated), helping with the site's design and functionality, or translating the page to other languages. Then you have to send me a pull request with the changes/additions.
See [CONTRIBUTING.md](https://github.com/Ryuzaki-MrL/3ds/blob/gh-pages/CONTRIBUTING.md) for more info.

Features:
- Search homebrew by name, author, release date, category, description, development status, and even some preset keywords/tags for each homebrew.
- Sort homebrew list by title, category, author and release date.
- Filter homebrew list by category, release status and development status.
- Click on a homebrew's title to show detailed info such as long description, screenshot, latest version and entrypoint compatibility.
- A small statistics board on the bottom-right corner of the page, showing how many homebrew there are for each category and status.
- URL query string parsing, explained below.

Query string parsing:
- ?search= (this value can be anything).
- ?sort=criteria|order (criteria can be either "title", "author", "cat" or "release" and order can be "asc" or "desc").
- ?filter=criteria1|criteria2|...|criteriaN (criteria can be app, game, emu, cfw, released, unreleased, unkdate, wip, discontinued, finished, unknown).
- ?show=id (id is the homebrew index between 0 and [homebrew total]. This opens the detailed info panel for that homebrew).
- ?legacy=true (use this for loading the old database instead of titledb).

This project uses:
- [listjs](http://listjs.com/)
- [jquery](http://jquery.com/)
- [titledb](https://titledb.com/)
