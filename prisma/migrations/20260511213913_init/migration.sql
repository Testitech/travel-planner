-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "flagEmoji" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaPurpose" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VisaPurpose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PofRule" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "purposeId" TEXT NOT NULL,
    "safeBufferMonths" INTEGER NOT NULL,
    "cautionBufferMonths" INTEGER NOT NULL,
    "riskyBufferMonths" INTEGER NOT NULL,
    "minAmountForeign" DOUBLE PRECISION NOT NULL,
    "requiresHistory" BOOLEAN NOT NULL DEFAULT false,
    "analysisText" TEXT NOT NULL,
    "nigerianSpecific" TEXT NOT NULL,
    "statementMonths" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "StudyIntake" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "intakeMonth" INTEGER NOT NULL,
    "intakeName" TEXT NOT NULL,
    "isMainIntake" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "FxRate" (
    "currencyCode" TEXT NOT NULL,
    "cbnRate" DOUBLE PRECISION NOT NULL,
    "parallelRate" DOUBLE PRECISION NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FxRate_pkey" PRIMARY KEY ("currencyCode")
);

-- CreateTable
CREATE TABLE "UserTimeline" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "purposeId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "intakeDate" TIMESTAMP(3) NOT NULL,
    "currentBalance" DOUBLE PRECISION NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "monthlyDeposit" DOUBLE PRECISION NOT NULL,
    "safeStartDate" TIMESTAMP(3) NOT NULL,
    "cautionStartDate" TIMESTAMP(3) NOT NULL,
    "riskyStartDate" TIMESTAMP(3) NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Country_id_key" ON "Country"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_isoCode_key" ON "Country"("isoCode");

-- CreateIndex
CREATE UNIQUE INDEX "VisaPurpose_id_key" ON "VisaPurpose"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VisaPurpose_name_key" ON "VisaPurpose"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VisaPurpose_slug_key" ON "VisaPurpose"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PofRule_countryId_purposeId_key" ON "PofRule"("countryId", "purposeId");

-- CreateIndex
CREATE UNIQUE INDEX "StudyIntake_countryId_intakeMonth_key" ON "StudyIntake"("countryId", "intakeMonth");

-- CreateIndex
CREATE UNIQUE INDEX "UserTimeline_slug_key" ON "UserTimeline"("slug");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "FxRate"("currencyCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PofRule" ADD CONSTRAINT "PofRule_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PofRule" ADD CONSTRAINT "PofRule_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "VisaPurpose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyIntake" ADD CONSTRAINT "StudyIntake_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTimeline" ADD CONSTRAINT "UserTimeline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTimeline" ADD CONSTRAINT "UserTimeline_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTimeline" ADD CONSTRAINT "UserTimeline_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "VisaPurpose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
