var express = require('express'),
    app = express(),
    root = "" + __dirname + "/src";

app.use(express.static(root));
app.use(function(req, res, next) {
    res.contentType('text/html; charset=UTF-8');
    res.sendFile(root + '/index.html');
});

module.exports = app;
