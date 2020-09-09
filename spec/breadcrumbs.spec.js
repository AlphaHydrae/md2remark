const md2remark = require('../src');
const { expect, normalize } = require('./utils');

describe('the "breadcrumbs" options', () => {
  it('inserts breadcrumbs based on markdown headers in each slide', async () => {
    const options = { breadcrumbs: true };
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      ## Vivamus Eu

      Vivamus eu vestibulum mauris, et suscipit libero.

      ### Cras Maximus

      Cras maximus dui enim, sit amet congue eros vestibulum at.

      ## Sed Bibendum

      Sed bibendum libero ut justo rhoncus lacinia.

      ### Maecenas Condimentum

      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.

      ### Quisque Sed

      Quisque sed ultricies dui.

      #### Lorem

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.
    `), options)).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      ---
      ## Vivamus Eu

      .breadcrumbs[<a href="#1">Lorem Ipsum</a>]

      Vivamus eu vestibulum mauris, et suscipit libero.

      ---
      ### Cras Maximus

      .breadcrumbs[<a href="#1">Lorem Ipsum</a> > <a href="#2">Vivamus Eu</a>]

      Cras maximus dui enim, sit amet congue eros vestibulum at.

      ---
      ## Sed Bibendum

      .breadcrumbs[<a href="#1">Lorem Ipsum</a>]

      Sed bibendum libero ut justo rhoncus lacinia.

      ---
      ### Maecenas Condimentum

      .breadcrumbs[<a href="#1">Lorem Ipsum</a> > <a href="#4">Sed Bibendum</a>]

      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.

      ---
      ### Quisque Sed

      .breadcrumbs[<a href="#1">Lorem Ipsum</a> > <a href="#4">Sed Bibendum</a>]

      Quisque sed ultricies dui.

      ---
      #### Lorem

      .breadcrumbs[<a href="#1">Lorem Ipsum</a> > <a href="#4">Sed Bibendum</a> > <a href="#6">Quisque Sed</a>]

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Vivamus eu vestibulum mauris, et suscipit libero.
    `));
  });

  it('inserts no breadcrumbs with only a level one header', async () => {
    const options = { breadcrumbs: true };
    await expect(md2remark(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      Vivamus eu vestibulum mauris, et suscipit libero.
      Cras maximus dui enim, sit amet congue eros vestibulum at.

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
      Quisque sed ultricies dui.
    `), options)).to.eventually.equal(normalize(`
      # Lorem Ipsum

      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      Vivamus eu vestibulum mauris, et suscipit libero.
      Cras maximus dui enim, sit amet congue eros vestibulum at.

      Sed bibendum libero ut justo rhoncus lacinia.
      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
      Quisque sed ultricies dui.
    `));
  });

  it('inserts no breadcrumbs if no parent headers can be found', async () => {
    const options = { breadcrumbs: true };
    await expect(md2remark(normalize(`
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      ## Vivamus eu

      Vivamus eu vestibulum mauris, et suscipit libero.
      Cras maximus dui enim, sit amet congue eros vestibulum at.

      ### Sed bibendum

      Sed bibendum libero ut justo rhoncus lacinia.

      ## Maecenas Condimentum

      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
      Quisque sed ultricies dui.
    `), options)).to.eventually.equal(normalize(`
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      ---
      ## Vivamus eu

      Vivamus eu vestibulum mauris, et suscipit libero.
      Cras maximus dui enim, sit amet congue eros vestibulum at.

      ---
      ### Sed bibendum

      .breadcrumbs[<a href="#1">Vivamus eu</a>]

      Sed bibendum libero ut justo rhoncus lacinia.

      ---
      ## Maecenas Condimentum

      Maecenas condimentum magna nulla, id fermentum orci rhoncus et.
      Quisque sed ultricies dui.
    `));
  });
});
