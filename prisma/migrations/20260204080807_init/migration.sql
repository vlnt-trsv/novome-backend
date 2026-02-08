-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "booking";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "moderation";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "storage";

-- CreateEnum
CREATE TYPE "auth"."AUTH_TYPE" AS ENUM ('USER', 'STAFF');

-- CreateEnum
CREATE TYPE "booking"."BREAK_TYPE" AS ENUM ('LUNCH', 'VACATION', 'SICK_LEAVE', 'OTHER');

-- CreateEnum
CREATE TYPE "booking"."SLOT_STATUS" AS ENUM ('AVAILABLE', 'BOOKED', 'CANCELED');

-- CreateEnum
CREATE TYPE "moderation"."CONSENT_TYPE" AS ENUM ('TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'MEDICAL_DATA_PROCESSING', 'MARKETING');

-- CreateEnum
CREATE TYPE "moderation"."MODERATION_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'BANNED');

-- CreateEnum
CREATE TYPE "moderation"."TICKET_STATUS" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('PATIENT', 'DOCTOR', 'CLINIC');

-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SPECIALIZATION" AS ENUM ('RHINOPLASTY', 'BLEPHAROPLASTY', 'FACELIFT', 'FOREHEAD_LIFT', 'CHEEK_AUGMENTATION', 'CHIN_AUGMENTATION', 'OTOPLASTY', 'LIP_AUGMENTATION', 'NECK_LIFT', 'MAMMOPLASTY', 'BREAST_AUGMENTATION', 'BREAST_REDUCTION', 'BREAST_LIFT', 'LIPOSUCTION', 'ABDOMINOPLASTY', 'BUTTOCK_AUGMENTATION', 'BUTTOCK_LIFT', 'THIGH_LIFT', 'ARM_LIFT', 'BURN_RECONSTRUCTION', 'TRAUMA_RECONSTRUCTION', 'CANCER_RECONSTRUCTION', 'CLEFT_LIP_PALATE', 'CONGENITAL_DEFORMITIES', 'MICROSURGERY', 'TISSUE_TRANSPLANTATION', 'FLAP_SURGERY', 'HAND_SURGERY', 'HAND_RECONSTRUCTION', 'TENDON_REPAIR', 'MAXILLOFACIAL_SURGERY', 'JAW_CORRECTION', 'FACIAL_FRACTURE', 'DERMABRASION', 'CHEMICAL_PEEL', 'LASER_SURGERY', 'SCAR_REVISION', 'LABIAPLASTY', 'VAGINOPLASTY', 'PENILE_AUGMENTATION', 'GENERAL_PLASTIC_SURGERY', 'COSMETIC_SURGERY', 'RECONSTRUCTIVE_SURGERY');

-- CreateTable
CREATE TABLE "auth"."auths" (
    "id" UUID NOT NULL,
    "type" "auth"."AUTH_TYPE" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "hashedPassword" TEXT NOT NULL,
    "hashedRt" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "emailConfirmedAt" TIMESTAMP(3),
    "confirmationToken" TEXT,
    "confirmationTokenExpiresAt" TIMESTAMP(3),
    "confirmationSentAt" TIMESTAMP(3),
    "recoveryToken" TEXT,
    "recoveryTokenExpiresAt" TIMESTAMP(3),
    "recoverySentAt" TIMESTAMP(3),
    "lastSignInAt" TIMESTAMP(3),
    "lastChangePasswordAt" TIMESTAMP(3),

    CONSTRAINT "auths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking"."shedules" (
    "id" UUID NOT NULL,
    "doctorId" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "slotDuration" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "shedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking"."breaks" (
    "id" UUID NOT NULL,
    "doctorId" UUID NOT NULL,
    "clinicId" UUID,
    "type" "booking"."BREAK_TYPE" NOT NULL DEFAULT 'LUNCH',
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "breaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking"."time_slots" (
    "id" UUID NOT NULL,
    "doctorId" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "booking"."SLOT_STATUS" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation"."staffs" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,

    CONSTRAINT "staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation"."moderations" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "moderatorId" UUID,
    "status" "moderation"."MODERATION_STATUS" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "moderations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation"."tickets" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "moderationId" UUID,
    "subject" TEXT NOT NULL,
    "status" "moderation"."TICKET_STATUS" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation"."ticket_messages" (
    "id" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation"."consents" (
    "id" UUID NOT NULL,
    "type" "moderation"."CONSENT_TYPE" NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation"."user_consents" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "consentId" UUID NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "ROLE" NOT NULL,
    "fullName" TEXT NOT NULL,
    "avatar" TEXT,
    "language" TEXT NOT NULL DEFAULT 'ru',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Novosibirsk',
    "leadSource" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aiToken" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" UUID NOT NULL,
    "birthdate" TIMESTAMP(3),
    "gender" "GENDER",
    "medicalNotes" TEXT,
    "bloodType" TEXT,
    "allergies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "chronicDiseases" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" UUID NOT NULL,
    "clinicId" UUID,
    "gender" "GENDER",
    "birthdate" TIMESTAMP(3),
    "experience" INTEGER NOT NULL,
    "specializations" "SPECIALIZATION"[],
    "education" TEXT NOT NULL,
    "workplace" TEXT,
    "bio" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSearchable" BOOLEAN NOT NULL DEFAULT true,
    "inn" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "clinics" (
    "id" UUID NOT NULL,
    "legalName" TEXT NOT NULL,
    "brandName" TEXT,
    "inn" TEXT NOT NULL,
    "ogrn" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "directorName" TEXT NOT NULL,
    "directorPosition" TEXT NOT NULL,
    "legalAddress" TEXT NOT NULL,
    "actualAddress" TEXT NOT NULL,
    "city" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scheduleId" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "patient_favorite_doctors" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "doctorId" UUID NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_favorite_doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_favorite_clinics" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_favorite_clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage"."files" (
    "id" UUID NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "s3Key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage"."documents" (
    "id" UUID NOT NULL,
    "patientId" UUID,
    "doctorId" UUID,
    "clinicId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "auths_email_key" ON "auth"."auths"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auths_phone_key" ON "auth"."auths"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "auths_confirmationToken_key" ON "auth"."auths"("confirmationToken");

-- CreateIndex
CREATE UNIQUE INDEX "auths_recoveryToken_key" ON "auth"."auths"("recoveryToken");

-- CreateIndex
CREATE UNIQUE INDEX "shedules_doctorId_clinicId_dayOfWeek_key" ON "booking"."shedules"("doctorId", "clinicId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "time_slots_doctorId_startAt_idx" ON "booking"."time_slots"("doctorId", "startAt");

-- CreateIndex
CREATE INDEX "time_slots_clinicId_startAt_idx" ON "booking"."time_slots"("clinicId", "startAt");

-- CreateIndex
CREATE UNIQUE INDEX "staffs_email_key" ON "moderation"."staffs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "moderations_userId_key" ON "moderation"."moderations"("userId");

-- CreateIndex
CREATE INDEX "moderations_userId_idx" ON "moderation"."moderations"("userId");

-- CreateIndex
CREATE INDEX "moderations_status_idx" ON "moderation"."moderations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "consents_type_version_key" ON "moderation"."consents"("type", "version");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_phone_idx" ON "users"("email", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "patients_id_key" ON "patients"("id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_id_key" ON "doctors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_inn_key" ON "doctors"("inn");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_license_key" ON "doctors"("license");

-- CreateIndex
CREATE UNIQUE INDEX "clinics_id_key" ON "clinics"("id");

-- CreateIndex
CREATE UNIQUE INDEX "clinics_inn_key" ON "clinics"("inn");

-- CreateIndex
CREATE INDEX "clinics_city_idx" ON "clinics"("city");

-- CreateIndex
CREATE INDEX "patient_favorite_doctors_userId_idx" ON "patient_favorite_doctors"("userId");

-- CreateIndex
CREATE INDEX "patient_favorite_doctors_doctorId_idx" ON "patient_favorite_doctors"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_favorite_doctors_userId_doctorId_key" ON "patient_favorite_doctors"("userId", "doctorId");

-- CreateIndex
CREATE INDEX "patient_favorite_clinics_userId_idx" ON "patient_favorite_clinics"("userId");

-- CreateIndex
CREATE INDEX "patient_favorite_clinics_clinicId_idx" ON "patient_favorite_clinics"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_favorite_clinics_userId_clinicId_key" ON "patient_favorite_clinics"("userId", "clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "files_s3Key_key" ON "storage"."files"("s3Key");

-- CreateIndex
CREATE UNIQUE INDEX "documents_id_key" ON "storage"."documents"("id");

-- AddForeignKey
ALTER TABLE "booking"."shedules" ADD CONSTRAINT "shedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking"."shedules" ADD CONSTRAINT "shedules_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking"."breaks" ADD CONSTRAINT "breaks_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking"."time_slots" ADD CONSTRAINT "time_slots_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking"."time_slots" ADD CONSTRAINT "time_slots_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation"."staffs" ADD CONSTRAINT "staffs_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."auths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation"."moderations" ADD CONSTRAINT "moderations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation"."moderations" ADD CONSTRAINT "moderations_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "moderation"."staffs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation"."tickets" ADD CONSTRAINT "tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation"."tickets" ADD CONSTRAINT "tickets_moderationId_fkey" FOREIGN KEY ("moderationId") REFERENCES "moderation"."moderations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation"."ticket_messages" ADD CONSTRAINT "ticket_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "moderation"."tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation"."user_consents" ADD CONSTRAINT "user_consents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation"."user_consents" ADD CONSTRAINT "user_consents_consentId_fkey" FOREIGN KEY ("consentId") REFERENCES "moderation"."consents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."auths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_favorite_doctors" ADD CONSTRAINT "patient_favorite_doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_favorite_doctors" ADD CONSTRAINT "patient_favorite_doctors_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_favorite_clinics" ADD CONSTRAINT "patient_favorite_clinics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_favorite_clinics" ADD CONSTRAINT "patient_favorite_clinics_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."documents" ADD CONSTRAINT "documents_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."documents" ADD CONSTRAINT "documents_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."documents" ADD CONSTRAINT "documents_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."documents" ADD CONSTRAINT "documents_id_fkey" FOREIGN KEY ("id") REFERENCES "storage"."files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
