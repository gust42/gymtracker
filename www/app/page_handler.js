define(["require","model/user","model/cloud","model/settings","model/convert","model/exercise",],function (require,user,cloud,settings,convert) {
    return {
    	pageLoad : function(){
            if(localStorage['gust.gymtracker.cloudName'] == null)
            {
                this.changePage("firststart");
                $("#loading").hide();
            }
            else {
                var self = this;
                $.when(cloud.startSync()).done(function(){
                    $("#loading").hide();
                    $(".navbar-fixed-top").removeClass("hidden");
                    $("#menu").attr('style','');
                    if(settings.get().dataVersion == null){
                        console.log('No settings');
                        convert.convertFromV1();
                    }
                    if(settings.get().dataVersion == 1){
                        convert.convertToV2();
                    }

                    if (sessionStorage['gust.currentPage']) {
                        var param = JSON.parse(sessionStorage['gust.currentPage']);
                        self.changePage(param.page, param.data);
                    }
                    else
                        self.changePage("passlist");
                });

            }

    	},
        changePage: function (page,data) {
        	console.log('changePage ' +page)
            $(document).off("cloudUpdated");
            $(document).off("click",".btn");
            $("#content").attr('class',"");
            $("#content").addClass(page);
            require(['app/'+page+'/view'],function(pageCtrl){
              pageCtrl.contentElement = $("#content");
            	pageCtrl.init(data);
            	sessionStorage['gust.currentPage'] = JSON.stringify({page : page, data : data});
            });
        }
    };
});
