var apn = require('apn');
var Const = require('../const.js');
var apnOptions = { cert: '', key: '', ca: [], pfx: '', 
  passphrase: '', production: false, maxConnections: 1 };

var APNService = {

  notifyAPN: function(tokens,callback){   
    var apnConnection = new apn.Connection(apnOptions);
    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 3;
    note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
    note.payload = {'messageFrom': 'MDA'};

    apnConnection.pushNotification(note, tokens);

	}
}

module["exports"] = APNService;
