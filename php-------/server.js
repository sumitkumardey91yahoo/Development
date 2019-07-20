/* jshint node: true */
var express = require('express');
var app = express();

// Serve public folder as static -> configure via proxy server itself for performance
app.use('/src', express.static(__dirname + '/src', { maxage: 604800000 }));
app.use('/dist', express.static(__dirname + '/dist'));
app.use("/sw.js", express.static(__dirname + "/sw.js"));
app.use("/manifest.json", express.static(__dirname + "/manifest.json"));
// NOTE added for swiper
app.use("/swiper", express.static(__dirname + "/swiper"));


app.get('*', function (request, response) {
    // response.send('<h1>Homepage</h1><div>This is homepage.</div>'); // you can also directly write HTML content
    response.sendFile(__dirname + '/index.html');
});


var server = app.listen(process.env.PORT || 8000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("ALTBalaji Web app listening at http://%s:%s", host, port);

});