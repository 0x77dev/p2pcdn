const p2p = require("p2p");
const config = require("./config");
const express = require("express");
const bodyParser = require('body-parser');
const http = require("http");
const peer = p2p.peer({
  host: config.host,
  port: config.port,
  wellKnownPeers: config.wellKnownPeers,
  metadata: {
    host: config.host,
    port: config.http.port
  }
});

peer.on('status::*', status => {
  logger.info('Changed status.', status);
});

peer.on('environment::successor', successor => {
  logger.info('Changed successor.', { successor });
});

peer.on('environment::predecessor', predecessor => {
  logger.info('Changed predecessor.', { predecessor });
});

peer.handle.process = function (payload, done) {
  logger.info('Processing job.', payload);
  done(null, {
    endpoint: peer.self
  });
};

const app = express();

app.use(bodyParser.json());

app.post('/job', (req, res) => {
  peer.getPeerFor(req.body.value, (errGetPeerFor, node) => {
    if (errGetPeerFor) {
      return res.sendStatus(500);
    }
    peer.remote(node).run('process', req.body, (err, result) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.send(result);
    });
  });
});

http.createServer(app).listen(config.http.port);

peer.on('status::*', status => {
  console.log(status);
});
