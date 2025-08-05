-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."soil_reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nitrogen" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "phosphorus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "potassium" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pH" DOUBLE PRECISION NOT NULL DEFAULT 7.0,
    "region" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "cropRecommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pesticideSuggestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "herbicideSuggestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "quantitySuggestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "soilFixSuggestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "soil_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "public"."admins"("email");

-- CreateIndex
CREATE INDEX "soil_reports_userId_idx" ON "public"."soil_reports"("userId");

-- CreateIndex
CREATE INDEX "soil_reports_createdAt_idx" ON "public"."soil_reports"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."soil_reports" ADD CONSTRAINT "soil_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
