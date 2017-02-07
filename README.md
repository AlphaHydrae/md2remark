# md2remark

> Convert regular Markdown to [Remark][remark] slides, with a few extensions.

## Use as a Node.js module

Install it: `npm install --save md2remark`

Use it in your code:

```js
const md2remark = require('md2remark');

const markdown = `
# Title

Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## Subtitle

* Suspendisse potenti.
* Proin vel elit eget dolor dignissim gravida.
`;

md2remark(markdown).then(function(slidesMarkdown) {
  console.log(slidesMarkdown);
});
```




[remark]: https://remarkjs.com/
