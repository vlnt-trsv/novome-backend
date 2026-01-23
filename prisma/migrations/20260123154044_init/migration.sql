/*
  Warnings:

  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - Changed the type of `specialization` on the `doctors` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateEnum
CREATE TYPE "SPECIALIZATION" AS ENUM ('RHINOPLASTY', 'BLEPHAROPLASTY', 'FACELIFT', 'FOREHEAD_LIFT', 'CHEEK_AUGMENTATION', 'CHIN_AUGMENTATION', 'OTOPLASTY', 'LIP_AUGMENTATION', 'NECK_LIFT', 'MAMMOPLASTY', 'BREAST_AUGMENTATION', 'BREAST_REDUCTION', 'BREAST_LIFT', 'LIPOSUCTION', 'ABDOMINOPLASTY', 'BUTTOCK_AUGMENTATION', 'BUTTOCK_LIFT', 'THIGH_LIFT', 'ARM_LIFT', 'BURN_RECONSTRUCTION', 'TRAUMA_RECONSTRUCTION', 'CANCER_RECONSTRUCTION', 'CLEFT_LIP_PALATE', 'CONGENITAL_DEFORMITIES', 'MICROSURGERY', 'TISSUE_TRANSPLANTATION', 'FLAP_SURGERY', 'HAND_SURGERY', 'HAND_RECONSTRUCTION', 'TENDON_REPAIR', 'MAXILLOFACIAL_SURGERY', 'JAW_CORRECTION', 'FACIAL_FRACTURE', 'DERMABRASION', 'CHEMICAL_PEEL', 'LASER_SURGERY', 'SCAR_REVISION', 'LABIAPLASTY', 'VAGINOPLASTY', 'PENILE_AUGMENTATION', 'GENERAL_PLASTIC_SURGERY', 'COSMETIC_SURGERY', 'RECONSTRUCTIVE_SURGERY');

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "specialization",
ADD COLUMN     "specialization" "SPECIALIZATION" NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password",
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "auth"."auth" (
    "userId" UUID NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailConfirmedAt" TIMESTAMP(3),
    "confirmationSentAt" TIMESTAMP(3),
    "confirmationToken" TEXT,
    "confirmationTokenExpiresAt" TIMESTAMP(3),
    "lastSignInAt" TIMESTAMP(3),
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_userId_key" ON "auth"."auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_email_key" ON "auth"."auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_confirmationToken_key" ON "auth"."auth"("confirmationToken");

-- AddForeignKey
ALTER TABLE "auth"."auth" ADD CONSTRAINT "auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
