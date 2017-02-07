import { includes } from 'lodash';
import { TextDocument } from 'mutxtor';
import Promise from 'bluebird';

export default function md2remark(markdown, options) {

  const doc = new TextDocument(markdown);

  doc.buildParser('MarkdownTitle').regexp(/^(#+)\s*(.+)$/gm).mutate(function(data) {
    const titleLevel = data.match[1].length;
    if (titleLevel >= 2) {
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
    const previousTitle = this.document.findPrevious(this, (e) => e.type == 'MarkdownTitle');
    this.remove();

    if (previousTitle) {
      previousTitle.prepend(data.match[1] + '\n');
    }
  }).add();

  function isGridElement(element) {
    return element.grid || includes([ 'MarkdownTitle', 'SlideColumn', 'SlideContainer' ], element.type);
  }

  return Promise.resolve(doc.mutate()).get('text');
}
