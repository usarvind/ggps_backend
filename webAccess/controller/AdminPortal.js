module.exports = function () {
	var module = {};

	module.login = require('./AdminPortal/login')();
	module.dashboard = require('./AdminPortal/dashboard')();
	module.students = require('./AdminPortal/students')();
	module.studentsAcademic = require('./AdminPortal/studentsAcademic')();
	module.dynamicModal = require('./AdminPortal/dynamicModal')();
	module.studentsFeesTransaction = require('./AdminPortal/studentsFeesTransactions')();
	module.subjects = require('./AdminPortal/subjects')();
	return module;
}