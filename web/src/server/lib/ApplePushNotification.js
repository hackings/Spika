var apn = require('apn');
var Const = require('../const.js');
var apnOptions = { cert: '', key: '', ca: [], pfx: '', 
  passphrase: '', production: false, maxConnections: 1 };

var ApplePushNotification = {

  sendMessage = function(token,callback){   
    var apnConnection = new apn.Connection(apnOptions);
    var myDevice = new apn.Device(token);
    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 3;
    note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
    note.payload = {'messageFrom': 'MDA'};

    apnConnection.pushNotification(note, myDevice);

	}
}

module["exports"] = ApplePushNotification;
