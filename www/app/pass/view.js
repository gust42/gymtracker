define(["app/model/model","app/page_handler","model/pass","model/user","model/exercise"],function (ajax,pageHandler,passService,userModel,exerciseModel) {

	return {
		pass : {},
		update : false,
		exercises : null,
		init : function(pass){
			if(pass){
				this.pass = pass;
				this.update = true;
			}
			else
			{
				this.pass = {
					name : "",
					exercises : {}
				}
			}

			this.exercises = exerciseModel.get();

			this.updateView();
			this.binding();
		},
		updateView : function(){
			var html = new EJS({url: 'app/pass/views/view.ejs'}).render({})
    		$("#content").html(html);

    		var div = new EJS({url: 'app/pass/views/exercise.ejs'}).render({});

    		$("#exercises").html(div);


			for(var i in this.exercises){
				$("#exercise-list").append('<option value="'+this.exercises[i].name+'">'+this.exercises[i].name+'</option>');
			}

    		if(this.pass)
    		{
    			$("#name").val(this.pass.name);
    			for(var i in this.pass.exercises)
    			{
    				var exercise = this.exercises[i];
					$("#added-exercises").append(new EJS({url: 'app/pass/views/exerciserow.ejs'}).render(exercise));
    			}
    		}
		},
		binding : function(){
			var self = this;
			$(document).on("click",".btn",function(){
				self[$(this).attr("data-func")](this);
			});

			$(document).on("change",".exercise-row input",function(){
				self.updateExercise(this);
			});
		},
		updateExercise : function(el){
			var id = parseId($(el).parents(".exercise-row").attr("id"));
			for(var i in this.pass.exercises)
			{
				if(i == id.replace("exercise-",""))
				{
					this.exercises[i][$(el).attr("class").replace("form-control","").replace(/\s+$/, '')] = $(el).val();
				}
			}
		},
		button_newExercise : function(){
			$("#create-new").toggleClass("hidden");
			$("#add-existing-exercise").toggleClass('hidden');
		},
		button_addexercise : function(el){
			var exercise = this.exercises[$("#exercise-list").val()];
			if(this.pass.exercises[exercise.name] == null) {
				this.pass.exercises[exercise.name] = exercise.name;
				$("#added-exercises").append(new EJS({url: 'app/pass/views/exerciserow.ejs'}).render(exercise));
			}
			else {
				alert('Övningen finns redan på passet');
			}
		},
		button_addnewexercise : function(el){
			var name = $("#e-name").val();
			var set = $("#set").val();
			var rep = $("#rep").val();
			if(!name || !set || !rep) {
				alert('Ange namn, sets och repetitioner')
				return;
			}
			var exercise = {
				name : name.trim(),
				set : set.trim(),
				rep : rep.trim()
			};
			this.pass.exercises[exercise.name] = exercise.name;
			this.exercises[exercise.name] = exercise;
			$("#added-exercises").append(new EJS({url: 'app/pass/views/exerciserow.ejs'}).render(exercise));
		},
		button_removeexercise : function(el){
			var parent = $(el).parents(".exercise-row");
			for(var i in this.pass.exercises)
			{
				if(i == parseId(parent.attr("id")).replace("exercise-",""))
				{
					delete this.pass.exercises[i];
					break;
				}
			}
			parent.remove();
		},
		button_add : function(){
			var self = this;
			this.pass.name = $("#name").val();
			if(this.pass)
			{
				passService.update(this.pass);
				for(var i in this.exercises){
					exerciseModel.save(this.exercises[i]);
				}

				pageHandler.changePage("editpass");
			}
			else
			{
				passService.save(this.pass);
			}
		}
	};

});
