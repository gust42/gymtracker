define(["model/cloud"], function (cloud) {
    var settings = {};

    cloud.registerUpdate(function(data){
        settings = data.settings ? data.settings : {};
    });

    return {
        save : function(settings){

            cloud.update("settings",settings);

        },
        update : function(setting){
            passes[setting.name] = setting;
            cloud.update("/settings/"+setting.name,setting);
        },
        get : function(name){
            if(name)
                return settings[name];

            return settings;
        },
        remove : function(){

        }
    }
});
