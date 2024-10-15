var jwt = require('jsonwebtoken');
module.exports = {
    jwtToken: function (data) {
        return jwt.sign(data, 'newarchapikey');
    }
}
