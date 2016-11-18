var express = require('express');

var app = express();

app.use('/static', express.static(__dirname + '/static'));

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

app.listen(process.env.PORT);