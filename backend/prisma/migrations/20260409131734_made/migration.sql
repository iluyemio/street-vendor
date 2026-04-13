-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profile_picture" DROP NOT NULL,
ALTER COLUMN "vendor_id" DROP NOT NULL,
ALTER COLUMN "expires_at" DROP NOT NULL;
