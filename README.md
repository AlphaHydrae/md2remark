# md2remark

[![npm version](https://badge.fury.io/js/md2remark.svg)](https://badge.fury.io/js/md2remark)
[![Dependency Status](https://gemnasium.com/badges/github.com/AlphaHydrae/md2remark.svg)](https://gemnasium.com/github.com/AlphaHydrae/md2remark)

> Convert regular Markdown to [Remark][remark] slides, with a few extensions.

The problem this project tries to solve is that [Remark][remark] forces you to
write non-standard Markdown that doesn't render very well on GitHub, for
example:

* `???` for slide notes
* `---` to separate slides
* `class: center, middle` front matter at the beginning of slides

The `md2remark` utility takes regular Markdown with special HTML comments, and
converts these comments to Remark-compatible annotations. That way, your
Markdown looks good on GitHub, and can also be easily converted to Remark
slides.

See [Usage](#usage) for an example, and [the documentation](#documentation) to
know what HTML comments you can write.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
- [Documentation](#documentation)
  - [Start a new slide](#start-a-new-slide)
  - [Slide front matter](#slide-front-matter)
  - [Slide notes](#slide-notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->





## Usage

Install it with `npm install --save md2remark`, then use it in your code:

```js
const md2remark = require('md2remark');

const markdown = `
# Title

Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## Subtitle

* Suspendisse potenti.
* Proin vel elit eget dolor dignissim gravida.

<!-- slide-notes -->

Amazing slide.
`;

md2remark(markdown).then(function(slidesMarkdown) {
  console.log(slidesMarkdown);
});
```

This will output:

```txt
# Title

Lorem ipsum dolor sit amet, consectetur adipiscing elit.

---

## Subtitle

* Suspendisse potenti.
* Proin vel elit eget dolor dignissim gravida.

???

Amazing slide.
```





## Documentation

This documentation assumes that you are familiar with the basics of [Remark
slides][remark]. The full Remark documentation is available [here][remark-docs].



### Start a new slide

All Markdown headers in the `#` form are automatically prefixed with `---` to
start a new slide, except level 1 headers.

There's currently no other way to start a new slide with `md2remark` (to be
improved).

The following Markdown:

```md
# Main title

## Slide 1

### More
```

Will be converted to:

```md
---
# Main title

---
## Slide 1

---
### More
```



### Slide front matter

Add a `<!-- slide-front-matter FRONTMATTER -->` comment **after** a Markdown
header. The contents of the comment (`FRONTMATTER`) will be prepended to the
previous Markdown header.

The following Markdown:

```md
## Slide 1

<!-- slide-front-matter class: center, middle -->

Lorem ipsum dolor sit amet.

## Slide 2

Consectetur adipiscing elit.
```

Will be converted to:

```md
---
class: center, middle
## Slide 1

Lorem ipsum dolor sit amet.

---
## Slide 2

Consectetur adipiscing elit.
```



### Slide notes

Add a `<!-- slide-notes -->` comment in a slide. It will be replaced by the
Remark notes annotation `???`.

The following Markdown:

```md
## Slide

Lorem ipsum dolor sit amet.

<!-- slide-notes -->

Consectetur adipiscing elit.
```

Will be converted to:

```md
---
## Slide

Lorem ipsum dolor sit amet.

???

Consectetur adipiscing elit.
```



### Slide columns

This feature requires you to add [unsemantic][unsemantic] to your slides'
HTML template, as it is based on unsemantic's grid system:

```html
<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/unsemantic/1.1.3/unsemantic-grid-responsive.min.css'>
```

Use a `<!-- slide-column WIDTH -->` comment to define a column. You can only use
one level of columns (they cannot be nested).

If you want to add content after a column row, close the row with a
`<!-- slide-container -->` comment.

The following Markdown:

```md
## Slide

Consectetur adipiscing elit.

<!-- slide-column 40 -->

Lorem ipsum dolor sit amet.

<!-- slide-column 60 -->

Proin vel elit eget dolor dignissim gravida.

<!-- slide-container -->

Suspendisse potenti.
```

Will be converted to:

```md
## Slide

Consectetur adipiscing elit.

.grid-40[

Lorem ipsum dolor sit amet.

]
.grid-60[

Proin vel elit eget dolor dignissim gravida.

]
.container[

Suspendisse potenti.
]
```

For containers to work, you should add the following CSS to your slides' HTML
template:

```html
<style>
  .container {
    clear: both;
  }
</style>
```





[remark]: https://remarkjs.com/
[remark-docs]: https://github.com/gnab/remark/wiki/Markdown
[unsemantic]: http://unsemantic.com
