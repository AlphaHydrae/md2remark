import { defaults, includes } from 'lodash';
import { TextDocument } from 'mutxtor';
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
  doc.buildParser('SlideColumn').regexp(/<\!--\s*slide-column(?:\s*(\d+))?\s*-->/gm).mutate(function(data) {
    this.replace('.grid-' + data.match[1] + '[');

    console.log('@@@@@@@@@@@@@@@');
    const previousColumns = this.document.query().last().before(this).where('type', 'SlideColumn').until((e) => e.type != 'SlideColumn' && isGridElement(e)).findAll();
    console.log(previousColumns.join(', '));

    const closingElement = this.document.findNext(this, isGridElement);
    if (closingElement) {
      closingElement.prepend(']\n');
    } else {
      this.document.append(this, ']\n');
    }
  }).add();

  // Convert "<!-- slide-container -->" to ".container" (and close it before the
  // next grid element or at the end of the document)
  doc.buildParser('SlideContainer').regexp(/<\!--\s*slide-container\s*-->/gm).mutate(function(data) {

    this.replace('.container[');

    const closingElement = this.document.findNext(this, (e) => isGridElement(e) && e.type != 'SlideColumn');
    if (closingElement) {
      closingElement.prepend(']\n');
    } else {
      this.document.append(this, ']\n');
    }
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
    return element.grid || includes([ 'MarkdownHeader', 'SlideColumn', 'SlideContainer', 'SlideNotes' ], element.type);
  }

  return Promise.resolve(doc.mutate()).get('text');
}
