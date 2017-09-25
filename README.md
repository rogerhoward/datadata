# Datadata

Photopair Syncing for cameras, like the Autel X-Star Premium's, which capture DNG and JPEG files simultaneously, but the DNG files have incomplete metadata. Datadata is a simple tool which scans a directory, and all of its subdirectories, for pairs of DNG and JPEG files (photopairs). For each pair, Datadata will copy the EXIF metadata from the JPG to the DNG.

![screenshot](https://rogerhoward.github.io/datadata/screenshot.png)

## Getting started - Mac OSX

- [Download](https://github.com/rogerhoward/datadata/raw/master/dist/datadata-0.1.0.dmg) and install the app
- Launch the app
- Click _Choose Folder_ and select a directory which contains images (subdirectories are fine too) *
- Click _Sync!_ to copy metadata from JPG to its paired DNG.

*Note:* please test this only on files you've backed up, just in case. This app is largely untested, and may eat your files, burn your home, and destroy your crops. You've been warned!

## Windows - coming soon!

Once the features stabilize I'll polish up the Windows build and do a second round of testing.

### About Roger

Roger is an independent software engineer and consultant. You may find out a little more, as well as discover contact info for him, on his [biopage](http://rogerhoward.name)