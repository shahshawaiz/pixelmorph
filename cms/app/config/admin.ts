export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  autoCreate: true,
  defaultAdmin: {
    username: env('STRAPI_ADMIN_USERNAME', 'admin'),
    email: env('STRAPI_ADMIN_EMAIL', 'admin@example.com'),
    password: env('STRAPI_ADMIN_PASSWORD', 'changeme'),
    firstname: env('STRAPI_ADMIN_FIRSTNAME', 'Admin'),
    lastname: env('STRAPI_ADMIN_LASTNAME', 'User'),
  },  
});
