var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var path = require('path');
var _ = require('lodash');

var RequestHandlerBase = require("./RequestHandlerBase");
var UsersManager = require("../lib/UsersManager");
var UserModel = require("../Models/UserModel");
var MessageModel = require("../Models/MessageModel");
var DatabaseManager = require("../lib/DatabaseManager");
var Utils = require("../lib/Utils");
var Const = require("../const");
var async = require('async');
var formidable = require('formidable');
var fs = require('fs-extra');
var path = require('path');
var mime = require('mime');
var SocketAPIHandler = require('../SocketAPI/SocketAPIHandler');
var tokenChecker = require('../lib/Auth');

var RecentMessagesHandler = function(){
    
}

_.extend(RecentMessagesHandler.prototype,RequestHandlerBase.prototype);

RecentMessagesHandler.prototype.attach = function(router){
        
    var self = this;

    router.get('/:userID/:groupIds',function(request,response){
      
        var userID = request.params.userID;
        var groupIds = request.params.groupIds || [];
        if(_.isEmpty(userID)){
          self.successResponse(response,Const.resCodeRecentMessagesNoUserID, "userID not provided");
          return;
        }
       
        async.waterfall([
          function (done) {
            MessageModel.distinctRooms(userID,groupIds, 
              function (err,roomIds) {
                done(err,roomIds);
            });
          },
          function (roomIds,done) {
            MessageModel.findByRooms(roomIds,
              function (err,messages) {
                done(err,messages);
            });
          },
          function(messages,done){
            var recentMessages = {};
            _.forEach(messages, function(message){
              UserModel.findUserbyId(message.userID, function(err,user){
                var seenBy = _.map(message.seenBy, 'user');
                var isUnread = !_.includes(seenBy, user._id) && message.userID != userID;
                if(!recentMessages[message.roomID]){
                  recentMessages[message.roomID] = {};
                  recentMessages[message.roomID]['message'] = message;
                  recentMessages[message.roomID]['unreadCount'] = 0;
                }
                if(isUnread){ recentMessages[message.roomID]['unreadCount'] += 1 }
              });
            });
            done(null, recentMessages);
          },
          function(recentMessages,done){
            done(null, recentMessages);
          }
          ],
          function (err, data) {
            if(err){
              self.errorResponse(response,Const.httpCodeSeverError);
            }else{
              self.successResponse(response,Const.responsecodeSucceed,data);
            }
          }
        );

    });


}

new RecentMessagesHandler().attach(router);
module["exports"] = router;
