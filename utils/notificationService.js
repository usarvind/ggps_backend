var async = require('async'),
	config = require('../app-config'),
	notificationModel = require("../model/notificationHistoryModel");
require('dotenv').config();
const PushNotifications = new require('node-pushnotifications');
const pushNotification = new PushNotifications({
	gcm: process.env.gcm_id
});
const notification_msg = {
	//title: 'New push notification', // REQUIRED
	//body: 'Powered by AppFeel', // REQUIRED
	topic: 'aqs.ttl.apollo', // apn and gcm for ios
	priority: 'high', // gcm, apn. Supported values are 'high' or 'normal' (gcm). Will be translated to 10 and 5 for apn. Defaults to 'high'
	collapseKey: 'aqs.ttl.apollo', // gcm for android, used as collapseId in apn
	consolidationKey: 'my notification', // ADM
};

var notifyService = {
	sendNotification: function (userData, cb) {
		let msg = {};
		for (var k in notification_msg)
			if (!msg.hasOwnProperty[k]) msg[k] = notification_msg[k];
		msg["title"] = userData.title;
		msg["body"] = userData.text;

		pushNotification.send(userData.token, msg, function (e, r) {
			//console.log("send notification response ",r.failure);
			if (e) {
				let notificationHistory = new notificationModel();
				notificationHistory.userId = userData.userId;
				notificationHistory.schemaName = userData.schemaName;
				notificationHistory.title = userData.title;
				notificationHistory.text = userData.text;
				notificationHistory.source = userData.source;
				notificationHistory.recordType = userData.recordType;
				notificationHistory.failure = 1;

				notificationHistory.save(function (err, res) {
					if (err) {
						cb(e)
					} else {
						cb(e)
					}
				})
			} else {
				let notificationHistory = new notificationModel();

				if (r[0].failure == 1) {
					notificationHistory.userId = userData.userId;
					notificationHistory.schemaName = userData.schemaName;
					notificationHistory.title = userData.title;
					notificationHistory.text = userData.text;
					notificationHistory.source = userData.source;
					notificationHistory.recordType = userData.recordType;
					notificationHistory.multicastId = r[0].multicastId[0];
					notificationHistory.failure = r[0].failure;
					notificationHistory.success = r[0].success;
					notificationHistory.errorMessage = r[0].message[0].errorMsg;
				} else if (r[0].failure == 0 && r[0].success == 0) {
					notificationHistory.userId = userData.userId;
					notificationHistory.schemaName = userData.schemaName;
					notificationHistory.title = userData.title;
					notificationHistory.text = userData.text;
					notificationHistory.source = userData.source;
					notificationHistory.recordType = userData.recordType;
					notificationHistory.failure = r[0].failure;
					notificationHistory.success = r[0].success;
				}
				else {
					notificationHistory.userId = userData.userId;
					notificationHistory.schemaName = userData.schemaName;
					notificationHistory.title = userData.title;
					notificationHistory.text = userData.text;
					notificationHistory.source = userData.source;
					notificationHistory.recordType = userData.recordType;
					notificationHistory.multicastId = r[0].multicastId[0] ? r[0].multicastId[0] : null;
					notificationHistory.failure = r[0].failure;
					notificationHistory.success = r[0].success;
				}

				notificationHistory.save(function (err, res) {
					if (err) {
						cb(err)
					} else {
						cb(null, r);
					}
				})
			}
		});
	}
};

module.exports = notifyService;
