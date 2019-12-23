import { loadConfig } from "./config";
import { Bot } from "./Bot";
import { handleNewTradeOffer } from "./tradeoffer";

const config = loadConfig();

const bot = new Bot(config);

const manager = bot.getTradeManager();
// @ts-ignore
manager.on("newOffer", handleNewTradeOffer(bot));
