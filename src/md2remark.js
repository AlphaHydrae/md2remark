import Promise from 'bluebird';
import { readFile } from 'fs';
import { extend, includes } from 'lodash';
import { TextDocument, TextDocumentEnd } from 'mutxtor';
import { dirname, resolve } from 'path';

const readFileAsync = Promise.promisify(readFile);

export default function md2remark(markdown, options) {

  const doc = new TextDocument(markdown);

  options = extend({
    breadcrumbs: false
  }, options);

  // Convert Markdown headers to --- slide separators
  doc.buildParser('MarkdownHeader').regexp(/^(#+)\s*(.+)$/gm).initialize(function(data) {
    this.headerLevel = data.match[1].length;
    this.headerContent = data.match[2];
  }).mutate(function(data) {
    if (this.headerLevel >= 2) {
      this.prepend('---\n');

      if (options.breadcrumbs) {
        const breadcrumbs = collectBreadcrumbs(this);
        if (breadcrumbs.length) {
          // TODO: escape html
          const links = breadcrumbs.map(bc => `<a href="#${bc.slide}">${bc.content}</a>`);
          this.append(`\n\n.breadcrumbs[${links.join(' > ')}]`);
        }
      }
    }
  }).add();

  // Remove doctoc comment (if any)
  doc.buildParser('Doctoc').regexp(/^<\!--\s*START\s+doctoc\s*[^\n]+-->[\s\S]+<\!--\s*END\s+doctoc\s*[^\n]+-->/m).mutate(function(data) {
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
      width = (((currentWidth > 0 && currentWidth % 33 === 0) || currentWidth === 0 && otherColumns.length == 2 ? 99 : 100) - currentWidth) / (autoColumns.length + 1);
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

  // Insert other Markdown files
  doc.buildParser('SlideInsert').regexp(/<\!--\s*slide-include\s+([^\n]+?)\s*-->/gm).mutate(function(data) {
    // TODO: web-compatible version (load file through ajax request)?
    return loadFileToInsert(data.match[1]).then(markdownToInsert => this.replace(markdownToInsert));
  }).add();

  // Convert "<!-- slide-notes -->" to "???"
  doc.buildParser('SlideNotes').regexp(/<\!--\s*slide-notes\s*-->/gm).mutate(function(data) {
    this.replace('???');
  }).add();

  // A "grid" element is any element that should break a column row
  function isGridElement(element) {
    return includes([ 'MarkdownHeader', 'SlideColumn', 'SlideContainer', 'SlideNotes' ], element.type);
  }

  // An element breaks a column row if it's a grid element and not another column.
  function isColumnBreak(element) {
    return element.type != 'SlideColumn' && isGridElement(element);
  }

  // Recursively collect parent Markdown headers
  function collectBreadcrumbs(currentHeader, breadcrumbs) {
    if (!currentHeader) {
      breadcrumbs.pop();
      return breadcrumbs;
    }

    breadcrumbs = breadcrumbs || [];
    breadcrumbs.unshift({
      slide: currentHeader.document.query().before(currentHeader).where('type', 'MarkdownHeader').all().length + 1,
      content: currentHeader.headerContent,
    });

    let parentHeader = currentHeader.document
      .query()
      .before(currentHeader)
      .where('type', 'MarkdownHeader')
      .where(h => h.headerLevel < currentHeader.headerLevel)
      .descending()
      .first();

    return collectBreadcrumbs(parentHeader, breadcrumbs);
  }

  const loadedFiles = {};
  function loadFileToInsert(file) {

    const basePath = options.file ? dirname(options.file) : process.cwd();
    const absolutePath = resolve(basePath, file);

    if (loadedFiles[absolutePath]) {
      return Promise.resolve(loadedFiles[absolutePath]);
    }

    return readFileAsync(absolutePath, 'utf-8').tap(markdownToInsert => {
      loadedFiles[absolutePath] = markdownToInsert;
    });
  }

  return Promise.resolve().then(doc.mutate.bind(doc)).get('text');
}
