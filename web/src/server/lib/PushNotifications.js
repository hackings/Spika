var _ = require('lodash');
var mysql = require('mysql');
var Const = require('../const.js');
var APNService = require('APNService.js');
var GCMService = require('GCMService.js');

var PushNotifications = {
  sendNotifications = function(senderID,receiverID,receiverType,callback){
    
    var connection = mysql.createConnection(Const.mysql)
    connection.connect();
    var sql = '';
    if(receiverType.match(/Group/)){
      sql = "SELECT id, device_uuid, device_type FROM users INNER JOIN group_users ON users.id = group_users.user_id WHERE group_users.id = " + senderID + "AND users.id != " + senderID;
    else if(receiverType.match(/User/))
      sql = "SELECT id, device_uuid, device_type FROM users WHERE id = " + receiverID;
    }
    connection.query(sql, function(err, rows, fields) {
      _.forEach(rows, function(row){ 
        if(row.device_type == 'iphone'){
          APNService.sendMessage(row.device_uuid, callback)        
        }else if( row.device_type == 'Android'){
          GCMService.sendMessage('some message', row.device_uuid, callback) 
        }
      })  

    });

  }
}  

module["exports"] = PushNotifications;
