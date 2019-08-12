# Wuffle

[![Build Status](https://travis-ci.com/nikku/wuffle.svg?branch=master)](https://travis-ci.com/nikku/wuffle) ![Maturity pre-release](https://img.shields.io/badge/maturity-pre--release-orange.svg)

A multi-repository task board for [GitHub issues](https://guides.github.com/features/issues/).

<p>
  <a target="_blank" rel="noopener noreferrer" href="https://github.com/nikku/wuffle">
    <img src="https://raw.githubusercontent.com/nikku/wuffle/master/docs/screenshot.png" width="100%" alt="Wuffle Screenshot" style="max-width:100%;" />
  </a>
</p>


## Features

* Multi-repository / organization support
* Maps cards to columns via issue labels and/or close states
* Allows you to filter cards by name, issue label, and more
* Automatically moves cards across columns, as you develop
* Supports private repositories: Visitors only see cards for issues they see on GitHub, too
* Contributors can move/reorder cards
* Simple setup: Connects to GitHub as a [GitHub app](https://developer.github.com/apps/)


## Resources

* [Issues](https://github.com/nikku/wuffle/issues)
* [Changelog](https://github.com/nikku/wuffle/blob/master/CHANGELOG.md)
* [Setup and Run](https://github.com/nikku/wuffle/blob/master/docs/SETUP.md)


## Philosophy

Some key aspects separate [Wuffle](https://github.com/nikku/wuffle) from the GitHub task board competition:

* __[GitHub issues](https://guides.github.com/features/issues/) are the source of truth.__ We read and store columns, relationships and everything else directly on GitHub. The only exception is issue order (not supported by GitHub, so far).

* __Tight integration with the [GitHub flow](https://guides.github.com/introduction/flow/).__ Your issues move automatically across the board. The board is always up to date with things going on in development.

* __Publicly accessible.__ You can share your project status without restrictions. Applied board filters are shareable deep links. We do, however, only display those issues to a visitor that she sees on GitHub, too. You'd like to see cards of your private repositories? Log-in with your GitHub identity and see them pop up in the mapped column.

* __Hackable.__ Wuffle is open source, MIT licensed. Contribute to it to make it even better. Self-host it and stay the owner of your data.


## Setup and Run

Read the [setup instructions](https://github.com/nikku/wuffle/blob/master/docs/SETUP.md) to learn how to set up and run the board.


## Components

* [board](https://github.com/nikku/wuffle/blob/master/packages/board) - the task board front-end
* [app](https://github.com/nikku/wuffle/blob/master/packages/app) - the back-end and board API


## License

[MIT](https://github.com/nikku/wuffle/blob/master/LICENSE)
