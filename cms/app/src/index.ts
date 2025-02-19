// import type { Core } from '@strapi/strapi';
import bootstrap from './bootstrap';
import bootstrap_faceswap from './bootstrap_faceswap';
import bootstrap_multifaceswap from './bootstrap_multifaceswap';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap: async ({ strapi }) => {
    // create admin, enable permissions, and create initial data
    await bootstrap({ strapi });

    // create faceswap data
    await bootstrap_faceswap({ strapi });
    
    // 
    await bootstrap_multifaceswap({ strapi });
  },
};
