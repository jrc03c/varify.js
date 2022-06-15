# Introduction

**js-text-tools** is just a little collection of tools for modifying text. It can be used either in the command line or in JS projects.

# Installation

To use in the command line:

```bash
git clone https://github.com/jrc03c/js-text-tools.js
cd js-text-tools
npm link
```

Or to use in Node or the browser:

```bash
npm install --save https://github.com/jrc03c/js-text-tools.js
```

# Usage

In Node / bundlers:

```js
const {
  camelify,
  indent,
  kebabify,
  snakeify,
  unindent,
  wrap,
} = require("@jrc03c/js-text-tools")
```

In the browser (standalone):

```html
<script src="path/to/dist/js-text-tools.js"></script>
<script>
  // import functions individually
  const { camelify, indent, kebabify, snakeify, unindent, wrap } = JSTextTools

  // or dump everything into the global scope
  JSTextTools.dump()
</script>
```

In the command line (where all results are written out to `stdout`):

```bash
camelify "Hello, world!"
# helloWorld

kebabify "Hello, world!"
# hello-world

snakeify "Hello, world!"
# hello_world

# wrap the lines in somefile.txt at 80 characters
wrap somefile.txt

# wrap the lines in somefile.txt at 40 characters
wrap somefile.txt 40

# wrap the lines in somefile.txt at 40 characters and give wrapped lines a
# hanging indent of two asterisks and a space
wrap somefile.txt 40 "** "
```

# API

## `camelify(text)`

Returns the text in camel-case.

```js
camelify("Hello, world!")
// helloWorld
```

## `indent(text, chars="")`

Returns the text with all lines indented by `chars`. By default, `chars` is an empty string.

```js
indent("Hello, world!", 2, "\t")
// \t\tHello, world!
```

## `kebabify(text)`

Returns the text in kebab-case.

```js
kebabify("Hello, world!")
// hello-world
```

## `snakeify(text)`

Returns the text in snake-case.

```js
snakeify("Hello, world!")
// hello_world
```

## `unindent(text)`

Returns the text with all lines unindented by the same number of characters. For example, if the _smallest_ amount of indentation is 4 spaces, then each line will be unindented by 4 spaces.

For example, suppose I have a file called `message.txt` with this content:

```
    Hello, world!
      My name is Josh.
        What's your name?
```

The smallest amount of indentation in the file is 4 spaces. So, unindenting it will move all lines to the left by 4 spaces.

```js
const { unindent } = require("@jrc03c/js-text-tools")
const fs = require("fs")
const message = fs.readFileSync("message.txt", "utf8")
const unindentedMessage = unindent(message)
fs.writeFileSync("unindented-message.txt", unindentedMessage, "utf8")
```

The contents of `unindented-message.txt` would be:

```
Hello, world!
  My name is Josh.
    What's your name?
```

**NOTE:** The `unindent` function does _not_ pay attention to whether indentation consists of spaces or tabs. It only cares whether or not a character is a whitespace character. It also makes no attempt to make the whitespace characters consistent (i.e., it doesn't try to begin each line with _all_ spaces or _all_ tabs); it merely removes the minimum number of whitespace characters from each line and returns the result.

## `wrap(text, maxLineLength=80, hangingIndentPrefix="")`

Returns the text with all lines wrapped to a maximum length of `maxLineLength`. By default, the `maxLineLength` is 80 in the browser or the minimum of 80 and the number of `stdout` columns in the command line. Note that this function only wraps at spaces; it does not wrap mid-word, and it does not attempt to hyphenate words. The wrapping _does_ preserve indentation, though, and wrapped lines can be prefixed with `hangingIndentPrefix` (which is an empty string by default).

```js
const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mollis tellus eu mi condimentum, a congue ipsum luctus. Donec vel suscipit dolor, vitae faucibus massa. Curabitur rhoncus semper tortor et mattis. Nullam laoreet lobortis nibh eget viverra. Nam molestie risus vitae ante placerat convallis. Pellentesque quis tristique dui. Vivamus efficitur mi erat, nec gravida felis posuere at. Donec sapien ipsum, viverra et aliquam quis, posuere ac ligula. Aenean egestas tincidunt mauris, in hendrerit tortor malesuada id. Proin viverra sodales ex eu fermentum. Aenean nisl ipsum, tristique venenatis massa eget, tempor facilisis felis. Praesent aliquam sem vitae arcu porta commodo. Aliquam tempor sollicitudin dapibus. Nulla ullamcorper orci eu ultricies cursus."

wrap(text, 20, "-- ")

/*
Lorem ipsum dolor
-- sit amet,
-- consectetur
-- adipiscing elit.
-- Nam mollis tellus
-- eu mi
-- condimentum, a
-- congue ipsum
-- luctus. Donec vel
-- suscipit dolor,
-- vitae faucibus
-- massa. Curabitur
-- rhoncus semper
-- tortor et mattis.
-- Nullam laoreet
-- lobortis nibh
-- eget viverra. Nam
-- molestie risus
-- vitae ante
-- placerat
-- convallis.
-- Pellentesque quis
-- tristique dui.
-- Vivamus efficitur
-- mi erat, nec
-- gravida felis
-- posuere at. Donec
-- sapien ipsum,
-- viverra et
-- aliquam quis,
-- posuere ac
-- ligula. Aenean
-- egestas tincidunt
-- mauris, in
-- hendrerit tortor
-- malesuada id.
-- Proin viverra
-- sodales ex eu
-- fermentum. Aenean
-- nisl ipsum,
-- tristique
-- venenatis massa
-- eget, tempor
-- facilisis felis.
-- Praesent aliquam
-- sem vitae arcu
-- porta commodo.
-- Aliquam tempor
-- sollicitudin
-- dapibus. Nulla
-- ullamcorper orci
-- eu ultricies
-- cursus.
*/
```
