define(["https://cdn.firebase.com/js/client/2.4.0/firebase.js"], function () {

    var fb = null;

    return {
        updateCallbacks : [],
        init : function(name){

            if(!fb && name)
                fb = new Firebase("https://gust-gymtracker.firebaseio.com/"+name);
            else if(fb.key() != name)
                fb = new Firebase("https://gust-gymtracker.firebaseio.com/"+name);
        },
        update : function(path,data){
          fb.child(path).set(data);
        },
        push : function(path,data){
            return fb.child(path).push(data);
        },
        createData: function () {
            var file = {};
            file.nextId = 1;
            file.passes = {};
            file.users = {};

            return file;
        },
        startSync: function (callback) {
            var def = $.Deferred();
            var name = localStorage['gust.gymtracker.cloudName'];
            var self = this;
            if(name) {
                this.init(name);

                fb.on("value", function (snapshot) {
                    var data = snapshot.val();
                    if(data === null) {
                      def.reject();
                      return;
                    }
                    console.log(data);
                    $(document).trigger("cloudUpdated",data);
                    for(var i = 0; i < self.updateCallbacks.length; i++)
                    {
                        self.updateCallbacks[i](data);
                    }
                    def.resolve();
                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                    def.reject();
                });
            }

            return def;
        },
        registerUpdate : function(callback){
            this.updateCallbacks.push(callback);
        },
        activateCloud: function (name,cloudName) {

            var newSync = false;

            if(!cloudName) {
                cloudName = name;

                cloudName += Date.now().toString().substr(-4);

                newSync = true;
            }

            localStorage['gust.gymtracker.cloudName'] = cloudName;

            this.init(cloudName);

            if(newSync) {
                fb.set(this.createData());
            }

            return this.startSync().fail(function(){
              localStorage.removeItem('gust.gymtracker.cloudName');
            });

        }
    };

});
