// Author: Anh Duong
// ======================================================================

// get things we need
var express = require('express');
var app = express();
var path = require('path');
var port = process.env.port || 12345;

// set the public folder to serve public assets
app.use(express.static(__dirname + '/public'));

// set up our one route to the index.html file
app.get('*', function(req, res) 
{
	res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

// Start server
app.listen(port);
console.log("Magic happen on port " + port);
