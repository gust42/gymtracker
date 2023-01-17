define(["app/page_handler","model/cloud","model/user"],function (pageHandler, cloud, userModel) {

    return {
        init : function(){
            this.updateView();
        },
        updateView : function(){
            var html = new EJS({url: 'app/firststart/views/view.ejs'}).render({});
            $("#content").html(html);
            this.binding();
        },
        binding : function(){
            var self = this;
            $(".btn").on("click", function(ev){
                if($(this).attr("data-func"))
                    self[$(this).attr("data-func")](this,ev);
            });
        },
        saveUserName : function(){
            if($("#user-name").val())
            {
                var user = {
                    name : $("#user-name").val()
                };
                //userService.save(user);

                cloud.activateCloud(user.name);
                userModel.save(user);
                pageHandler.changePage("passlist");
                $(".navbar-fixed-top").removeClass("hidden");
                $("#menu").attr('style','');
            }
            else
                alert('Ange ett användarnamn');
        },
        showCloud : function(){
          $(".first-visit").toggleClass("hidden");
          $(".cloud").toggleClass("hidden");
        },
        activateCloud : function(){
    			if($("#cloud-name").val()){
            $("#loading").show();
    				$.when(cloud.activateCloud(null,$("#cloud-name").val().trim()).done(function(){
    					$("#loading").hide();
              $(".navbar-fixed-top").removeClass("hidden");
              $("#menu").attr('style','');
              pageHandler.changePage("passlist");
    				})).fail(function(){
              $(".alert").removeClass('hidden');
              $("#loading").hide();
            });
          }
    			else
    				alert("Fyll i ett molnnamn");
        }
    };
});
