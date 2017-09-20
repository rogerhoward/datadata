// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer, remote, shell } = require('electron');
const { dialog } = remote;

const { spawn } = require('child_process');

var fs = require("fs"),
    path = require("path");

// const ls = 

// const setApplicationMenu = require('./menu');

// const form = document.querySelector('form');

// const inputs = {
//     source: form.querySelector('button[name="source"]'),
//     // destination: form.querySelector('input[name="destination"]'),
//     // name: form.querySelector('input[name="name"]'),
//     // fps: form.querySelector('input[name="fps"]'),
// };

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

function handleFile(path, stats) {
    console.log(path, stats);
}

const buttons = {
    source: document.getElementById('chooseSource'),
};



buttons.source.addEventListener('click', () => {
    const directory = dialog.showOpenDialog({
        properties: ['openDirectory'],
    })[0];

    console.log(directory);

    if (directory) {
        // inputs.source.value = directory;
        // alert(directory);

        walk(directory, handleFile);


    }
});
