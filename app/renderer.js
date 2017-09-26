// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer, remote, shell} = require('electron');
const { dialog } = remote;
const { spawn, spawnSync } = require('child_process');

var fs = require("fs"),
    path = require("path"),
    os = require("os"),
    walkSync = require('walk-sync');


var thisCollection;

console.log(window.process.resourcesPath);


if (os.platform() === 'win32') {
    var exifPath = path.join(__dirname, '../bin/win32/exiftool.exe');
    var pathDelim = "\\";
} else {
    // var exifPath = path.join(__dirname, '../bin/osx/exiftool');
    var exifPath = path.join(window.process.resourcesPath, '/bin/osx/exiftool');
    var pathDelim = "/";
}


class Asset {
    constructor(source, destination) {
        updateStatus("Adding new Asset, source: " + source + ", destination: " + destination);
        this.source = source;
        this.destination = destination;
    }

    sync() {
        if ((fs.existsSync(this.source)) && (fs.existsSync(this.destination))) {
            updateStatus("Syncing " + this.source + " to " + this.destination);
            const ls = spawnSync(exifPath, ["-overwrite_original", "-tagsfromfile", this.source, "-exif:all", this.destination]);
            console.log(ls.output.toString());
    }
}
}

class AssetCollection {

    constructor(path) {
        updateStatus("Adding new AssetCollection: " + path);
        this.path = path;
        this.paths = [];
        this.assets = [];
        this.scan();

        this.dosync = true;
    }

    scan() {
        this.paths = walkSync(this.path, { directories: false });

        for (var index = 0; index < this.paths.length; index++) {
            var path = this.path + pathDelim + this.paths[index];
            
            if (path.endsWith('.DNG')) {
                var pathTwin = path.substr(0, path.length - 4) + ".JPG";
                
                if (fs.existsSync(pathTwin)) {
                    this.assets.push(new Asset(pathTwin, path));
                }
            }
        }
    }

    add(item) {
        this.assets.push(item);
    }

    sync() {

        for (var index = 0; index < this.assets.length; index++) {
            if (this.dosync) {
                this.assets[index].sync();
            }
            var percentComplete = (index + 1) / this.assets.length * 100;
            updateProgress(percentComplete, this.assets[index].destination)
        }

        $("#syncBtn").hide();

    }

}

function updateProgress(value, msg) {
    if (value < 100) { 
        $("#progress")
              .css("width", value + "%")
              .attr("aria-valuenow", value)
              .text(msg);
      } else {
        $("#progress")
              .css("width", value + "%")
              .attr("aria-valuenow", value)
              .text("Done. Click Choose Folder... again to pick another image set.");        
      }
}

function resetProgress() {
    var value = 0;
    $("#progress")
          .css("width", value + "%")
          .attr("aria-valuenow", value)
          .text("Ready.");
}



function updateStatus(msg) {
    console.log(msg);

    statusDiv = $("#status");
    old_status = statusDiv.html();
    statusDiv.html(old_status + msg + '<br>');

    statusDiv.animate({
      scrollTop: 1000000000
    }, 500);

}

function clearStatus(msg) {
    statusDiv = $("#status");
    old_status = statusDiv.html("");
}



function getSource() {
    const directories = dialog.showOpenDialog({
        properties: ['openDirectory'],
    });

    if (directories.length > 0) {
        resetProgress();
        thisCollection = new AssetCollection(directories[0]);
        $("#syncBtn").show();
    }
}



document.getElementById('chooseSourceBtn').addEventListener('click', () => {
    getSource();
});


document.getElementById('syncBtn').addEventListener('click', () => {
    thisCollection.sync();
});

