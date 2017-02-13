import { defaults, includes } from 'lodash';
import { TextDocument } from 'mutxtor';
import Promise from 'bluebird';

export default function md2remark(markdown, options) {

  const doc = new TextDocument(markdown);

  doc.buildParser('MarkdownHeader').regexp(/^(#+)\s*(.+)$/gm).mutate(function(data) {
    const headerLevel = data.match[1].length;
    if (headerLevel >= 2) {
      this.prepend('---\n');
    }
  }).add();

  doc.buildParser('Doctoc').regexp(/^<\!--\s*START\s+doctoc\s*[^\n]+-->[\s\S]+<\!--\s*END\s+doctoc\s+[^\n]+-->/m).mutate(function(data) {
    this.remove();
  }).add();

  doc.buildParser('SlideColumn').regexp(/<\!--\s*slide-column\s*(\d+)\s*-->/gm).mutate(function(data) {
    this.replace('.grid-' + data.match[1] + '[');

    const closingElement = this.document.findNext(this, isGridElement);
    if (closingElement) {
      closingElement.prepend(']\n');
    } else {
      this.document.append(this, ']\n');
    }
  }).add();

  doc.buildParser('SlideContainer').regexp(/<\!--\s*slide-container\s*-->/gm).mutate(function(data) {

    this.replace('.container[');

    const closingElement = this.document.findNext(this, (e) => isGridElement(e) && e.type != 'SlideColumn');
    if (closingElement) {
      closingElement.prepend(']\n');
    } else {
      this.document.append(this, ']\n');
    }
  }).add();

  doc.buildParser('SlideFrontMatter').regexp(/<\!--\s*slide-front-matter\s*([^\n]+?)\s*-->/gm).mutate(function(data) {
    const previousHeader = this.document.findPrevious(this, (e) => e.type == 'MarkdownHeader');
    this.remove();

    if (previousHeader) {
      previousHeader.prepend(data.match[1] + '\n');
    }
  }).add();

  doc.buildParser('SlideNotes').regexp(/<\!--\s*slide-notes\s*-->/gm).mutate(function(data) {
    this.replace('???');
  }).add();

  function isGridElement(element) {
    return element.grid || includes([ 'MarkdownHeader', 'SlideColumn', 'SlideContainer', 'SlideNotes' ], element.type);
  }

  return Promise.resolve(doc.mutate()).get('text');
}
