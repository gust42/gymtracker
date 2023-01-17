define(["model/cloud"], function (cloud) {
    var passes = {};

    cloud.registerUpdate(function(data){
        passes = data.passes ? data.passes : {};
    });

    return {
        save : function(pass){

            cloud.update("passes/"+pass.name,pass);

        },
        update : function(pass){
            passes[pass.name] = pass;
            cloud.update("/passes/"+pass.name,pass);
        },
        get : function(id){
            if(id)
                return passes[id];

            return passes;
        },
        remove : function(user){

        }
    }
});
