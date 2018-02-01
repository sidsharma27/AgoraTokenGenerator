var http = require('http');
var express = require('express');
var AgoraSignGenerator = require('./AgoraSignGenerator');
var favicon = require('serve-favicon');

var AgoraSignalingKeyGenerator = require('./SignalingToken');
const md5 = require("md5");
var PORT = 8080;

var app = express();
app.disable('x-powered-by');
app.set('port', PORT);
app.use(express.favicon());
app.use(app.router);

var generateDynamicKey = function(req, resp) {
    var channelName = req.query.channelName;
    if (!channelName) {
        return resp.status(400).json({ 'error': 'channel name is required' }).send();
    }

    var ts = Math.round(new Date().getTime() / 1000);
    var rnd = Math.round(Math.random() * 100000000);
    var key = AgoraSignGenerator.generateDynamicKey("Agora-App-ID", "Agora-App-Certificate", channelName, ts, rnd);

    resp.header("Access-Control-Allow-Origin", "*")
    return resp.json({ 'key': key }).send();
};


var generateSignalingKey = function(req, resp) {
  var accountName = req.query.accountName;

  if (!accountName) {
    return resp.status(400).json({'error': 'account name is required'}).send();
  }

  var ts = Math.round(new Date().getTime() / 1000);

  var signalingToken = AgoraSignalingKeyGenerator.generateSignalingKey("Agora-App-ID", "Agora-App-Certificate", accountName, ts + 100000);
  resp.header("Access-Control-Allow-Origin", "*")

  return resp.json({ 'signalingToken': signalingToken }).send();
};

app.get('/dynamic_key', generateDynamicKey);
app.get('/signaling_key', generateSignalingKey);

http.createServer(app).listen(app.get('port'), function() {
    console.log('AgoraSignServer starts at ' + app.get('port'));
});
