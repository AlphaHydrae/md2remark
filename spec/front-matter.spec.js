const md2remark = require('../src');
const { expect, normalize } = require('./utils');

describe('<!-- slide-front-matter <yml> -->', () => {
  it('inserts YAML front matter at the beginning of a slide', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      <!-- slide-front-matter name: landing-page -->

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      ## Dolor Sit Amet

      <!-- slide-front-matter front: matter -->
      <!-- slide-front-matter class: center, middle -->

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
    `))).to.eventually.equal(normalize(`
      name: landing-page
      # Lorem Ipsum



      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      ---
      front: matter
      class: center, middle
      ## Dolor Sit Amet




      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
    `));
  });

  it('ignores front matter before the first slide', async () => {
    await expect(md2remark(normalize(`
      <!-- slide-front-matter front: matter -->

      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      ## Dolor Sit Amet

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
    `))).to.eventually.equal(normalize(`


      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      ---
      ## Dolor Sit Amet

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
    `));
  });
});
