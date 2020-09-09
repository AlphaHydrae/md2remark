const md2remark = require('../src');
const { expect, normalize } = require('./utils');

describe('<!-- slide-container -->', () => {
  it('inserts a container', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      <!-- slide-container -->
      Vivamus eu vestibulum mauris, et suscipit libero.
      Cras maximus dui enim, sit amet congue eros vestibulum at.
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      .container[
      Vivamus eu vestibulum mauris, et suscipit libero.
      Cras maximus dui enim, sit amet congue eros vestibulum at.
      ]

    `));
  });

  it('breaks <!-- slide-column -->', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      <!-- slide-column -->
      50% width column

      <!-- slide-column -->
      50% width column

      <!-- slide-container -->

      <!-- slide-column -->
      33% width column

      <!-- slide-column -->
      33% width column

      <!-- slide-column -->
      33% width column
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      .grid-50[
      50% width column


      ]
      .grid-50[
      50% width column


      ]
      .container[

      .grid-33[
      33% width column


      ]
      .grid-33[
      33% width column


      ]
      .grid-33[
      33% width column
      ]

      ]

    `));
  });
});
