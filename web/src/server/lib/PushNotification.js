var APNService = require('APNService');
var GCMService = require('GCMService')

var PushNotification = {

  sendNotifications = function(msgAttrs,callback){   
    APNService.notifyAPN(msgAttrs.iPad||[], callback);
    APNService.notifyAPN(msgAttrs.iPhone||[], callback);
    GCMService.notifyGCM(msgAttrs.Android||[], callback);
  }
}

module["exports"] = PushNotification;
