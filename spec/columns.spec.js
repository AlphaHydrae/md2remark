const md2remark = require('../src');
const { expect, normalize } = require('./utils');

describe('<!-- slide-column [width] -->', () => {
  it('splits slides into two equal-sized columns', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      <!-- slide-column -->
      50% width column

      <!-- slide-column -->
      50% width column
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      .grid-50[
      50% width column


      ]
      .grid-50[
      50% width column
      ]

    `));
  });

  it('splits slides into three equal-sized columns', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      <!-- slide-column -->
      33% width column

      <!-- slide-column -->
      33% width column

      <!-- slide-column -->
      33% width column
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      .grid-33[
      33% width column


      ]
      .grid-33[
      33% width column


      ]
      .grid-33[
      33% width column
      ]

    `));
  });

  it('splits slides into four equal-sized columns', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      <!-- slide-column -->
      25% width column

      <!-- slide-column -->
      25% width column

      <!-- slide-column -->
      25% width column

      <!-- slide-column -->
      25% width column
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      .grid-25[
      25% width column


      ]
      .grid-25[
      25% width column


      ]
      .grid-25[
      25% width column


      ]
      .grid-25[
      25% width column
      ]

    `));
  });

  it('splits slides into custom-sized columns', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      <!-- slide-column 10 -->
      10% width column

      <!-- slide-column 30 -->
      30% width column

      <!-- slide-column 20 -->
      20% width column

      <!-- slide-column 40 -->
      40% width column
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      .grid-10[
      10% width column


      ]
      .grid-30[
      30% width column


      ]
      .grid-20[
      20% width column


      ]
      .grid-40[
      40% width column
      ]

    `));
  });

  it('automatically sizes an unsized column', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      <!-- slide-column 10 -->
      10% width column

      <!-- slide-column 30 -->
      30% width column

      <!-- slide-column -->
      60% width column
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      .grid-10[
      10% width column


      ]
      .grid-30[
      30% width column


      ]
      .grid-60[
      60% width column
      ]

    `));
  });

  it('automatically sizes multiple unsized columns', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      <!-- slide-column -->
      35% width column

      <!-- slide-column 20 -->
      20% width column

      <!-- slide-column -->
      35% width column

      <!-- slide-column 10 -->
      10% width column
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      .grid-35[
      35% width column


      ]
      .grid-20[
      20% width column


      ]
      .grid-35[
      35% width column


      ]
      .grid-10[
      10% width column
      ]

    `));
  });
});
