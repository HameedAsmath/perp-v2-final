/*
  Warnings:

  - The values [buy,sell] on the enum `OrderSide` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderSide_new" AS ENUM ('long', 'short');
ALTER TABLE "Order" ALTER COLUMN "side" TYPE "OrderSide_new" USING ("side"::text::"OrderSide_new");
ALTER TABLE "Fill" ALTER COLUMN "side" TYPE "OrderSide_new" USING ("side"::text::"OrderSide_new");
ALTER TYPE "OrderSide" RENAME TO "OrderSide_old";
ALTER TYPE "OrderSide_new" RENAME TO "OrderSide";
DROP TYPE "public"."OrderSide_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "postOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectionReason" TEXT;
