const { join: joinPath, resolve: resolvePath } = require('path');

const md2remark = require('../src');
const { expect, normalize } = require('./utils');

describe('<!-- slide-include <path> -->', () => {
  it('includes another markdown file', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      <!-- slide-include ./spec/data/test.include.md -->

      Cras maximus dui enim, sit amet congue eros vestibulum at.
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.


      Cras maximus dui enim, sit amet congue eros vestibulum at.
    `));
  });

  it('includes a markdown file relative to the processed file', async () => {
    const virtualMarkdownFile = resolvePath(joinPath(__dirname, 'data', 'virtual.md'));
    const options = { file: virtualMarkdownFile };
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      <!-- slide-include ./test.include.md -->

      Cras maximus dui enim, sit amet congue eros vestibulum at.
    `), options)).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.


      Cras maximus dui enim, sit amet congue eros vestibulum at.
    `));
  });

  it('includes a markdown file at an absolute path', async () => {
    const includePath = resolvePath(joinPath(__dirname, 'data', 'test.include.md'));
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      <!-- slide-include ${includePath} -->

      Cras maximus dui enim, sit amet congue eros vestibulum at.
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.


      Cras maximus dui enim, sit amet congue eros vestibulum at.
    `));
  });

  it('can include the same markdown file multiple times', async () => {
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      <!-- slide-include ./spec/data/test.include.md -->

      Cras maximus dui enim, sit amet congue eros vestibulum at.

      <!-- slide-include ./spec/data/test.include.md -->
    `))).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.


      Cras maximus dui enim, sit amet congue eros vestibulum at.

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.

    `));
  });
});
