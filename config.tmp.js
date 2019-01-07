module.exports = {
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 3000,
    wellKnownPeers: [
        { host: 'localhost', port: 3000 }
    ]
};