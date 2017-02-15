import { defaults, includes } from 'lodash';
import { TextDocument, TextDocumentEnd } from 'mutxtor';
import Promise from 'bluebird';

export default function md2remark(markdown, options) {

  const doc = new TextDocument(markdown);

  // Convert Markdown headers to --- slide separators
  doc.buildParser('MarkdownHeader').regexp(/^(#+)\s*(.+)$/gm).mutate(function(data) {
    const headerLevel = data.match[1].length;
    if (headerLevel >= 2) {
      this.prepend('---\n');
    }
  }).add();

  // Remove doctoc comment (if any)
  doc.buildParser('Doctoc').regexp(/^<\!--\s*START\s+doctoc\s*[^\n]+-->[\s\S]+<\!--\s*END\s+doctoc\s+[^\n]+-->/m).mutate(function(data) {
    this.remove();
  }).add();

  // Convert "<!-- slide-column WIDTH -->" to ".grid-WIDTH[" (and close it
  // before the next grid element or at the end of the document)
  doc.buildParser('SlideColumn').regexp(/<\!--\s*slide-column(?:\s*(\d+))?\s*-->/gm).initialize(function(data) {
    this.columnWidth = data.match[1] ? parseInt(data.match[1], 10) : 0;
  }).mutate(function() {

    let width = this.columnWidth;

    // If no WIDTH is specified, deduce it from the number of columns
    // and the remaining width
    if (!width) {
      const otherColumns = this.document.query().around(this).where('type', 'SlideColumn').until(isColumnBreak).all();
      const currentWidth = otherColumns.reduce((memo, c) => memo + c.columnWidth, 0);
      const autoColumns = otherColumns.filter((c) => !c.columnWidth);
      // TODO: validate that computed column widths are valid unsemantic grid widths (multiples of 5 or 33)
      width = ((currentWidth > 0 && currentWidth % 33 === 0 ? 99 : 100) - currentWidth) / (autoColumns.length + 1);
    }

    this.replace('.grid-' + width + '[');

    const closingElement = this.document.findNext(this, isGridElement);
    this.document.prependTo(closingElement || TextDocumentEnd, '\n]\n');
  }).add();

  // Convert "<!-- slide-container -->" to ".container[" (and close it before the
  // next grid element or at the end of the document)
  doc.buildParser('SlideContainer').regexp(/<\!--\s*slide-container\s*-->/gm).mutate(function(data) {
    this.replace('.container[');

    const closingElement = this.document.findNext(this, isColumnBreak);
    this.document.prependTo(closingElement || TextDocumentEnd, '\n]\n');
  }).add();

  // Convert "<!-- slide-front-matter FRONTMATTER -->" to "FRONTMATTER" and move
  // it before the previous Markdown header
  doc.buildParser('SlideFrontMatter').regexp(/<\!--\s*slide-front-matter\s*([^\n]+?)\s*-->/gm).mutate(function(data) {
    const previousHeader = this.document.findPrevious(this, (e) => e.type == 'MarkdownHeader');
    this.remove();

    if (previousHeader) {
      previousHeader.prepend(data.match[1] + '\n');
    }
  }).add();

  // Convert "<!-- slide-notes -->" to "???"
  doc.buildParser('SlideNotes').regexp(/<\!--\s*slide-notes\s*-->/gm).mutate(function(data) {
    this.replace('???');
  }).add();

  // A "grid" element is any element that should break a column row
  function isGridElement(element) {
    return includes([ 'MarkdownHeader', 'SlideColumn', 'SlideContainer', 'SlideNotes' ], element.type);
  }

  function isColumnBreak(element) {
    return element.type != 'SlideColumn' && isGridElement(element);
  }

  return Promise.resolve(doc.mutate()).get('text');
}
