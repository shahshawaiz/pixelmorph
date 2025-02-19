import bcrypt from 'bcryptjs';


/**
 * Map of locale codes to language names (as used in your Excel file header)
 */
const LOCALE_MAP = {
  en: 'English',
  ru: 'Russian',
  pt: 'Portuguese',
  es: 'Spanish',
  de: 'German',
  id: 'Indonesian',
};

/**
 * Creates missing i18n locales in Strapi.
 */
async function initI18n(strapi) {
  const defaultLocales = Object.keys(LOCALE_MAP).map((code) => ({
    code,
    name: LOCALE_MAP[code],
  }));
  const existingLocales = await strapi.plugins['i18n'].services.locales.find();

  for (const locale of defaultLocales) {
    const found = existingLocales.find((l) => l.code === locale.code);
    if (!found) {
      await strapi.plugins['i18n'].services.locales.create(locale);
      strapi.log.info(`Created missing locale: ${locale.code}`);
    }
  }
}


/**
 * Creates or updates a default admin account using environment variables.
 * The admin is marked as active (isActive: true), not blocked, and confirmed.
 */
async function createOrUpdateDefaultAdmin(strapi) {
  const adminData = {
    username: process.env.STRAPI_ADMIN_USERNAME,
    email: process.env.STRAPI_ADMIN_EMAIL,
    password: process.env.STRAPI_ADMIN_PASSWORD,
    firstname: process.env.STRAPI_ADMIN_FIRSTNAME || 'Admin',
    lastname: process.env.STRAPI_ADMIN_LASTNAME || '',
  };

  if (!adminData.email || !adminData.password || !adminData.username) {
    strapi.log.warn('Missing required admin ENV variables. Skipping default admin creation.');
    return;
  }

  // Check if an admin user with this email already exists.
  const existingAdmin = await strapi.db.query('admin::user').findOne({
    where: { email: adminData.email },
  });

  // Retrieve the Super Admin role.
  const superAdminRole = await strapi.db.query('admin::role').findOne({
    where: { code: 'strapi-super-admin' },
  });
  if (!superAdminRole) {
    strapi.log.error('No Super Admin role found. Cannot create default admin.');
    return;
  }

  // Hash the password using bcrypt.
  const hashedPassword = await bcrypt.hash(adminData.password, 10);

  if (existingAdmin) {
    // Update the existing admin record.
    await strapi.db.query('admin::user').update({
      where: { id: existingAdmin.id },
      data: {
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword,
        firstname: adminData.firstname,
        lastname: adminData.lastname,
        isActive: true,   // Using camelCase (v5)
        blocked: false,
        confirmed: true,
        roles: [superAdminRole.id],
      },
    });
    strapi.log.info(`Updated default admin account: ${adminData.email}`);
  } else {
    // Create a new admin record.
    await strapi.db.query('admin::user').create({
      data: {
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword,
        firstname: adminData.firstname,
        lastname: adminData.lastname,
        isActive: true,   // Active account
        blocked: false,
        confirmed: true,
        roles: [superAdminRole.id],
      },
    });
    strapi.log.info(`Created default admin account: ${adminData.email}`);
  }
}

/**
 * Main bootstrap function.
 */
export default async ({ strapi }) => {
  try {
    // Initialize i18n locales
    await initI18n(strapi);

    // Create or update the default admin account from env vars.
    await createOrUpdateDefaultAdmin(strapi);
  } catch (error) {
    strapi.log.error('Error during bootstrap:', error);
    throw error;
  }
};
