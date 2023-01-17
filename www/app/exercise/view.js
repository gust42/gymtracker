define(["app/ajax"],function (ajax) {

	return {
		init : function(){
			this.updateView();
    	this.binding();
		},
		updateView : function(){
			var html = new EJS({url: 'app/exercise/views/view.ejs'}).render({})
    		$("#content").html(html);
		},
		binding : function(){
			$(".btn").on("click",this[$(".btn").attr("data-func")])
		},
		button_add : function(){
			$.when(ajax.sendRequest({
				url : "/service/exercise/add",
				data : JSON.stringify({
					name : $("#name").val(),
					rep : $("#rep").val(),
					set : $("#set").val()
				}),
				method : "POST"
			})).done(function(){
				console.log('done!')
			})
		}
	}

});
