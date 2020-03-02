# ue4-mp-downloader
Shell utility to download owned assets from the UE4 marketplace.

![Example](https://i.gyazo.com/e0db9e073c6be2907bb1275489675d39.gif)

## This is a fork!

I forked this off of the [original repository by `Allar`](https://github.com/Allar/ue4-mp-downloader/). I forked this as the original version didn't work for me. It used what looked like an older authentication handshake that used unrealengine.com instead of epicgames.com auth. This repo also adds support for 2FA! Much of the code is heavily influenced by Allar's repository, and I wanted to thank him for his work getting it to this point!

You may notice I did some heavy lifting though; I changed the project to TypeScript, reorganized things, etc. to follow different paradigms I use in my own coding. This is why I'm not going to request merging this into the original repo.

## Support

I offer ZERO support. If you have a problem with this, please post an issue but I don't guarantee I'll resolve it. I wrote this tool for myself since I need to grab a bunch of marketplace assets on a Linux machine and was too lazy to copy paste files around.

## Legal

For this tool to work, you must have already accepted Epic's Terms (on account registration) and relevant EULAs (prompted when you open the Launcher for the first time or buy a marketplace item).

This tool can only download assets you own.

[`Allar`](https://github.com/Allar) inquired Epic in the past about the legality of custom marketplace tools when developing other tools he made. Epic Games seems to not have a problem with this. I, `seesemichaelj`, mean no foul or infringement, and I will take this repo down immediately at the request of Epic Games if they do so.

## Disclaimer

Everything here is offered as-is. If bad things happen, including but not limited to burning down your house or gives your mom a rash, I am not responsible.

## Installation

1. Install NodeJS if you don't already have it installed: https://nodejs.org/en/download
1. `npm install -g ue4-mp-downloader`

## Usage

Run `ue4-mp-downloader`

You will be prompted to log in. This tool does not save or record your credentials for your safety, so you will have to log in every time you use it. Once logged in, any assets downloaded will be downloaded to your current working directory in a folder called `download`.

## Testing

Tested and confirmed working on Windows 8 and 10 running both NodeJS v6 and v8. Tested and confirmed working on Ubuntu 16 with Node v8.

## Known Issues

If your machine doesn't have as much free ram as the asset you are downloading, you will get weird errors doing the download and extract process. My algorithm has no need to keep it all in memory, yet it still does. If anyone knows why my javascript download and extract process isn't freeing up memory after every asset file extract, please let me know, or even better, submit a fix!

Code Plugins currently fail to download due to a 403 (Forbidden) error.
