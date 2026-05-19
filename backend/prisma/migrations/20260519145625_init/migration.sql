-- CreateTable
CREATE TABLE "Urls" (
    "urlId" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Urls_pkey" PRIMARY KEY ("urlId")
);

-- CreateTable
CREATE TABLE "Clicks" (
    "clickId" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAdress" TEXT,

    CONSTRAINT "Clicks_pkey" PRIMARY KEY ("clickId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Urls_longUrl_key" ON "Urls"("longUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Urls_shortCode_key" ON "Urls"("shortCode");

-- AddForeignKey
ALTER TABLE "Clicks" ADD CONSTRAINT "Clicks_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Urls"("urlId") ON DELETE RESTRICT ON UPDATE CASCADE;
