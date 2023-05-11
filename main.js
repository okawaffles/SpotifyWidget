const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express');
const server = express();
const querystring = require('querystring')
const axios = require('axios')
const request = require('request')
require('dotenv').config()

let loginwin;
let code, state;

var client_id = '3c1850f691cd44ab92a4fced4bfb655b';
var redirect_uri = 'http://localhost:8888/callback';
var client_secret = process.env.CLIENT_SECRET;

server.get('/login', function(req, res) {
    console.log('login')

    var state = "218f0aa28ea2f7d";
    var scope = 'user-read-currently-playing';
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
});

server.get('/callback', (req, res) => {
    console.log('callback')
    code = req.query.code;
    state = req.query.state;

    const win = new BrowserWindow({
        width: 500,
        height: 200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    loginwin.destroy();

    win.loadFile('index.html')
    
    // clear top bar
    win.setMenu(null);
});

server.get('/wants', (req, res) => {
    console.log('wants!')
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, (err, response, body) => {
        res.json(body)
    })
})

server.listen(8888);



function createWindow() {
    loginwin = new BrowserWindow({
        width: 500,
        height: 750
    });
    loginwin.loadURL('http://localhost:8888/login');
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
