define(["app/model/model","app/page_handler","app/classes/user",'model/user','model/cloud'],function (ajax,pageHandler,User,userModel,cloud) {

	return {
		users : null,

		init : function(){
			this.users = userModel.get();
			this.updateView();
		},
		updateView : function(){
			var html = new EJS({url: 'app/settings/views/view.ejs'}).render({});
    		$("#content").html(html);

    		var div = "";
    		for(var i in this.users)
    		{
    			div += '<div class="list-group-item">'+this.users[i].name+'<span class="pull-right glyphicon glyphicon-remove"></span></div>';
    		}
    		$("#users").html(div);

			$("#cloud-name").val(localStorage['gust.gymtracker.cloudName']);

			this.binding();
		},
		binding : function(){
			var self = this;
			$(".btn","#content").on("click",function(){
				if(self[$(this).attr("data-func")])
					self[$(this).attr("data-func")](this);
			});
		},
		button_newuser : function(el){
			if($("#user-name").val());
			{
				var user = {
					name : $("#user-name").val()
				};

				userModel.save(user);

				$("#users").append('<div class="list-group-item">'+user.name+'<span class="pull-right glyphicon glyphicon-remove"></span></div>');
			}
		},
		button_activatecloud : function(){
			if($("#cloud-name").val()){
				$("#loading").show();
				$.when(cloud.activateCloud(this.users,$("#cloud-name").val()).done(function(){
					$("#loading").hide();
				}));
			}
			else
				alert("Fyll i ett molnnamn");

		}
	};

});
