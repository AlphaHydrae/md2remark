const md2remark = require('../src');
const { expect, normalize } = require('./utils');

const MARKDOWN = normalize(`
  # Lorem Ipsum

  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Vivamus eu vestibulum mauris, et suscipit libero.

  Cras maximus dui enim, sit amet congue eros vestibulum at.

  ## Dolor Sit Amet

  Sed bibendum libero ut justo rhoncus lacinia.
  Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
  Proin venenatis sodales ante a sagittis.

  Quisque sed ultricies dui.
  Etiam bibendum laoreet ornare.
  Phasellus molestie augue nulla, vitae iaculis diam fermentum pellentesque.
`);

describe('md2remark', () => {
  it('should work', async () => {
    await expect(md2remark(MARKDOWN)).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      Cras maximus dui enim, sit amet congue eros vestibulum at.

      ---
      ## Dolor Sit Amet

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
      Proin venenatis sodales ante a sagittis.

      Quisque sed ultricies dui.
      Etiam bibendum laoreet ornare.
      Phasellus molestie augue nulla, vitae iaculis diam fermentum pellentesque.
    `));
  });
});
