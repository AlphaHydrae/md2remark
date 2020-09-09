const md2remark = require('../src');
const { expect, normalize } = require('./utils');

describe('<!-- slide-notes -->', () => {
  it('inserts slide notes', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      <!-- slide-notes -->

      Vivamus eu vestibulum mauris, et suscipit libero.
      Cras maximus dui enim, sit amet congue eros vestibulum at.
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      ???

      Vivamus eu vestibulum mauris, et suscipit libero.
      Cras maximus dui enim, sit amet congue eros vestibulum at.
    `));
  });
});
