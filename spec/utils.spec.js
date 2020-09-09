const { expect, normalize } = require('./utils');

describe('utils', () => {
  describe('normalize', () => {
    it('removes leading/trailing new lines and leading whitespace from a text', () => {
      expect(normalize('\n  foo\n  bar\n')).to.equal('foo\nbar');
      expect(normalize('\n  foo\n    bar\n')).to.equal('foo\n  bar');
    });

    it('keeps extra leading and trailing new lines', () => {
      expect(normalize('\n\n\n  foo\n  bar\n\n\n\n')).to.equal('\n\nfoo\nbar\n\n\n');
    });

    it('only removes leading whitespace if all lines start with the same whitespace as the first line with whitespace', () => {
      expect(normalize('\n    foo\n  bar\n')).to.equal('    foo\n  bar');
    });

    it('returns simple strings unchanged', () => {
      expect(normalize('foo')).to.equal('foo');
    });

    it('returns text without leading whitespace unchanged', () => {
      expect(normalize('foo\nbar')).to.equal('foo\nbar');
    });
  });
});
