alib = require('../node/alib');
require('../shared/alib');
require('../shared/alib_trnsp');

var util = require("util"),
  http = require("http");

var options = {
  host: "www.google.com",
  port: 80,
  path: "/"
};

var content = "";

var req = http.request(options, function(res) {
  res.setEncoding("utf8");
  res.on("data", function(chunk) {
    content += chunk;
  });

  res.on("end", function() {
  });
});

req.end();
