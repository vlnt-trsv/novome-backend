-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('PATIENT', 'DOCTOR', 'CLINIC');

-- CreateEnum
CREATE TYPE "MODERATION_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "DOCUMENT_TYPE" AS ENUM ('LICENSE', 'DIPLOMA', 'CERTIFICATE', 'PASSPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "SPECIALIZATION" AS ENUM ('RHINOPLASTY', 'BLEPHAROPLASTY', 'FACELIFT', 'FOREHEAD_LIFT', 'CHEEK_AUGMENTATION', 'CHIN_AUGMENTATION', 'OTOPLASTY', 'LIP_AUGMENTATION', 'NECK_LIFT', 'MAMMOPLASTY', 'BREAST_AUGMENTATION', 'BREAST_REDUCTION', 'BREAST_LIFT', 'LIPOSUCTION', 'ABDOMINOPLASTY', 'BUTTOCK_AUGMENTATION', 'BUTTOCK_LIFT', 'THIGH_LIFT', 'ARM_LIFT', 'BURN_RECONSTRUCTION', 'TRAUMA_RECONSTRUCTION', 'CANCER_RECONSTRUCTION', 'CLEFT_LIP_PALATE', 'CONGENITAL_DEFORMITIES', 'MICROSURGERY', 'TISSUE_TRANSPLANTATION', 'FLAP_SURGERY', 'HAND_SURGERY', 'HAND_RECONSTRUCTION', 'TENDON_REPAIR', 'MAXILLOFACIAL_SURGERY', 'JAW_CORRECTION', 'FACIAL_FRACTURE', 'DERMABRASION', 'CHEMICAL_PEEL', 'LASER_SURGERY', 'SCAR_REVISION', 'LABIAPLASTY', 'VAGINOPLASTY', 'PENILE_AUGMENTATION', 'GENERAL_PLASTIC_SURGERY', 'COSMETIC_SURGERY', 'RECONSTRUCTIVE_SURGERY');

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
    "phone" TEXT,
    "hashedRt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "role" "ROLE" NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "aiToken" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "userId" UUID NOT NULL,
    "birthdate" TIMESTAMP(3),
    "gender" "GENDER",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "doctors" (
    "userId" UUID NOT NULL,
    "clinicId" UUID,
    "gender" "GENDER",
    "birthdate" TIMESTAMP(3),
    "licenseNumber" TEXT NOT NULL,
    "specialization" "SPECIALIZATION" NOT NULL,
    "experience" INTEGER NOT NULL,
    "education" TEXT NOT NULL,
    "workplace" TEXT,
    "inn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "clinics" (
    "userId" UUID NOT NULL,
    "legalName" TEXT NOT NULL,
    "legalAddress" TEXT NOT NULL,
    "actualAddress" TEXT NOT NULL,
    "clinicLicense" TEXT NOT NULL,
    "directorName" TEXT NOT NULL,
    "directorPosition" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "orgn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "moderations" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "MODERATION_STATUS" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "moderatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "patientUserId" UUID,
    "doctorUserId" UUID,
    "clinicUserId" UUID,
    "type" "DOCUMENT_TYPE" NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_favorite_doctors" (
    "id" UUID NOT NULL,
    "patientUserId" UUID NOT NULL,
    "doctorUserId" UUID NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_favorite_doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_favorite_clinics" (
    "id" UUID NOT NULL,
    "patientUserId" UUID NOT NULL,
    "clinicUserId" UUID NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_favorite_clinics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_userId_key" ON "auth"."auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_email_key" ON "auth"."auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_confirmationToken_key" ON "auth"."auth"("confirmationToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "clinics_userId_key" ON "clinics"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "moderations_userId_key" ON "moderations"("userId");

-- CreateIndex
CREATE INDEX "patient_favorite_doctors_patientUserId_idx" ON "patient_favorite_doctors"("patientUserId");

-- CreateIndex
CREATE INDEX "patient_favorite_doctors_doctorUserId_idx" ON "patient_favorite_doctors"("doctorUserId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_favorite_doctors_patientUserId_doctorUserId_key" ON "patient_favorite_doctors"("patientUserId", "doctorUserId");

-- CreateIndex
CREATE INDEX "patient_favorite_clinics_patientUserId_idx" ON "patient_favorite_clinics"("patientUserId");

-- CreateIndex
CREATE INDEX "patient_favorite_clinics_clinicUserId_idx" ON "patient_favorite_clinics"("clinicUserId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_favorite_clinics_patientUserId_clinicUserId_key" ON "patient_favorite_clinics"("patientUserId", "clinicUserId");

-- AddForeignKey
ALTER TABLE "auth"."auth" ADD CONSTRAINT "auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderations" ADD CONSTRAINT "moderations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_patientUserId_fkey" FOREIGN KEY ("patientUserId") REFERENCES "patients"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_doctorUserId_fkey" FOREIGN KEY ("doctorUserId") REFERENCES "doctors"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_clinicUserId_fkey" FOREIGN KEY ("clinicUserId") REFERENCES "clinics"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_favorite_doctors" ADD CONSTRAINT "patient_favorite_doctors_patientUserId_fkey" FOREIGN KEY ("patientUserId") REFERENCES "patients"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_favorite_doctors" ADD CONSTRAINT "patient_favorite_doctors_doctorUserId_fkey" FOREIGN KEY ("doctorUserId") REFERENCES "doctors"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_favorite_clinics" ADD CONSTRAINT "patient_favorite_clinics_patientUserId_fkey" FOREIGN KEY ("patientUserId") REFERENCES "patients"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_favorite_clinics" ADD CONSTRAINT "patient_favorite_clinics_clinicUserId_fkey" FOREIGN KEY ("clinicUserId") REFERENCES "clinics"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
