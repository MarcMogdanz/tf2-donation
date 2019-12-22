import { generateAuthCode } from "steam-totp";
import { Config } from "./config";
const SteamUser = require("steam-user");
const SteamCommunity = require("steamcommunity");
const TradeOfferManager = require("steam-tradeoffer-manager");

export class Bot {
  private config: Config;
  private client: any;
  private community: any;
  private manager: any;

  constructor(config: Config) {
    this.config = config;
    this.client = new SteamUser();
    this.community = new SteamCommunity();
    this.manager = new TradeOfferManager({
      community: this.community,
      steam: this.client,
      language: "en",
    });

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
}
