var fs = require('fs');

fs.exists       = fs.exists || require('path').exists;
fs.existsSync   = fs.existsSync || require('path').existsSync;

module.exports = fs;
