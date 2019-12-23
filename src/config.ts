import fs from "graceful-fs";

export interface Config {
  steam: {
    account: {
      name: string;
      password: string;
      sharedSecret: string;
      identitySecret: string;
    };
  };
  bot: {
    autoCraftMetal: boolean;
  };
  owners: string[];
}

let config: Config;

export const loadConfig = (): Config => {
  // caching
  if (config) {
    return config;
  }

  try {
    const file = fs.readFileSync("config/default.json").toString();
    const json = JSON.parse(file);
    // TODO: check if the json actually implements the Config interface
    config = json as Config;
  } catch (err) {
    console.log("Error while loading config", err);
    process.exit(1);
  }

  // @ts-ignore - in case of an error, the script will exit
  return config;
};
