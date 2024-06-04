-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3),
    "author" TEXT,
    "thumbnailUrl" TEXT,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
