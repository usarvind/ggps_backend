module.exports = function (app, controllers) {
	require('./AdminPortal')(app, controllers.admin);
	require('./Website')(app, controllers.web);
}	