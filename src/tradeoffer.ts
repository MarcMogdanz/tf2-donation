import { Bot } from "./Bot";

// @ts-ignore
export const handleNewTradeOffer = (bot: Bot) => (trade: any) => {
  console.log("New trade received");
  const partnerId = trade.partner.getSteamID64();

  if (trade.isGlitched()) {
    declineTrade(trade);
    return;
  }

  if (bot.isOwner(partnerId)) {
    acceptTrade(trade, bot);
    return;
  }

  const { itemsToGive, itemsToReceive } = trade;
  const giveAmount = calculateItems(itemsToGive);
  const receiveAmount = calculateItems(itemsToReceive);

  if (giveAmount > 0) {
    declineTrade(trade);
    return;
  }

  if (receiveAmount > 0) {
    acceptTrade(trade, bot);
    return;
  }

  // whatever happened here, should not accept
  declineTrade(trade);
};

const acceptTrade = (trade: any, bot: Bot) => {
  trade.accept((err: any, status: any) => {
    if (err) {
      console.log("err while accepting", err);
      return;
    }

    console.log("Accepted trade");

    const { itemsToGive, itemsToReceive } = trade;
    const giveAmount = calculateItems(itemsToGive);
    const receiveAmount = calculateItems(itemsToReceive);

    bot.notifyOwners(
      `Accepted new trade receiving ${receiveAmount} and giving ${giveAmount} items`,
    );
  });
};

const declineTrade = (trade: any) => {
  trade.decline((err: any) => {
    if (err) {
      console.log("err while declining", err);
      return;
    }

    console.log("Declined trade");
  });
};

const calculateItems = (items: any[]): number => {
  return items.reduce((sum: number, item: any) => sum + item.amount, 0) || 0;
};
