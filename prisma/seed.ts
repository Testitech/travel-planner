import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { createId } from "@paralleldrive/cuid2";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Smarrrt database...");

  // ─────────────────────────────────────────
  // VISA PURPOSES
  // ─────────────────────────────────────────

  console.log("Seeding visa purposes...");

  const studyPurpose = await prisma.visaPurpose.upsert({
    where: { slug: "study" },
    update: {},
    create: {
      id: createId(),
      name: "Study",
      slug: "study",
      icon: "🎓",
      description:
        "Student visa for undergraduate, postgraduate or language courses",
      isActive: true,
    },
  });

  const workPurpose = await prisma.visaPurpose.upsert({
    where: { slug: "work" },
    update: {},
    create: {
      id: createId(),
      name: "Work",
      slug: "work",
      icon: "💼",
      description: "Work permit or skilled worker visa",
      isActive: true,
    },
  });

  const visitPurpose = await prisma.visaPurpose.upsert({
    where: { slug: "visit" },
    update: {},
    create: {
      id: createId(),
      name: "Visit",
      slug: "visit",
      icon: "✈️",
      description: "Short stay visit visa for family or friends",
      isActive: true,
    },
  });

  const tourismPurpose = await prisma.visaPurpose.upsert({
    where: { slug: "tourism" },
    update: {},
    create: {
      id: createId(),
      name: "Tourism",
      slug: "tourism",
      icon: "🏖️",
      description: "Tourist visa for leisure travel",
      isActive: true,
    },
  });

  const businessPurpose = await prisma.visaPurpose.upsert({
    where: { slug: "business" },
    update: {},
    create: {
      id: createId(),
      name: "Business",
      slug: "business",
      icon: "🤝",
      description: "Business visa for conferences, meetings or trade",
      isActive: true,
    },
  });

  const prPurpose = await prisma.visaPurpose.upsert({
    where: { slug: "permanent-residency" },
    update: {},
    create: {
      id: createId(),
      name: "Permanent Residency",
      slug: "permanent-residency",
      icon: "🏡",
      description: "Permanent residency or settlement application",
      isActive: true,
    },
  });

  const purposes = [
    studyPurpose,
    workPurpose,
    visitPurpose,
    tourismPurpose,
    businessPurpose,
    prPurpose,
  ];
  console.log(`✅ ${purposes.length} visa purposes seeded`);

  // ─────────────────────────────────────────
  // COUNTRIES
  // ─────────────────────────────────────────

  console.log("Seeding countries...");

  const gbCountry = await prisma.country.upsert({
    where: { isoCode: "GB" },
    update: {},
    create: {
      id: createId(),
      name: "United Kingdom",
      isoCode: "GB",
      currencyCode: "GBP",
      flagEmoji: "🇬🇧",
      isActive: true,
    },
  });

  const usCountry = await prisma.country.upsert({
    where: { isoCode: "US" },
    update: {},
    create: {
      id: createId(),
      name: "United States",
      isoCode: "US",
      currencyCode: "USD",
      flagEmoji: "🇺🇸",
      isActive: true,
    },
  });

  const caCountry = await prisma.country.upsert({
    where: { isoCode: "CA" },
    update: {},
    create: {
      id: createId(),
      name: "Canada",
      isoCode: "CA",
      currencyCode: "CAD",
      flagEmoji: "🇨🇦",
      isActive: true,
    },
  });

  const nlCountry = await prisma.country.upsert({
    where: { isoCode: "NL" },
    update: {},
    create: {
      id: createId(),
      name: "Netherlands",
      isoCode: "NL",
      currencyCode: "EUR",
      flagEmoji: "🇳🇱",
      isActive: true,
    },
  });

  const fiCountry = await prisma.country.upsert({
    where: { isoCode: "FI" },
    update: {},
    create: {
      id: createId(),
      name: "Finland",
      isoCode: "FI",
      currencyCode: "EUR",
      flagEmoji: "🇫🇮",
      isActive: true,
    },
  });

  const auCountry = await prisma.country.upsert({
    where: { isoCode: "AU" },
    update: {},
    create: {
      id: createId(),
      name: "Australia",
      isoCode: "AU",
      currencyCode: "AUD",
      flagEmoji: "🇦🇺",
      isActive: true,
    },
  });

  const frCountry = await prisma.country.upsert({
    where: { isoCode: "FR" },
    update: {},
    create: {
      id: createId(),
      name: "France",
      isoCode: "FR",
      currencyCode: "EUR",
      flagEmoji: "🇫🇷",
      isActive: true,
    },
  });

  const seCountry = await prisma.country.upsert({
    where: { isoCode: "SE" },
    update: {},
    create: {
      id: createId(),
      name: "Sweden",
      isoCode: "SE",
      currencyCode: "SEK",
      flagEmoji: "🇸🇪",
      isActive: true,
    },
  });

  const mtCountry = await prisma.country.upsert({
    where: { isoCode: "MT" },
    update: {},
    create: {
      id: createId(),
      name: "Malta",
      isoCode: "MT",
      currencyCode: "EUR",
      flagEmoji: "🇲🇹",
      isActive: true,
    },
  });

  const esCountry = await prisma.country.upsert({
    where: { isoCode: "ES" },
    update: {},
    create: {
      id: createId(),
      name: "Spain",
      isoCode: "ES",
      currencyCode: "EUR",
      flagEmoji: "🇪🇸",
      isActive: true,
    },
  });

  const countries = [
    gbCountry,
    usCountry,
    caCountry,
    nlCountry,
    fiCountry,
    auCountry,
    frCountry,
    seCountry,
    mtCountry,
    esCountry,
  ];
  console.log(`✅ ${countries.length} countries seeded`);

  // ─────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────

  const getCountry = (isoCode: string) => {
    const c = countries.find((c) => c.isoCode === isoCode);
    if (!c) throw new Error(`Country not found: ${isoCode}`);
    return c;
  };

  const getPurpose = (slug: string) => {
    const p = purposes.find((p) => p.slug === slug);
    if (!p) throw new Error(`Purpose not found: ${slug}`);
    return p;
  };

  // ─────────────────────────────────────────
  // FX RATES
  // ─────────────────────────────────────────

  console.log("Seeding FX rates...");

  await prisma.fxRate.upsert({
    where: { currencyCode: "GBP" },
    update: {},
    create: { currencyCode: "GBP", cbnRate: 1980, parallelRate: 2050 },
  });

  await prisma.fxRate.upsert({
    where: { currencyCode: "USD" },
    update: {},
    create: { currencyCode: "USD", cbnRate: 1580, parallelRate: 1650 },
  });

  await prisma.fxRate.upsert({
    where: { currencyCode: "CAD" },
    update: {},
    create: { currencyCode: "CAD", cbnRate: 1160, parallelRate: 1220 },
  });

  await prisma.fxRate.upsert({
    where: { currencyCode: "EUR" },
    update: {},
    create: { currencyCode: "EUR", cbnRate: 1720, parallelRate: 1790 },
  });

  await prisma.fxRate.upsert({
    where: { currencyCode: "AUD" },
    update: {},
    create: { currencyCode: "AUD", cbnRate: 1020, parallelRate: 1075 },
  });

  await prisma.fxRate.upsert({
    where: { currencyCode: "SEK" },
    update: {},
    create: { currencyCode: "SEK", cbnRate: 152, parallelRate: 160 },
  });

  console.log("✅ FX rates seeded");

  // ─────────────────────────────────────────
  // STUDY INTAKES
  // ─────────────────────────────────────────

  console.log("Seeding study intakes...");

  // UK
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("GB").id, intakeMonth: 1 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("GB").id,
      intakeMonth: 1,
      intakeName: "January Intake",
      isMainIntake: false,
    },
  });
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("GB").id, intakeMonth: 5 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("GB").id,
      intakeMonth: 5,
      intakeName: "May Intake",
      isMainIntake: false,
    },
  });
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("GB").id, intakeMonth: 9 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("GB").id,
      intakeMonth: 9,
      intakeName: "September Intake",
      isMainIntake: true,
    },
  });
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: {
        countryId: getCountry("GB").id,
        intakeMonth: 10,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("GB").id,
      intakeMonth: 10,
      intakeName: "October Intake",
      isMainIntake: false,
    },
  });

  // USA
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("US").id, intakeMonth: 1 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("US").id,
      intakeMonth: 1,
      intakeName: "Spring Semester",
      isMainIntake: false,
    },
  });
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("US").id, intakeMonth: 8 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("US").id,
      intakeMonth: 8,
      intakeName: "Fall Semester",
      isMainIntake: true,
    },
  });

  // Canada
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("CA").id, intakeMonth: 1 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("CA").id,
      intakeMonth: 1,
      intakeName: "Winter Intake",
      isMainIntake: false,
    },
  });
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("CA").id, intakeMonth: 5 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("CA").id,
      intakeMonth: 5,
      intakeName: "Summer Intake",
      isMainIntake: false,
    },
  });
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("CA").id, intakeMonth: 9 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("CA").id,
      intakeMonth: 9,
      intakeName: "Fall Intake",
      isMainIntake: true,
    },
  });

  // Australia
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("AU").id, intakeMonth: 2 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("AU").id,
      intakeMonth: 2,
      intakeName: "Semester 1",
      isMainIntake: true,
    },
  });
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("AU").id, intakeMonth: 7 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("AU").id,
      intakeMonth: 7,
      intakeName: "Semester 2",
      isMainIntake: false,
    },
  });

  // Netherlands
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("NL").id, intakeMonth: 9 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("NL").id,
      intakeMonth: 9,
      intakeName: "September Intake",
      isMainIntake: true,
    },
  });

  // Finland
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("FI").id, intakeMonth: 9 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("FI").id,
      intakeMonth: 9,
      intakeName: "Autumn Semester",
      isMainIntake: true,
    },
  });

  // France
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("FR").id, intakeMonth: 9 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("FR").id,
      intakeMonth: 9,
      intakeName: "Autumn Intake",
      isMainIntake: true,
    },
  });
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("FR").id, intakeMonth: 1 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("FR").id,
      intakeMonth: 1,
      intakeName: "Spring Intake",
      isMainIntake: false,
    },
  });

  // Sweden
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("SE").id, intakeMonth: 9 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("SE").id,
      intakeMonth: 9,
      intakeName: "Autumn Semester",
      isMainIntake: true,
    },
  });

  // Malta
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: {
        countryId: getCountry("MT").id,
        intakeMonth: 10,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("MT").id,
      intakeMonth: 10,
      intakeName: "October Intake",
      isMainIntake: true,
    },
  });

  // Spain
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("ES").id, intakeMonth: 9 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("ES").id,
      intakeMonth: 9,
      intakeName: "Autumn Intake",
      isMainIntake: true,
    },
  });
  await prisma.studyIntake.upsert({
    where: {
      countryId_intakeMonth: { countryId: getCountry("ES").id, intakeMonth: 1 },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("ES").id,
      intakeMonth: 1,
      intakeName: "Spring Intake",
      isMainIntake: false,
    },
  });

  console.log("✅ Study intakes seeded");

  // ─────────────────────────────────────────
  // POF RULES
  // ─────────────────────────────────────────

  console.log("Seeding POF rules...");

  // ── UK STUDY ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("GB").id,
        purposeId: getPurpose("study").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("GB").id,
      purposeId: getPurpose("study").id,
      safeBufferMonths: 3,
      cautionBufferMonths: 2,
      riskyBufferMonths: 1,
      minAmountForeign: 12006,
      requiresHistory: true,
      statementMonths: 28,
      analysisText:
        "UKVI requires your {{minAmountForeign}} {{currencyCode}} to be held in your account for a minimum of 28 consecutive days before your application date. Your safe start date is {{safeDate}}. Based on today's parallel rate of ₦{{parallelRate}}/{{currencyCode}}, your recommended Naira target is {{nairaTarget}}. To reach this safely, deposit {{monthlyDeposit}} per month.",
      nigerianSpecific:
        "Nigerian applicants must account for Form A/PTA processing delays which can take 4–8 weeks. Do not rely on CBN official rates — source your FX via domiciliary account deposits at the parallel rate. Avoid any single deposit exceeding 30% of your existing balance as this triggers UKVI financial manipulation checks.",
    },
  });

  // ── UK VISIT ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("GB").id,
        purposeId: getPurpose("visit").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("GB").id,
      purposeId: getPurpose("visit").id,
      safeBufferMonths: 3,
      cautionBufferMonths: 2,
      riskyBufferMonths: 1,
      minAmountForeign: 3000,
      requiresHistory: false,
      statementMonths: 6,
      analysisText:
        "UK Standard Visitor Visa requires proof of {{minAmountForeign}} {{currencyCode}} or equivalent to cover your stay. Your safe preparation window opens {{safeDate}}. At the current parallel rate, your Naira target is {{nairaTarget}}.",
      nigerianSpecific:
        "UK visit visa refusal rates for Nigerian applicants remain high. A clean 6-month statement showing regular income is more powerful than a large balance. Ensure your statement reflects your genuine financial life.",
    },
  });

  // ── USA STUDY ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("US").id,
        purposeId: getPurpose("study").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("US").id,
      purposeId: getPurpose("study").id,
      safeBufferMonths: 6,
      cautionBufferMonths: 4,
      riskyBufferMonths: 2,
      minAmountForeign: 35000,
      requiresHistory: true,
      statementMonths: 3,
      analysisText:
        "US F-1 Student Visa requires POF before your university issues the I-20 document — without the I-20 you cannot book your visa interview. You need {{minAmountForeign}} {{currencyCode}} demonstrable. Safe preparation begins {{safeDate}}. Your Naira target at parallel rate is {{nairaTarget}}. Monthly deposit target: {{monthlyDeposit}}.",
      nigerianSpecific:
        "US consulate in Lagos and Abuja have some of the highest F-1 refusal rates globally for Nigerian applicants. Your DS-160, I-20, and financial documents must all be airtight. Avoid lump sum deposits — the embassy looks for 3 months of consistent account history showing the funds are genuinely yours.",
    },
  });

  // ── CANADA STUDY ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("CA").id,
        purposeId: getPurpose("study").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("CA").id,
      purposeId: getPurpose("study").id,
      safeBufferMonths: 6,
      cautionBufferMonths: 4,
      riskyBufferMonths: 2,
      minAmountForeign: 20635,
      requiresHistory: true,
      statementMonths: 4,
      analysisText:
        "Canada IRCC requires {{minAmountForeign}} {{currencyCode}} for the first year of study plus tuition. Your safe window to begin opens {{safeDate}}. At today's parallel rate of ₦{{parallelRate}}/{{currencyCode}}, your Naira target is {{nairaTarget}}. Build toward {{monthlyDeposit}} per month to avoid lump sum flags.",
      nigerianSpecific:
        "IRCC specifically monitors Nigerian applications for sudden unexplained deposits — a tactic known as account dumping. You need a minimum 4–6 months of organic account history. Never deposit more than 40% of your existing balance in a single transaction. The Student Direct Stream (SDS) route requires a GIC of CAD $10,000 from a designated bank.",
    },
  });

  // ── AUSTRALIA STUDY ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("AU").id,
        purposeId: getPurpose("study").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("AU").id,
      purposeId: getPurpose("study").id,
      safeBufferMonths: 5,
      cautionBufferMonths: 3,
      riskyBufferMonths: 1,
      minAmountForeign: 29710,
      requiresHistory: true,
      statementMonths: 3,
      analysisText:
        "Australia Student Visa (Subclass 500) requires AUD {{minAmountForeign}} for living costs for one year plus tuition. Safe preparation begins {{safeDate}}. Your Naira target is {{nairaTarget}}. Monthly deposit target: {{monthlyDeposit}}.",
      nigerianSpecific:
        "Australian DHA case officers are trained to detect account dumping. Genuine savings history is critical. Your GTE (Genuine Temporary Entrant) statement must convincingly explain why you will return to Nigeria after your studies.",
    },
  });

  // ── NETHERLANDS STUDY ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("NL").id,
        purposeId: getPurpose("study").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("NL").id,
      purposeId: getPurpose("study").id,
      safeBufferMonths: 4,
      cautionBufferMonths: 2,
      riskyBufferMonths: 1,
      minAmountForeign: 13200,
      requiresHistory: false,
      statementMonths: 3,
      analysisText:
        "Netherlands IND requires {{minAmountForeign}} {{currencyCode}} (€1,100/month × 12) demonstrable for student residence permit. Safe window opens {{safeDate}}. Naira target: {{nairaTarget}}. Monthly deposit: {{monthlyDeposit}}.",
      nigerianSpecific:
        "IND checks that funds are in your personal account — not a family member's. Ensure your domiciliary account is in your name and reflects consistent deposits over the statement period.",
    },
  });

  // ── FINLAND STUDY ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("FI").id,
        purposeId: getPurpose("study").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("FI").id,
      purposeId: getPurpose("study").id,
      safeBufferMonths: 4,
      cautionBufferMonths: 2,
      riskyBufferMonths: 1,
      minAmountForeign: 6720,
      requiresHistory: false,
      statementMonths: 3,
      analysisText:
        "Finland Migri requires {{minAmountForeign}} {{currencyCode}} (€560/month × 12) for student residence permit. Safe window opens {{safeDate}}. Naira target: {{nairaTarget}}.",
      nigerianSpecific:
        "Finnish universities have one main September intake. Apply through the Enter Finland portal well in advance. Processing takes 1–3 months so begin your POF preparation at least 4 months before the intake.",
    },
  });

  // ── FRANCE STUDY ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("FR").id,
        purposeId: getPurpose("study").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("FR").id,
      purposeId: getPurpose("study").id,
      safeBufferMonths: 4,
      cautionBufferMonths: 2,
      riskyBufferMonths: 1,
      minAmountForeign: 7380,
      requiresHistory: false,
      statementMonths: 3,
      analysisText:
        "France long-stay student visa requires {{minAmountForeign}} {{currencyCode}} (€615/month × 12). Safe window opens {{safeDate}}. Naira target: {{nairaTarget}}. Monthly deposit: {{monthlyDeposit}}.",
      nigerianSpecific:
        "Campus France registration is mandatory for Nigerian students before the consulate appointment. Complete this process early as it adds 4–6 weeks to your timeline. Statement must be translated to French or English by a certified translator.",
    },
  });

  // ── SWEDEN STUDY ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("SE").id,
        purposeId: getPurpose("study").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("SE").id,
      purposeId: getPurpose("study").id,
      safeBufferMonths: 4,
      cautionBufferMonths: 2,
      riskyBufferMonths: 1,
      minAmountForeign: 102816,
      requiresHistory: false,
      statementMonths: 3,
      analysisText:
        "Sweden Migrationsverket requires SEK {{minAmountForeign}} (SEK 8,568/month × 12) for student permit. Safe window opens {{safeDate}}. Naira target: {{nairaTarget}}.",
      nigerianSpecific:
        "Apply via the Migrationsverket online portal. Processing takes 2–4 months. Account statement must be in English or Swedish — get a certified translation from your Nigerian bank.",
    },
  });

  // ── MALTA STUDY ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("MT").id,
        purposeId: getPurpose("study").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("MT").id,
      purposeId: getPurpose("study").id,
      safeBufferMonths: 3,
      cautionBufferMonths: 2,
      riskyBufferMonths: 1,
      minAmountForeign: 7800,
      requiresHistory: false,
      statementMonths: 3,
      analysisText:
        "Malta requires {{minAmountForeign}} {{currencyCode}} (€650/month × 12) for student residence permit. Safe window opens {{safeDate}}. Naira target: {{nairaTarget}}.",
      nigerianSpecific:
        "Identity Malta Agency handles permit applications. English is the medium of instruction at most Maltese institutions making integration easier for Nigerian students. Apply online through the Identity Malta portal.",
    },
  });

  // ── SPAIN STUDY ──
  await prisma.pofRule.upsert({
    where: {
      countryId_purposeId: {
        countryId: getCountry("ES").id,
        purposeId: getPurpose("study").id,
      },
    },
    update: {},
    create: {
      id: createId(),
      countryId: getCountry("ES").id,
      purposeId: getPurpose("study").id,
      safeBufferMonths: 4,
      cautionBufferMonths: 2,
      riskyBufferMonths: 1,
      minAmountForeign: 7200,
      requiresHistory: false,
      statementMonths: 3,
      analysisText:
        "Spain student visa requires {{minAmountForeign}} {{currencyCode}} (€600/month × 12). Safe window opens {{safeDate}}. Naira target: {{nairaTarget}}. Monthly deposit: {{monthlyDeposit}}.",
      nigerianSpecific:
        "Spanish consulate in Abuja processes Nigerian student applications. All Nigerian documents must be apostilled. Health insurance covering €30,000 minimum is mandatory. Note that August is essentially a dead month for Spanish administration — plan your application timeline around this.",
    },
  });

  console.log("✅ POF rules seeded");
  console.log("🎉 Smarrrt database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
