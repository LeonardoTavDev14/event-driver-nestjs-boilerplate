-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountBlocked" BOOLEAN,
ADD COLUMN     "accountSuspended" TIMESTAMP(3),
ADD COLUMN     "loginAttempts" INTEGER;
