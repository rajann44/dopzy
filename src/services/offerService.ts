import type { Offer } from '../types';

export const offerService = {
  async getOffersForTask(offers: Offer[], taskId: string): Promise<Offer[]> {
    await new Promise((r) => setTimeout(r, 80));
    return offers
      .filter((o) => o.taskId === taskId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async getOffersByTasker(offers: Offer[], taskerId: string): Promise<Offer[]> {
    await new Promise((r) => setTimeout(r, 80));
    return offers
      .filter((o) => o.taskerId === taskerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getAcceptedOfferForTask(offers: Offer[], taskId: string): Promise<Offer | null> {
    await new Promise((r) => setTimeout(r, 60));
    return offers.find((o) => o.taskId === taskId && o.status === 'accepted') ?? null;
  },

  async hasTaskerOffered(
    offers: Offer[],
    taskId: string,
    taskerId: string
  ): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 60));
    return offers.some(
      (o) =>
        o.taskId === taskId &&
        o.taskerId === taskerId &&
        o.status !== 'withdrawn'
    );
  },
};
