-- CreateTable
CREATE TABLE "Version" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "changelog" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("id")
);
