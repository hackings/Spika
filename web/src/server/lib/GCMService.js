var gcm = require('node-gcm');
var Const = require('../const.js');

var GCMService = {
  notifyGCM: function(tokens,callback){

	  var message = new gcm.Message({data: {message: '' }});
	  var sender = new gcm.Sender(Const.gcm_api_key);
	  sender.send(message, { registrationTokens: tokens }, function (err, response) {
		   if (err){
			console.error(err);
			callback(Const.gcm_msg_send_failure);
		  } else 	{

			  console.log(response);
			  callback(Const.gcm_msg_send_success);
		  }
	  });

  }
}  

module["exports"] = GCMService;
