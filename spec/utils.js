const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

exports.expect = chai.expect;

exports.normalize = text => {
  const stripped = text.replace(/(?:^\n+|(?:\n\s*)+$)/g, '');
  const lines = stripped.split(/\n/);

  const leadingWhitespace = lines[0].match(/^\s+/);
  if (!leadingWhitespace || !lines.filter(line => line !== '').every(line => line.indexOf(leadingWhitespace[0]) === 0)) {
    return lines.join('\n');
  }

  return lines.map(line => line.slice(leadingWhitespace[0].length)).join('\n');
};
