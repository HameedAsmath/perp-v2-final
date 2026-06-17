import { prisma, getMarketId } from "database";

export async function persistAdlEvent(input: {
  userId: string;
  symbol: string;
  reducedQuantity: number;
  bankruptcyPrice: number;
}) {
  const marketId = await getMarketId(input.symbol);

  return prisma.adlEvent.create({
    data: {
      userId: input.userId,
      marketId,
      reducedQuantity: input.reducedQuantity,
      bankruptcyPrice: input.bankruptcyPrice,
    },
  });
}

export async function resetAdlEvents() {
  await prisma.adlEvent.deleteMany();
}
