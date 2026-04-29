/*
  Warnings:

  - You are about to drop the `check_in` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "check_in";

-- CreateTable
CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validated_at" TIMESTAMP(3),

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);
