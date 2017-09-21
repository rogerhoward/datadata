// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer, remote, shell } = require('electron');
const { dialog } = remote;
var fs = require("fs"),
    path = require("path"),
    os = require("os");

var assets = [];

const { spawn, spawnSync } = require('child_process');

if (os.platform() === 'win32') {
    var exifPath = path.join(__dirname, 'bin/win32/exiftool.exe')
} else {
    var exifPath = path.join(__dirname, 'bin/osx/exiftool')
}



function syncMetadata(source, destination) {
    if ((fs.existsSync(source)) && (fs.existsSync(destination))) {
        const ls = spawnSync(exifPath, ["-tagsfromfile", source, "-exif:all", destination]);
        console.log(ls.output.toString());

    }
}


function walk(dir, callback) {

    fs.readdir(dir, function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
            var filepath = path.join(dir, file);
            fs.stat(filepath, function(err,stats) {
                if (stats.isDirectory()) {
                    walk(filepath, callback);
                } else if (stats.isFile()) {
                    callback(filepath, stats);
                }
            });
        });
    });
}

// function syncAssets() {
//     for (asset of assets) {
//         console.log(asset);
//     }
// }


function handleFile(path, stats) {
    // console.log(path, stats);

    // const ls = spawnSync('cat', [path]);

    // console.log(ls.output.toString());

    if (path.endsWith('.DNG')) {
        pathTwin = path.replace('.DNG', '.JPG');

        if (fs.existsSync(pathTwin)) {
            assets.push({source:pathTwin, destination: path})
            // syncMetadata(pathTwin, path)
        }

    }

}


const buttons = {
    source: document.getElementById('chooseSource'),
};


buttons.source.addEventListener('click', () => {

    const directory = dialog.showOpenDialog({
        properties: ['openDirectory'],
    })[0];

    if (directory) {
        assets = [];
        walk(directory, handleFile);
        console.log(assets, assets.length);

        // console.log('assets are populated', assets.length);
        // // for (let asset of assets) {
        // //     console.log(asset);
        // // }

        // assets.forEach(function(item){
        //     console.log('hello');
        // });
        

    }


});
