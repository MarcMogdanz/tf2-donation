import { generateAuthCode } from "steam-totp";
import { Config } from "./config";
// no types available currently
const SteamUser = require("steam-user");
const SteamCommunity = require("steamcommunity");
const TradeOfferManager = require("steam-tradeoffer-manager");
const TeamFortress2 = require("tf2");

// maps to steam def_index
export enum MetalType {
  SCRAP_METAL = 5000,
  RECLAIMED_METAL = 5001,
  REFINED_METAL = 5002,
}

// does not contain all attributes of a backpack item
interface SimpleItem {
  id: string;
  def_index: number;
}

export class Bot {
  private config: Config;
  private client: typeof SteamUser;
  private community: typeof SteamCommunity;
  private manager: typeof TradeOfferManager;
  private tf2: typeof TeamFortress2;
  private backpack: SimpleItem[]; // managing our own backpack object

  constructor(config: Config) {
    this.config = config;
    this.client = new SteamUser();
    this.community = new SteamCommunity();
    this.manager = new TradeOfferManager({
      community: this.community,
      steam: this.client,
      language: "en",
    });
    this.tf2 = new TeamFortress2(this.client);
    this.backpack = [];

    try {
      this.client.logOn({
        accountName: this.config.steam.account.name,
        password: this.config.steam.account.password,
        twoFactorCode: generateAuthCode(this.config.steam.account.sharedSecret),
      });

      this.client.on("loggedOn", () => {
        console.log("Logged into steam");

        this.client.setPersona(SteamUser.EPersonaState.Online);
        this.client.gamesPlayed(440);
      });

      // @ts-ignore
      this.client.on("error", err => {
        console.log("error event", err);
      });

      // @ts-ignore
      this.client.on("webSession", (sessionid, cookies) => {
        this.manager.setCookies(cookies);

        this.community.setCookies(cookies);
        this.community.startConfirmationChecker(
          10000,
          this.config.steam.account.identitySecret,
        );
      });

      this.tf2.on("backpackLoaded", () => {
        console.log("Backpack loaded");

        // initialy save our backpack
        this.backpack = this.tf2.backpack;
      });

      this.tf2.on("itemAcquired", (newItem: SimpleItem) => {
        console.log("Item aquired");
        this.backpack.push(newItem);

        // try to craft metal everytime a new metal gets added
        if (
          (newItem.def_index === MetalType.SCRAP_METAL ||
            newItem.def_index === MetalType.RECLAIMED_METAL ||
            newItem.def_index === MetalType.REFINED_METAL) &&
          this.config.bot.autoCraftMetal
        ) {
          this.craftMetal();
        }
      });

      this.tf2.on("itemChanged", (oldItem: SimpleItem, newItem: SimpleItem) => {
        console.log("Item changed");

        this.backpack = this.backpack.filter(item => item.id !== oldItem.id);

        this.backpack.push(newItem);
      });

      this.tf2.on("itemRemoved", (oldItem: SimpleItem) => {
        console.log("Item removed");

        this.backpack = this.backpack.filter(item => item.id !== oldItem.id);
      });

      // TODO: toggle via config
      this.community.on("debug", console.log);
    } catch (err) {
      console.log("err", err);
    }
  }

  public getConfig(): Config {
    return this.config;
  }

  public getClient() {
    return this.client;
  }

  public getCommunity() {
    return this.community;
  }

  public getTradeManager() {
    return this.manager;
  }

  public isOwner(steamId64: string): boolean {
    return this.config.owners.includes(steamId64);
  }

  public notifyOwners(message: string): void {
    try {
      this.config.owners.map(owner => this.client.chatMessage(owner, message));
    } catch (err) {
      console.log("error while notifiying", err);
    }
  }

  public craftMetal(): void {
    const scrapMetal: SimpleItem[] = this.backpack.filter(
      (item: SimpleItem) => item.def_index === MetalType.SCRAP_METAL,
    );
    const reclaimedMetal: SimpleItem[] = this.backpack.filter(
      (item: SimpleItem) => item.def_index === MetalType.RECLAIMED_METAL,
    );

    if (reclaimedMetal.length >= 3) {
      for (let x = 0; x + 2 < reclaimedMetal.length; x += 3) {
        const craftItems = [
          reclaimedMetal[x].id,
          reclaimedMetal[x + 1].id,
          reclaimedMetal[x + 2].id,
        ];

        // TODO: catch error
        this.tf2.craft(craftItems);
      }
    }

    if (scrapMetal.length >= 3) {
      for (let x = 0; x + 2 < scrapMetal.length; x += 3) {
        const craftItems = [
          scrapMetal[x].id,
          scrapMetal[x + 1].id,
          scrapMetal[x + 2].id,
        ];

        // TODO: catch error
        this.tf2.craft(craftItems);
      }
    }
  }
}
