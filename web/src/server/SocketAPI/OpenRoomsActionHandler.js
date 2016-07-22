var _ = require('lodash');
var Observer = require("node-observer");

var UsersManager = require("../lib/UsersManager");
var DatabaseManager = require("../lib/DatabaseManager");
var Utils = require("../lib/Utils");
var Const = require("../const");
var SocketHandlerBase = require("./SocketHandlerBase");
var UserModel = require("../Models/UserModel");
var MessageModel = require("../Models/MessageModel");
var async = require("async");
var Settings = require("../lib/Settings");

var OpenRoomsActionHandler = function(){
    
}

_.extend(OpenRoomsActionHandler.prototype,SocketHandlerBase.prototype);

OpenRoomsActionHandler.prototype.attach = function(io,socket){
        
    var self = this;
    
    socket.on('openRooms', function(param){

        if(Utils.isEmpty(param.userID)){
            socket.emit('socketerror', {code:Const.resCodeSocketOpenMessageNoUserID});               
            return;
        }
               
        var updatedRooms = [];
    
        UserModel.findUserbyId(param.userID,function (err,user) {

            async.forEach(param.messageIDs, function (messageID, callback){ 

                MessageModel.findMessagebyId(messageID,function(err,message){
                    
                    if(err) {
                        socket.emit('socketerror', {code:Const.resCodeSocketUnknownError});               
                        return;
                    }
                    

                    if(!message){
                        socket.emit('socketerror', {code:Const.resCodeSocketUnknownError});               
                        return;
                    } 
                                        
                    var listOfUsers = [];
                    
                    _.forEach(message.seenBy,function(seenObj){
                           
                        listOfUsers.push(seenObj.user.toString());
                        
                    });
                                        
                    if(_.indexOf(listOfUsers,user._id.toString()) == -1){
                        
                        message.addSeenBy(user,function(err,messageUpdated){
                            
                            updatedMessages.push(messageUpdated);
                            callback(err);
                            
                        });
                        
                    }
                    
                });
                
        
            }, function(err) {

                if(err) {
                    socket.emit('socketerror', {code:Const.resCodeSocketUnknownError});               
                    return;
                }
                    
                    
                MessageModel.populateMessages(updatedMessages,function (err,messages) {

                    if(err) {
                        socket.emit('socketerror', {code:Const.resCodeSocketUnknownError});               
                        return;
                    }
                    
                    if(messages.length > 0){
    
                        // send updated messages
                        io.of(Settings.options.socketNameSpace).in(messages[0].roomID).emit('messageUpdated', messages);
                        Observer.send(this, Const.notificationMessageChanges, messages);
                        
                    }

                });

            });  

        });

    });

}


module["exports"] = new OpenRoomsActionHandler();
