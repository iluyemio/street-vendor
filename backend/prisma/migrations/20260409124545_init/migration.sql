-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'REJECTED', 'APPROVED', 'VERIFIED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "user_type" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_organization_name_key" ON "User"("organization_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_vendor_id_key" ON "User"("vendor_id");
