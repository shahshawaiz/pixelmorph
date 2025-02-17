import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

/**
 * KEY_MAP maps each Excel "Key" to the corresponding schema attribute.
 */
const KEY_MAP: Record<string, string> = {
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
  'faceswap.tools.h2': 'toolsH2',
  'faceswap.tools.h3.1': 'toolsH3_1',
  'faceswap.tools.content.1': 'toolsContent1',

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
  'faceswap.faq.h1': 'faqHeader'
  // If you have additional FAQ keys (e.g., question/answer pairs),
  // add them to this map accordingly.
};

const LOCALE_MAP: Record<string, string> = {
  en: 'English',
  ru: 'Russian',
  pt: 'Portuguese',
  es: 'Spanish',
  de: 'German',
  id: 'Indonesian',
};

/**
 * cleanValue removes falsy values and trims the string.
 */
function cleanValue(value: any): string {
  if (!value || value === 'null') return '';
  return String(value).trim();
}

/**
 * parseExcelData:
 *  - Iterates over each row from the Excel sheet.
 *  - For each row, looks up the "Key" (e.g. "faceswap.title"),
 *    maps it to the schema field (e.g. "seoTitle") via KEY_MAP,
 *    and then for each locale, stores the cell value.
 */
function parseExcelData(rows: any[]): Record<string, Record<string, string>> {
  const localizedData: Record<string, Record<string, string>> = {};

  // Initialize an empty object for each locale
  Object.keys(LOCALE_MAP).forEach((locale) => {
    localizedData[locale] = {};
  });

  // Process every row
  for (const row of rows) {
    const excelKey = cleanValue(row.Key || row.key);
    if (!excelKey) continue;

    // Look up the mapped field name
    const mappedKey = KEY_MAP[excelKey];
    if (!mappedKey) {
      // If no mapping exists, you can log a warning if needed
      // strapi.log.warn(`No mapping for Excel key: "${excelKey}"`);
      continue;
    }

    // For each locale, store the cell value in the mapped key
    for (const [localeCode, languageName] of Object.entries(LOCALE_MAP)) {
      const rawValue = row[languageName];
      localizedData[localeCode][mappedKey] = cleanValue(rawValue);
    }
  }

  return localizedData;
}

/**
 * initI18n:
 *  - Creates default locales (if they don't already exist)
 *    in Strapi using the i18n plugin.
 */
async function initI18n(strapi: any) {
  const defaultLocales = Object.keys(LOCALE_MAP).map((code) => ({
    code,
    name: LOCALE_MAP[code],
  }));
  const existingLocales = await strapi.plugins['i18n'].services.locales.find();

  for (const locale of defaultLocales) {
    const found = existingLocales.find((l: any) => l.code === locale.code);
    if (!found) {
      await strapi.plugins['i18n'].services.locales.create(locale);
      strapi.log.info(`Created missing locale: ${locale.code}`);
    }
  }
}

/**
 * processFaceswapSheet:
 *  - Reads the "faceswap" sheet from the Excel workbook.
 *  - Parses the rows into localized data.
 *  - Checks if the single-type entry already exists in the default locale ("en").
 *  - If not, creates an entry for each locale.
 */
async function processFaceswapSheet(strapi: any, workbook: XLSX.WorkBook) {
  const sheetName = 'faceswap';
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    strapi.log.warn(`Sheet "${sheetName}" not found in Excel file.`);
    return;
  }

  const rows = XLSX.utils.sheet_to_json(worksheet);
  const localizedData = parseExcelData(rows);
  const contentTypeUID = 'api::faceswap.faceswap';

  // Process each locale individually
  for (const [localeCode, data] of Object.entries(localizedData)) {
    // Check if entry exists for this specific locale
    const existingEntry = await strapi.db.query(contentTypeUID).findOne({
      where: { locale: localeCode },
    });

    try {
      if (existingEntry) {
        // Update existing entry
        await strapi.entityService.update(contentTypeUID, existingEntry.id, { data });
        strapi.log.info(`Updated "faceswap" entry for locale "${localeCode}".`);
      } else {
        // Create new entry
        await strapi.entityService.create(contentTypeUID, {
          data: {
            ...data,
            locale: localeCode,
          },
        });
        strapi.log.info(`Created "faceswap" entry for locale "${localeCode}".`);
      }
    } catch (error) {
      strapi.log.error(`Error processing locale ${localeCode}:`, error);
    }
  }
}

/**
 * Main bootstrap function
 */
export default async ({ strapi }: { strapi: any }): Promise<void> => {
  try {
    // Initialize i18n locales
    await initI18n(strapi);

    // Define the Excel file path
    const excelFilePath = path.join('content', 'faceswap-content.xlsx');
    if (!fs.existsSync(excelFilePath)) {
      strapi.log.warn(`Excel file not found at: ${excelFilePath}. Skipping seeding.`);
      return;
    }

    // Read the workbook from the Excel file
    const workbook = XLSX.readFile(excelFilePath);

    // Process the "faceswap" sheet and seed data into your single-type
    await processFaceswapSheet(strapi, workbook);

    // Add more sheet processing calls here if needed

  } catch (error) {
    strapi.log.error('Error during Excel seeding:', error);
    throw error;
  }
};
