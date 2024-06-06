/*
  Warnings:

  - Added the required column `type` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Fruit" AS ENUM ('APPLE', 'MANGO', 'ORANGE');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "type" "Fruit" NOT NULL;
