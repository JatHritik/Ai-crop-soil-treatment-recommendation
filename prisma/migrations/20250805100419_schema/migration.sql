/*
  Warnings:

  - You are about to drop the column `cropRecommendations` on the `soil_reports` table. All the data in the column will be lost.
  - You are about to drop the column `herbicideSuggestions` on the `soil_reports` table. All the data in the column will be lost.
  - You are about to drop the column `nitrogen` on the `soil_reports` table. All the data in the column will be lost.
  - You are about to drop the column `pH` on the `soil_reports` table. All the data in the column will be lost.
  - You are about to drop the column `pesticideSuggestions` on the `soil_reports` table. All the data in the column will be lost.
  - You are about to drop the column `phosphorus` on the `soil_reports` table. All the data in the column will be lost.
  - You are about to drop the column `potassium` on the `soil_reports` table. All the data in the column will be lost.
  - You are about to drop the column `quantitySuggestions` on the `soil_reports` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `soil_reports` table. All the data in the column will be lost.
  - You are about to drop the column `soilFixSuggestions` on the `soil_reports` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `area` to the `soil_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportFile` to the `soil_reports` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `season` on the `soil_reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."Season" AS ENUM ('KHARIF', 'RABI', 'ZAID');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'ANALYZING', 'COMPLETED', 'FAILED');

-- DropIndex
DROP INDEX "public"."soil_reports_createdAt_idx";

-- DropIndex
DROP INDEX "public"."soil_reports_userId_idx";

-- AlterTable
ALTER TABLE "public"."soil_reports" DROP COLUMN "cropRecommendations",
DROP COLUMN "herbicideSuggestions",
DROP COLUMN "nitrogen",
DROP COLUMN "pH",
DROP COLUMN "pesticideSuggestions",
DROP COLUMN "phosphorus",
DROP COLUMN "potassium",
DROP COLUMN "quantitySuggestions",
DROP COLUMN "region",
DROP COLUMN "soilFixSuggestions",
ADD COLUMN     "aiAnalysis" JSONB,
ADD COLUMN     "analyzedAt" TIMESTAMP(3),
ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "extractedText" TEXT,
ADD COLUMN     "reportFile" TEXT NOT NULL,
ADD COLUMN     "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "season",
ADD COLUMN     "season" "public"."Season" NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "name",
ADD COLUMN     "profile" JSONB,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."admins";

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");
