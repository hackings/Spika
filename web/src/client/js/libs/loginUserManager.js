var User = require('../Models/user.js');

/**
 * LoginUserManager
 * 
 * @class
 */ 
(function(global) {
    "use strict;"

    var LoginUserManager = {
        
        user : null,
        roomID : null,
        id: 0,
        
        
        /**
         * Set the user after successfully logged in
         * 
         * @method
         * @name LoginUserManager.setLoginUser
         * @param name
         * @param avatarURL
         * @param roomID
         * @param id
         * @param token
        */
        setLoginUser: function(name,role,avatarURL,roomID, id, token){
            
            this.user = new User.Model({
                id: id,
                name:name,
                role: role,
                avatarURL:avatarURL,
                token:token
            });
            
            this.roomID = roomID;
            
        }
            
    };

    // Exports ----------------------------------------------
    module["exports"] = LoginUserManager;

})((this || 0).self || global);
