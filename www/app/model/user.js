define(["model/cloud"], function (cloud) {
    var users = {};

    cloud.registerUpdate(function(data){
        users = data.users ? data.users : {};
    });

    return {
        save : function(user){

            users[user.name] = user;

            cloud.update("users",users);
        },
        update : function(user){
            users[user.name] = user;
            cloud.update("users",users);
        },
        updatePath : function(path,data){
          cloud.update("users/"+path,data);
        },
        get : function(id){
          if(id)
            return users[id];
          return users;
        },
        remove : function(user){
            delete users[user.name];
            cloud.update("users",users);
        }
    }
});
