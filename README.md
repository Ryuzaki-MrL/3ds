# The Homebrew Database

## Overview

The Homebrew Database is a website designed to show information about every published Nintendo 3DS homebrew application.

Collaboration from the homebrew community is needed to develop this website. To contribute, fork this repository to add new database entries (manually-entered JSON), improve the website's design and functionality or translate the website to a different language. After you have made your changes or additions, send a detailed pull request. See [CONTRIBUTING.md](./blob/gh-pages/CONTRIBUTING.md) for more information about contributing.

## Features

- Search for homebrew by name, author, release date, category, description, development status and preset keywords and tags.
- Sort the homebrew list by title, category, author and release date.
- Filter the homebrew list by category, release status and development status.
- Click on a homebrew application's title to show detailed information such as long description, screenshot, latest version and entrypoint compatibility.
- A brief statistics panel on the bottom-right corner shows how many homebrew applications each category and status contains.
- URL query strings are parsed as explained below.

## Query string parsing

|Query String | Valid Arguments | Details |
|-------------|-----------------|---------|
| ?search=**value** | **value**: any string  | |
| ?sort=**criteria**\|**order** | **criteria**: title, author, cat, release.<br>**order**: asc, desc | This query sorts the results by the specified criteria and ordering. |
| ?filter=<br>**criteria1**\|**...**\|**criteriaN** | **criteria**: app, game, emu, cfw, released, unreleased, unkdate, wip, discontinued, finished, unknown | This query filters the results by the specified criteria and ordering. |
| ?show=**id** | **id**: any non-negative integer | **id** is the homebrew index between 0 and the total number of homebrew entries. |
| | | This query opens the detailed information panel for the specified homebrew. |
| ?legacy=true | | This query loads the old database instead of titledb. |

## Software Used

- [listjs](http://listjs.com/)
- [jquery](http://jquery.com/)
- [titledb](https://titledb.com/)
