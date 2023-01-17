define(["app/page_handler","model/pass"],function (pageHandler, passModel) {

	return {
		passes : null,

		init : function(){
			this.passes = passModel.get();
			this.updateView();
		},
		updateView : function(){
			var html = new EJS({url: 'app/editpass/views/view.ejs'}).render({});
    		$("#content").html(html);
			var div  = "";
			for(var i in this.passes) {
				div += new EJS({url: 'app/editpass/views/pass.ejs'}).render(this.passes[i]);
			}
			$("#pass-list").html(div);


			this.binding();
		},
		binding : function(){
			var self = this;
			$(".btn,.list-group-item",$("#content")).on("click",function(){
				self[$(this).attr("data-func")](this);
			});

			var target = null;

			$(".row").on("dragend",function(ev){
				if(target)
				{
					$(this).detach();
					$(target).after(this);
					console.log('drop on target');
				}

				console.log('drop');
			});

			$(".row").on("dragover",function(ev){
				if(ev.originalEvent.clientY < $(this).offset().top)
				{
					console.log('ovan');
					target = $(this).prev();
				}
				else
					target = this;
			});
		},
		editPass : function(pass){
			pageHandler.changePage("pass",pass);
		},
		pass_click : function(el){
			for(var i in this.passes)
			{
				if(this.passes[i].name == parseId($(el).parents(".row").attr("id")))
				{
					this.editPass(this.passes[i])
					break;
				}
			}
		},
		delete_pass : function(el){
			var self = this;
			for(var i in this.passes)
			{
				if(this.passes[i].id == $(el).parents(".row").attr("id"))
				{
					$.when(ajax.sendRequest({
						url : "/service/exercise/delete",
						data : this.passes[i],
						method : "POST"
					})).done(function(success){
						$("#"+self.passes[i].id).remove();
					})
					break;
				}
			}

			return false;
		}
	}

});
