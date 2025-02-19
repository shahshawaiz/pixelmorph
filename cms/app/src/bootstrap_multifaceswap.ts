import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import bcrypt from 'bcryptjs';

/**
 * Map Excel keys (multi.faceswap.*) to Strapi schema attributes.
 */
const KEY_MAP = {
  // Basic SEO
  'multi.faceswap.title': 'seoTitle',
  'multi.faceswap.description': 'metaDescription',
  'multi.faceswap.kw': 'keywords',
  'multi.faceswap.header': 'header',

  // Breadcrumb & Website Structure
  'multi.faceswap.structure.breadcrumblist.name': 'structureBreadcrumblistName',
  'multi.faceswap.structure.breadcrumblist.item': 'structureBreadcrumblistItem',
  'multi.faceswap.structure.website.name': 'structureWebsiteName',
  'multi.faceswap.structure.website.url': 'structureWebsiteUrl',
  'multi.faceswap.structure.website.headline': 'structureWebsiteHeadline',
  'multi.faceswap.structure.website.description': 'structureWebsiteDescription',
  'multi.faceswap.structure.website.image': 'structureWebsiteImage',

  // OG & Twitter
  'multi.faceswap.og.title': 'ogTitle',
  'multi.faceswap.og.description': 'ogDescription',
  'multi.faceswap.og.url': 'ogUrl',
  'multi.faceswap.og.img.alt': 'ogImgAlt',
  'multi.faceswap.img.url': 'previewImageUrl',
  'multi.faceswap.twitter.title': 'twitterTitle',
  'multi.faceswap.twitter.description': 'twitterDescription',
  'multi.faceswap.img.alt.1': 'imageAlt',

  // Intro
  'multi.faceswap.intro.h1': 'introH1',
  'multi.faceswap.intro.content': 'introContent',

  // WHAT
  'multi.faceswap.what.h2': 'whatH2',
  'multi.faceswap.what.h3.1': 'whatH3_1',
  'multi.faceswap.what.content.1': 'whatContent1',
  'multi.faceswap.what.h3.2': 'whatH3_2',
  'multi.faceswap.what.content.2': 'whatContent2',
  'multi.faceswap.what.h3.3': 'whatH3_3',
  'multi.faceswap.what.content.3': 'whatContent3',
  'multi.faceswap.what.h3.4': 'whatH3_4',
  'multi.faceswap.what.content.4': 'whatContent4',

  // WHY
  'multi.faceswap.why.h2': 'whyH2',
  'multi.faceswap.why.content.1': 'whyContent1',
  'multi.faceswap.why.h3.1': 'whyH3_1',
  'multi.faceswap.why.content.2': 'whyContent2',
  'multi.faceswap.why.h3.2': 'whyH3_2',
  'multi.faceswap.why.content.3': 'whyContent3',
  'multi.faceswap.why.h3.3': 'whyH3_3',
  'multi.faceswap.why.content.4': 'whyContent4',
  'multi.faceswap.why.h3.4': 'whyH3_4',
  'multi.faceswap.why.content.5': 'whyContent5',

  // HOW
  'multi.faceswap.how.h2': 'howH2',
  'multi.faceswap.how.title.1': 'howTitle1',
  'multi.faceswap.how.content.1': 'howContent1',
  'multi.faceswap.how.title.2': 'howTitle2',
  'multi.faceswap.how.content.2': 'howContent2',
  'multi.faceswap.how.title.3': 'howTitle3',
  'multi.faceswap.how.content.3': 'howContent3',

  // TOOLS
  'multi.faceswap.tools.h2': 'toolsH2',
  'multi.faceswap.tools.h3.1': 'toolsH3_1',
  'multi.faceswap.tools.content.1': 'toolsContent1',

  // USER REVIEWS
  'multi.faceswap.user.review.h2': 'userReviewH2',
  'multi.faceswap.user.review.name.1': 'userReviewName1',
  'multi.faceswap.user.review.1': 'userReview1',
  'multi.faceswap.user.review.name.2': 'userReviewName2',
  'multi.faceswap.user.review.2': 'userReview2',
  'multi.faceswap.user.review.name.3': 'userReviewName3',
  'multi.faceswap.user.review.3': 'userReview3',
  'multi.faceswap.user.review.name.4': 'userReviewName4',
  'multi.faceswap.user.review.4': 'userReview4',

  // FAQ
  'multi.faceswap.faq.h2': 'faqHeader',
  'multi.faceswap.faq.h3.1': 'faqQuestion1',
  'multi.faceswap.faq.content.1': 'faqAnswer1',
  'multi.faceswap.faq.h3.2': 'faqQuestion2',
  'multi.faceswap.faq.content.2': 'faqAnswer2',
  'multi.faceswap.faq.h3.3': 'faqQuestion3',
  'multi.faceswap.faq.content.3': 'faqAnswer3',
  'multi.faceswap.faq.h3.4': 'faqQuestion4',
  'multi.faceswap.faq.content.4': 'faqAnswer4',
  'multi.faceswap.faq.h3.5': 'faqQuestion5',
  'multi.faceswap.faq.content.5': 'faqAnswer5',
  'multi.faceswap.faq.h3.6': 'faqQuestion6',
  'multi.faceswap.faq.content.6': 'faqAnswer6',
  'multi.faceswap.faq.h3.7': 'faqQuestion7',
  'multi.faceswap.faq.content.7': 'faqAnswer7',
  'multi.faceswap.faq.h3.8': 'faqQuestion8',
  'multi.faceswap.faq.content.8': 'faqAnswer8',
  'multi.faceswap.faq.h3.9': 'faqQuestion9',
  'multi.faceswap.faq.content.9': 'faqAnswer9',
  'multi.faceswap.faq.h3.10': 'faqQuestion10',
  'multi.faceswap.faq.content.10': 'faqAnswer10',
};

/**
 * Map of locale codes to language names (as used in your Excel file header).
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
 * Removes falsy values and trims strings.
 */
function cleanValue(value) {
  if (!value || value === 'null') return '';
  return String(value).trim();
}

/**
 * Iterates over Excel rows and creates a nested object for each locale.
 */
function parseExcelData(rows) {
  const localizedData = {};

  // Initialize an object for each locale
  Object.keys(LOCALE_MAP).forEach((locale) => {
    localizedData[locale] = {};
  });

  // Process each row from the Excel sheet
  for (const row of rows) {
    const excelKey = cleanValue(row.Key || row.key);
    if (!excelKey) continue;

    // Map the Excel key to the schema attribute
    const mappedKey = KEY_MAP[excelKey];
    if (!mappedKey) {
      // Optionally log a warning if no mapping exists
      // strapi.log.warn(`No mapping for Excel key: "${excelKey}"`);
      continue;
    }

    // For each locale, store the cleaned value
    for (const [localeCode, languageName] of Object.entries(LOCALE_MAP)) {
      const rawValue = row[languageName];
      localizedData[localeCode][mappedKey] = cleanValue(rawValue);
    }
  }

  return localizedData;
}

/**
 * Reads the "multifaceswap" sheet, parses data per locale, and saves the single-type entry.
 */
async function processMultiFaceswapSheet(strapi, workbook) {
  const sheetName = 'multifaceswap'; // Make sure this matches your Excel sheet name
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    strapi.log.warn(`Sheet "${sheetName}" not found in Excel file.`);
    return;
  }

  const rows = XLSX.utils.sheet_to_json(worksheet);
  const localizedData = parseExcelData(rows);

  // Update your new single-type UID
  const contentTypeUID = 'api::multifaceswap.multifaceswap';
  const SINGLE_TYPE_ID = 1; // Typically "1" for single-types

  const defaultLocale = 'en';

  // Process default locale first
  if (localizedData[defaultLocale]) {
    const data = localizedData[defaultLocale];
    try {
      const existingDefault = await strapi.entityService.findOne(
        contentTypeUID,
        SINGLE_TYPE_ID,
        { locale: defaultLocale }
      );

      if (existingDefault) {
        await strapi.entityService.update(contentTypeUID, SINGLE_TYPE_ID, {
          data,
          locale: defaultLocale,
        });
        strapi.log.info(
          `Updated "multifaceswap" entry for locale "${defaultLocale}".`
        );
      } else {
        await strapi.entityService.create(contentTypeUID, {
          data,
          locale: defaultLocale,
        });
        strapi.log.info(
          `Created "multifaceswap" entry for locale "${defaultLocale}".`
        );
      }
    } catch (err) {
      strapi.log.error(`Error processing default locale "${defaultLocale}":`, err);
    }
  }

  // Process remaining locales
  for (const [localeCode, data] of Object.entries(localizedData)) {
    if (localeCode === defaultLocale) continue;
    try {
      const existingEntry = await strapi.entityService.findOne(
        contentTypeUID,
        SINGLE_TYPE_ID,
        { locale: localeCode }
      );

      if (existingEntry) {
        await strapi.entityService.update(contentTypeUID, SINGLE_TYPE_ID, {
          data,
          locale: localeCode,
        });
        strapi.log.info(
          `Updated "multifaceswap" entry for locale "${localeCode}".`
        );
      } else {
        await strapi.entityService.create(contentTypeUID, {
          data,
          locale: localeCode,
        });
        strapi.log.info(
          `Created "multifaceswap" entry for locale "${localeCode}".`
        );
      }
    } catch (error) {
      strapi.log.error(`Error processing locale "${localeCode}":`, error);
    }
  }
}

/**
 * Enables the public role's permissions for the multifaceswap "find" actions.
 * In Strapi v5, we update permissions via the database query API.
 */
async function updatePublicPermissions(strapi) {
  // Retrieve the public role (type: 'public')
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({
      where: { type: 'public' },
    });
  if (!publicRole) {
    strapi.log.error('Public role not found.');
    return;
  }

  // Define the permission keys to enable for the multifaceswap endpoints
  const permissionsToEnable = {
    'api::multifaceswap.multifaceswap.find': true,
    'api::multifaceswap.multifaceswap.findOne': true,
  };

  // Loop through each permission and update it via the DB query
  for (const [permissionKey, enabled] of Object.entries(permissionsToEnable)) {
    const permissionRecord = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({
        where: { role: publicRole.id, action: permissionKey },
      });
    if (permissionRecord) {
      await strapi.db.query('plugin::users-permissions.permission').update({
        where: { id: permissionRecord.id },
        data: { enabled },
      });
      strapi.log.info(
        `Enabled permission "${permissionKey}" for public role.`
      );
    } else {
      strapi.log.warn(
        `Permission "${permissionKey}" not found for public role.`
      );
    }
  }
}

/**
 * Main bootstrap function.
 */
export default async ({ strapi }) => {
  try {
    // Define the Excel file path (adjust as needed)
    const excelFilePath = path.join('content', 'faceswap-content.xlsx');
    if (!fs.existsSync(excelFilePath)) {
      strapi.log.warn(
        `Excel file not found at: ${excelFilePath}. Skipping seeding.`
      );
    } else {
      const workbook = XLSX.readFile(excelFilePath);
      await processMultiFaceswapSheet(strapi, workbook);
    }

    // Enable public permissions for the multifaceswap "find" actions.
    await updatePublicPermissions(strapi);
  } catch (error) {
    strapi.log.error('Error during bootstrap:', error);
    throw error;
  }
};
