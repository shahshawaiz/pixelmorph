import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import bcrypt from 'bcryptjs';

/**
 * Map Excel keys to Strapi schema attributes.
 */
const KEY_MAP = {
  // Basic SEO
  'faceswap.title': 'seoTitle',
  'faceswap.description': 'metaDescription',
  'faceswap.kw': 'keywords',
  'faceswap.header': 'header',

  // Breadcrumb & Website Structure
  'faceswap.structure.breadcrumblist.name': 'structureBreadcrumblistName',
  'faceswap.structure.breadcrumblist.item': 'structureBreadcrumblistItem',
  'faceswap.structure.website.name': 'structureWebsiteName',
  'faceswap.structure.website.url': 'structureWebsiteUrl',
  'faceswap.structure.website.headline': 'structureWebsiteHeadline',
  'faceswap.structure.website.description': 'structureWebsiteDescription',
  'faceswap.structure.website.image': 'structureWebsiteImage',

  // OG & Twitter
  'faceswap.og.title': 'ogTitle',
  'faceswap.og.description': 'ogDescription',
  'faceswap.og.url': 'ogUrl',
  'faceswap.og.img.alt': 'ogImgAlt',
  'faceswap.img.url': 'previewImageUrl',
  'faceswap.twitter.title': 'twitterTitle',
  'faceswap.twitter.description': 'twitterDescription',
  'faceswap.img.alt.1': 'imageAlt',

  // Intro
  'faceswap.intro.h1': 'introH1',
  'faceswap.intro.content': 'introContent',

  // WHAT
  'faceswap.what.h2': 'whatH2',
  'faceswap.what.h3.1': 'whatH3_1',
  'faceswap.what.content.1': 'whatContent1',
  'faceswap.what.h3.2': 'whatH3_2',
  'faceswap.what.content.2': 'whatContent2',
  'faceswap.what.h3.3': 'whatH3_3',
  'faceswap.what.content.3': 'whatContent3',
  'faceswap.what.h3.4': 'whatH3_4',
  'faceswap.what.content.4': 'whatContent4',

  // WHY
  'faceswap.why.h2': 'whyH2',
  'faceswap.why.content.1': 'whyContent1',
  'faceswap.why.h3.1': 'whyH3_1',
  'faceswap.why.content.2': 'whyContent2',
  'faceswap.why.h3.2': 'whyH3_2',
  'faceswap.why.content.3': 'whyContent3',
  'faceswap.why.h3.3': 'whyH3_3',
  'faceswap.why.content.4': 'whyContent4',
  'faceswap.why.h3.4': 'whyH3_4',
  'faceswap.why.content.5': 'whyContent5',

  // HOW
  'faceswap.how.h2': 'howH2',
  'faceswap.how.title.1': 'howTitle1',
  'faceswap.how.content.1': 'howContent1',
  'faceswap.how.title.2': 'howTitle2',
  'faceswap.how.content.2': 'howContent2',
  'faceswap.how.title.3': 'howTitle3',
  'faceswap.how.content.3': 'howContent3',

  // TOOLS
  'faceswap.tools.h2': 'faceswapToolsH2',
  'faceswap.tools.h3.1': 'faceswapToolsH3_1',
  'faceswap.tools.content.1': 'faceswapToolsContent1',
  'multi.faceswap.tools.h2': 'multiFaceswapToolsH2',
  'multi.faceswap.tools.h3.1': 'multiFaceswapToolsH3_1',
  'multi.faceswap.tools.content.1': 'multiFaceswapToolsContent1',
  'video.faceswap.tools.h2': 'videoFaceswapToolsH2',
  'video.faceswap.tools.h3.1': 'videoFaceswapToolsH3_1',
  'video.faceswap.tools.content.1': 'videoFaceswapToolsContent1',
  'multi.video.faceswap.tools.h2': 'multiVideoFaceswapToolsH2',
  'multi.video.faceswap.tools.h3.1': 'multiVideoFaceswapToolsH3_1',
  'multi.video.faceswap.tools.content.1': 'multiVideoFaceswapToolsContent1',

  // USER REVIEWS
  'faceswap.user.review.h2': 'userReviewH2',
  'faceswap.user.review.name.1': 'userReviewName1',
  'faceswap.user.review.1': 'userReview1',
  'faceswap.user.review.name.2': 'userReviewName2',
  'faceswap.user.review.2': 'userReview2',
  'faceswap.user.review.name.3': 'userReviewName3',
  'faceswap.user.review.3': 'userReview3',
  'faceswap.user.review.name.4': 'userReviewName4',
  'faceswap.user.review.4': 'userReview4',

  // FAQ
  'faceswap.faq.h1': 'faqHeader',
  'multi.faceswap.faq.h3.1': 'faqQuestion1',
  'faceswap.faq.content.1': 'faqAnswer1',
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

  // --- NEW KEYS ---
  'faceswap.about.title': 'aboutTitle',
  'faceswap.about.body': 'aboutBody',
  'faceswap.privacy.title': 'privacyTitle',
  'faceswap.privacy.body': 'privacyBody',
  'faceswap.terms.title': 'termsTitle',
  'faceswap.terms.body': 'termsBody',
  'faceswap.engine.div1.instruction': 'engineDiv1Instruction',
  'faceswap.engine.div1.button': 'engineDiv1Button',
  'faceswap.engine.div2.instruction': 'engineDiv2Instruction',
  'faceswap.engine.div2.button': 'engineDiv2Button',
  'faceswap.engine.run.button': 'engineRunButton'
};

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
 * Reads the faceswap sheet, parses data per locale, and saves the single-type entry.
 */
async function processFaceswapSheet(strapi, workbook) {
  const sheetName = 'faceswap';
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    strapi.log.warn(`Sheet "${sheetName}" not found in Excel file.`);
    return;
  }

  const rows = XLSX.utils.sheet_to_json(worksheet);
  const localizedData = parseExcelData(rows);
  const contentTypeUID = 'api::faceswap.faceswap';
  const SINGLE_TYPE_ID = 1; // For single-types, the ID is usually fixed (often "1")
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
        strapi.log.info(`Updated "faceswap" entry for locale "${defaultLocale}".`);
      } else {
        await strapi.entityService.create(contentTypeUID, {
          data,
          locale: defaultLocale,
        });
        strapi.log.info(`Created "faceswap" entry for locale "${defaultLocale}".`);
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
        strapi.log.info(`Updated "faceswap" entry for locale "${localeCode}".`);
      } else {
        await strapi.entityService.create(contentTypeUID, {
          data,
          locale: localeCode,
        });
        strapi.log.info(`Created "faceswap" entry for locale "${localeCode}".`);
      }
    } catch (error) {
      strapi.log.error(`Error processing locale "${localeCode}":`, error);
    }
  }
}

/**
 * Enables the public role's permissions for the faceswap "find" actions.
 * In Strapi v5, we update permissions via the database query API.
 */
async function updatePublicPermissions(strapi) {
  // Retrieve the public role (type: 'public')
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!publicRole) {
    strapi.log.error('Public role not found.');
    return;
  }

  // Define the permission keys to enable for the faceswap endpoints.
  const permissionsToEnable = {
    "api::faceswap.faceswap.find": true,
    "api::faceswap.faceswap.findOne": true,
  };

  // Loop through each permission and update it via the DB query.
  for (const [permissionKey, enabled] of Object.entries(permissionsToEnable)) {
    const permissionRecord = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { role: publicRole.id, action: permissionKey },
    });
    if (permissionRecord) {
      await strapi.db.query('plugin::users-permissions.permission').update({
        where: { id: permissionRecord.id },
        data: { enabled },
      });
      strapi.log.info(`Enabled permission "${permissionKey}" for public role.`);
    } else {
      strapi.log.warn(`Permission "${permissionKey}" not found for public role.`);
    }
  }
}


/**
 * Main bootstrap function.
 */
export default async ({ strapi }) => {
  try {
    // Define the Excel file path (adjust if necessary)
    const excelFilePath = path.join('content', 'faceswap-content.xlsx');
    if (!fs.existsSync(excelFilePath)) {
      strapi.log.warn(`Excel file not found at: ${excelFilePath}. Skipping seeding.`);
    } else {
      const workbook = XLSX.readFile(excelFilePath);
      await processFaceswapSheet(strapi, workbook);
    }

    // Enable public permissions for the faceswap "find" actions.
    await updatePublicPermissions(strapi);
  } catch (error) {
    strapi.log.error('Error during bootstrap:', error);
    throw error;
  }
};
