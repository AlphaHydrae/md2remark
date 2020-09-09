const md2remark = require('../src');
const { expect, normalize } = require('./utils');

describe('a doctoc comment block', () => {
  it('is removed', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      <!-- START doctoc -->
      * Lorem ipsum
      * Dolor sit amet
      <!-- END doctoc -->

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.



      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
    `));
  });
});
