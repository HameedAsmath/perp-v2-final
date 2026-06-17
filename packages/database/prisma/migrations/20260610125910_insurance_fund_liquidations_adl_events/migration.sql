-- AlterTable
ALTER TABLE "Market" ALTER COLUMN "tickSize" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "minOrderSize" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "maxOrderSize" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "makerFeeRate" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "takerFeeRate" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "InsuranceFund" (
    "id" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceLedgerEntry" (
    "id" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsuranceLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Liquidation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "side" "OrderSide" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "markPrice" DOUBLE PRECISION NOT NULL,
    "margin" DOUBLE PRECISION NOT NULL,
    "settlement" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Liquidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdlEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "reducedQuantity" DOUBLE PRECISION NOT NULL,
    "bankruptcyPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdlEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceFund_marketId_key" ON "InsuranceFund"("marketId");

-- CreateIndex
CREATE INDEX "Liquidation_userId_idx" ON "Liquidation"("userId");

-- CreateIndex
CREATE INDEX "Liquidation_marketId_idx" ON "Liquidation"("marketId");

-- CreateIndex
CREATE INDEX "AdlEvent_userId_idx" ON "AdlEvent"("userId");

-- CreateIndex
CREATE INDEX "AdlEvent_marketId_idx" ON "AdlEvent"("marketId");

-- AddForeignKey
ALTER TABLE "InsuranceFund" ADD CONSTRAINT "InsuranceFund_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceLedgerEntry" ADD CONSTRAINT "InsuranceLedgerEntry_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceLedgerEntry" ADD CONSTRAINT "ledger_fund_market" FOREIGN KEY ("marketId") REFERENCES "InsuranceFund"("marketId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liquidation" ADD CONSTRAINT "Liquidation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liquidation" ADD CONSTRAINT "Liquidation_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdlEvent" ADD CONSTRAINT "AdlEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdlEvent" ADD CONSTRAINT "AdlEvent_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
