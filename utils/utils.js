var constants = require('../utils/constants');
const utils = {
	clone: function (source) {
		if (Object.prototype.toString.call(source) === '[object Array]') {
			var _clone = [];
			for (var i = 0; i < source.length; i++) {
				_clone[i] = utils.clone(source[i]);
			}
			return _clone;
		} else if (typeof (source) == "object") {
			var _clone = {};
			for (var prop in source) {
				if (source.hasOwnProperty(prop)) {
					_clone[prop] = utils.clone(source[prop]);
				}
			}
			return _clone;
		} else {
			return source;
		}
	},
	is_equal: function (x, y) {
		if (x === y) return true;
		// if both x and y are null or undefined and exactly the same
		if (!(x instanceof Object) || !(y instanceof Object)) return false;
		// if they are not strictly equal, they both need to be Objects
		if (x.constructor !== y.constructor) return false;
		// they must have the exact same prototype chain, the closest we can do is
		// test there constructor.
		for (var p in x) {
			if (!x.hasOwnProperty(p)) continue;
			// other properties were tested using x.constructor === y.constructor
			if (!y.hasOwnProperty(p)) return false;
			// allows to compare x[ p ] and y[ p ] when set to undefined
			if (x[p] === y[p]) continue;
			// if they have the same strict value or identity then they are equal
			if (typeof (x[p]) !== "object") return false;
			// Numbers, Strings, Functions, Booleans must be strictly equal
			if (!utils.is_equal(x[p], y[p])) return false;
			// Objects and Arrays must be tested recursively
		}
		for (p in y) {
			if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
			// allows x[ p ] to be set to undefined
		}
		return true;
	},
	missingProperties: function () {
		var props = [];
		for (var i = 1; i < arguments.length; i++) {
			if (Array.isArray(arguments[i])) {
				arguments[i].forEach(a => {
					props = props.concat(utils.missingProperties(arguments[0], a));
				});
			}
			else {
				if (!arguments[0].hasOwnProperty(arguments[i])) props.push(arguments[i]);
			}
		}
		return props;
	},
	similarity: function (s1, s2) {
		var longer = s1;
		var shorter = s2;
		if (s1.length < s2.length) {
			longer = s2;
			shorter = s1;
		}
		var longerLength = longer.length;
		if (longerLength == 0) {
			return 1.0;
		}
		return (longerLength - utils.editDistance(longer, shorter)) / parseFloat(longerLength);
	},
	editDistance: function (s1, s2) {
		s1 = s1.toLowerCase();
		s2 = s2.toLowerCase();

		var costs = [];
		for (var i = 0; i <= s1.length; i++) {
			var lastValue = i;
			for (var j = 0; j <= s2.length; j++) {
				if (i == 0)
					costs[j] = j;
				else {
					if (j > 0) {
						var newValue = costs[j - 1];
						if (s1.charAt(i - 1) != s2.charAt(j - 1))
							newValue = Math.min(Math.min(newValue, lastValue),
								costs[j]) + 1;
						costs[j - 1] = lastValue;
						lastValue = newValue;
					}
				}
			}
			if (i > 0)
				costs[s2.length] = lastValue;
		}
		return costs[s2.length];
	},
	passwordGenerator : function(len, callback ) {
        var length = (len)?(len):(10);
        var string = "abcdefghijklmnopqrstuvwxyz"; //to upper 
        var numeric = '0123456789';
        var punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
        var password = "";
        var character = "";
        while( password.length<length ) {
            entity1 = Math.ceil(string.length * Math.random()*Math.random());
            entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
            entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
            hold = string.charAt( entity1 );
            hold = (password.length%2==0)?(hold.toUpperCase()):(hold);
            character += hold;
            character += (Math.floor(Math.random()*9)).toString();
            character += punctuation.charAt( entity3 );
            character += String.fromCharCode(Math.floor(Math.random()*26) + 97); //'a'.charCodeAt(0));
 
            password = character;
        }
        password=password.split('').sort(function(){return 0.5-Math.random()}).join('');
        var newpass= password.substr(0,len);
        var passregex =constants.regex.randomPasswordRegex;
        if(newpass !== undefined && passregex.test(newpass)){
			callback(null,newpass);
		}
		else
			this.passwordGenerator(len, callback);
    },            
	random_str: function (len) {
		len = len || 32;
		const str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var s = "";
		for (var i = 0; i < len; i++) s += str[Math.floor(Math.random() * 52)];
		return s + ".pdf";
	},
	formatDate: function (date) {

		let day = date.getDate();
		let monthIndex = parseInt(date.getMonth()) + 1;
		let year = date.getFullYear();

		return year + '-' + monthIndex + '-' + day;
	},
	formatDateByYYYYMMDD: function (date) {
		let list = date.split('/');
		return list[2] + '-' + list[1] + '-' + list[0];
	},
	addDefaults: function (item, addFields) {
		item = Object.assign(item, addFields);
		return item;
	},
	camelize: function camelize(str) {
		return str.replace(/\W+(.)/g, function (match, chr) {
			return chr.toUpperCase();
		});
	},
	camelizeSeperator: function (text, separator = "_") {
		return text.split(separator)
			.map(w => w.replace(/./, m => m.toUpperCase()))
			.join("")
	},
	filterEmptyFields: function (data) {
		for (p in data) {
			let fields = {};
			Object.keys(p).forEach(key => p[key] != '' ? fields[key] = p[key] : key);
			return fields;
		}
	}
};
module.exports = utils;

