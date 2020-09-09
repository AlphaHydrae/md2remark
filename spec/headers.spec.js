const md2remark = require('../src');
const { expect, normalize } = require('./utils');

describe('markdown headers', () => {
  it('become slide separators', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      ## Dolor Sit Amet

      Vivamus eu vestibulum mauris, et suscipit libero.

      ### Cras Maximus

      Cras maximus dui enim, sit amet congue eros vestibulum at.

      ### Sed Bibendum

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.

      #### Quisque Sed

      Quisque sed ultricies dui.
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      ---
      ## Dolor Sit Amet

      Vivamus eu vestibulum mauris, et suscipit libero.

      ---
      ### Cras Maximus

      Cras maximus dui enim, sit amet congue eros vestibulum at.

      ---
      ### Sed Bibendum

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.

      ---
      #### Quisque Sed

      Quisque sed ultricies dui.
    `));
  });
});

