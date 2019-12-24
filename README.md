# Donation bot for Team Fortress 2 :gift:

Currently this is just kind of a proof-of-concept but it's working!

I'll work more on this if people are interested, so let me know! :wink:

# Features :boom:

- Accept donations
- Auto accept trade offers from owners
- Auto craft metal
- Notify owners via Steam

# Roadmap :eyes:

- Notifications via Telegram
- Auto craft weapons to scrap
- Auto delete cases (based on type)
- Save per user donation stats
- Give ranks on TeamSpeak/Discord
- Restrictions on what items to accept
- Backpack full notification
- Generate auth code for bot account
- Better logging

# Usage :squirrel:

You can either clone the repo yourself and start it directly on your machine, see [Local](#Local), or build the Docker image which automatically handles all dependencies and does run everywhere, see [Docker](#Docker).

## Local

1. Clone the repository via `https` or `ssh`, for help see [here](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).

```bash
git clone https://github.com/MarcMogdanz/tf2-donation.git
git clone git@github.com:MarcMogdanz/tf2-donation.git
```

2. Make sure you have `npm` installed and install all dependencies.

```bash
npm install
```

3. Go into the cloned repository directory and build the javascript files, you need to have `python` installed.

```bash
npm run build
```

4. Setup your config, see [here](#config-wrench) in the README.

5. Start up the bot.

```bash
npm run start
```

## Docker

1. Clone the repository via `https` or `ssh`, for help see [here](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).

```bash
git clone https://github.com/MarcMogdanz/tf2-donation.git
git clone git@github.com:MarcMogdanz/tf2-donation.git
```

2. Make sure you have `Docker` installed, for help see [here](https://docs.docker.com/install).

3. Go into the cloned repository direcotry and build the image. We build the local `Dockerfile`, name it `tf2` and tag it with `latest`.

```bash
docker build . -t tf2:latest
```

4. Setup your config, see [here](#config-wrench) in the README.

5. Run the image (start the bot). We start the image `tf2` with the `latest`, which we've just built and mount a [volume](https://docs.docker.com/storage/volumes/) containing our `config/` directory. Note the `:ro` at the end, this tags the volume as `read-only` to ensure no unwanted changes to your config file will be made.

```bash
docker run -v "${PWD}/config/:/app/config/:ro" tf2:latest
```

**Note:** This should run on Linux and on Windows via Powershell, see [here](https://stackoverflow.com/questions/41485217/mount-current-directory-as-a-volume-in-docker-on-windows-10) for more. See below if you want to use it on Windows via `cmd`.

```batch
docker run -v "%cd%/config/:/app/config/:ro" tf2:latest
```

# Config :wrench:

The general schema of the config is:

```
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
```

You need to set your steam name (not the display name!) and password as well as your shared secret and identity secret. There are multiple ways to get the later two:

- [SteamDesktopAuthenticator](https://github.com/Jessecar96/SteamDesktopAuthenticator) **(recommended)**
- [Android/iOS via Windows](https://github.com/SteamTimeIdler/stidler/wiki/Getting-your-%27shared_secret%27-code-for-use-with-Auto-Restarter-on-Mobile-Authentication)

I recommend to use the `SteamDesktopAuthenticator` as it's easy to use, built for exactly this purpose and also a useful tool. Also you should use a _dedicated_ steam account for this!

The `owners` array needs to be an array of `SteamID64` of the owners. You can find your `SteamID64` [here](https://steamidfinder.com/).

# Contributing :rocket:

The easiest way to contribute is to [contact me](https://marcmogdanz.de) and tell me what you need or want. You can also create an issue containing a feature request or bug report!

And of course feel free to create PRs! :wink:

# Credits :heart:

The most credits go to [Alex Corn](https://github.com/DoctorMcKay) for all of his awesome `npm` packages ([node-steam-user](https://github.com/DoctorMcKay/node-steam-user), [node-steam-tradeoffer-manager](https://github.com/DoctorMcKay/node-steam-tradeoffer-manager), [node-steam-totp](https://github.com/DoctorMcKay/node-steam-totp), [node-steamcommunity](https://github.com/DoctorMcKay/node-steamcommunity), [node-tf2](https://github.com/DoctorMcKay/node-tf2)).

And also to [Andrew Dassonville](https://github.com/andrewda) for his easy to follow [guide](https://github.com/andrewda/node-steam-guide) on how to get started with all of this.

# License :mag:

This repository is published under the [MIT License](https://github.com/MarcMogdanz/tf2-donation/blob/master/LICENSE).
