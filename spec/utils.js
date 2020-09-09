const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

exports.expect = chai.expect;

exports.normalize = text => {
  // Replace one line of leading and trailing whitespace.
  const stripped = text.replace(/^[ \t]*\n/, '').replace(/\n[ \t]*$/, '');

  let lines = stripped.split(/\n/);

  const firstLineWithWhitespace = lines.filter(line => line.match(/^\s+/))[0];
  const leadingWhitespaceMatch = firstLineWithWhitespace ? firstLineWithWhitespace.match(/^\s+/) : undefined;
  const leadingWhitespace = leadingWhitespaceMatch ? leadingWhitespaceMatch[0] : '';
  if (linesHaveLeadingWhitespace(lines, leadingWhitespace)) {
    lines = lines.map(line => line.slice(leadingWhitespace.length));
  }

  return lines.join('\n');
};

function linesHaveLeadingWhitespace(lines, leading) {
  return lines.filter(line => line !== '').every(line => line.indexOf(leading) === 0);
}
