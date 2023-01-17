define(["model/exercise"], function (exerciseModel) {
	return {
			pass : null,
			load : function(pass){
				this.pass = pass;
			},
      draw : function(element){
        var html = new EJS({url: 'app/passwizard/views/step3.ejs'}).render({});
        $(element).html(html);

				this.exercises = exerciseModel.get();

				this.drawExercises();

				this.binding();
      },
			binding : function(){
					var self = this;
					$(".btn","#step-2").on("click", function(ev){
							if($(this).attr("data-func"))
									self[$(this).attr("data-func")](this,ev);
					});
					$('#step-3 .input-group-addon').off('click').on("click", function(ev){
						self.incrementData(this);
					});
					$("#step-3 input").off('change').on('change',function(){
						self.valueChanged(this);
					});
			},
      validate : function(){
				if(Object.keys(this.pass.exercises).length === 0){
					$("#step-2").find(".error-message")
						.removeClass('hidden').text("Du måste lägga till minst 1 övning");
					return false;
				}

        return true;
      },
			drawExercises : function(){
				var html = "";
				for(var exerciseName in this.pass.exercises){
					html += new EJS({url: 'app/passwizard/views/exerciserow.ejs'})
						.render(this.pass.exercises[exerciseName]);
				}
				$("#set3-exercise-list").html(html);
			},
			valueChanged : function(el){
				var parent = $(el).parents('.list-group-item');
				var name = parseId(parent.data('id'));
				var type = $(el).is('.exercise-set') ? 'set' : "rep";
				if(isNaN(el.value)){
						el.value = this.pass.exercises[name][type];
						return;
				}

				this.pass.exercises[name][type] = parseInt(el.value);
			},
			incrementData : function(el){
				var parent = $(el).parents('.list-group-item');
				var name = parseId(parent.data('id'));
				var type = $(el).is('.change-set') ? 'set' : "rep";

				if(name){
					var mod = parseInt(el.dataset.val);
					if(this.pass.exercises[name]){
						var newVal = this.pass.exercises[name][type] + mod;
						if(newVal > 0){
							this.pass.exercises[name][type] = newVal;
							parent.find('input.exercise-'+type).val(newVal);
						}
					}
				}
			}
    };
  });
