module.exports = function () {
	var module = {};

	module.admin = require('./AdminPortal.js')();
	module.web = require('./Website.js')();

	return module;
}	