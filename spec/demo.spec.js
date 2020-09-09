const md2remark = require('../src');
const { expect, normalize } = require('./utils');

describe('md2remark', () => {
  it('transforms regular markdown into remark slides', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      Cras maximus dui enim, sit amet congue eros vestibulum at.

      <!-- START doctoc -->
      * Lorem ipsum
      * Dolor sit amet
      <!-- END doctoc -->

      ## Dolor Sit Amet

      <!-- slide-front-matter class: center, middle -->

      <!-- slide-column -->

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.

      <!-- slide-column -->

      Quisque sed ultricies dui.

      <!-- slide-notes -->

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      Cras maximus dui enim, sit amet congue eros vestibulum at.



      ---
      class: center, middle
      ## Dolor Sit Amet



      .grid-50[

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.


      ]
      .grid-50[

      Quisque sed ultricies dui.


      ]
      ???

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.
    `));
  });
});
