define(["model/exercise"], function (exerciseModel) {
	return {
			pass : null,
			load : function(pass){
				this.pass = pass;
			},
      draw : function(element){
        var html = new EJS({url: 'app/passwizard/views/step2.ejs'}).render({});
        $(element).html(html);

				this.exercises = exerciseModel.get();

				this.drawExerciseSelect();
				this.drawExercises();
				this.binding();
      },
			binding : function(){
					var self = this;
					$(document).off('click','#step-2 .btn').on("click",'#step-2 .btn', function(ev){
							if($(this).attr("data-func"))
									self[$(this).attr("data-func")](this,ev);
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
			drawExerciseSelect : function(){
				var html = "";
				for(var exerciseName in this.exercises){
					if(!this.pass.exercises[exerciseName])
						html += '<option value="'+makeId(exerciseName)+'">'+exerciseName+'</option>';
				}

				$('#list-of-exercises').html(html);
			},
			drawExercises : function(){
				var html = "";
				for(var exerciseName in this.pass.exercises){
					html += '<div data-id="'+makeId(exerciseName)+'" class="list-group-item clearfix">'+exerciseName+
							'<div data-func="removeExercise" class="btn btn-default btn-sm pull-right">'+
								'<span class="glyphicon glyphicon-remove"></span>'+
							'</div>'+
						'</div>';
				}
				if(html)
					$("#exercise-list").html(html);
			},
			createExercise : function(){
				require(['app/editexercise/view'],function(pageCtrl){

	        var html = new EJS({url: 'app/passwizard/views/newexercise.ejs'}).render({});
	        $("body").append(html);
					pageCtrl.contentElement = $("#new-exercise-popup");
					pageCtrl.init(this.exerciseCreated.bind(this));
				}.bind(this));
			},
			exerciseCreated: function () {
				$('.popup').remove();
				this.exercises = exerciseModel.get();
				this.drawExerciseSelect();
			},
			addExercise : function(){
				var exercise = $('#list-of-exercises').val();
				if(exercise){
					var exerciseObj = this.exercises[parseId(exercise)];
					if(exerciseObj){
						this.pass.exercises[parseId(exercise)] = {
							name : parseId(exercise),
							set : parseInt(exerciseObj.set),
							rep : parseInt(exerciseObj.rep)
						};
						$('#list-of-exercises').find('[value="'+exercise+'"]').remove();
						this.drawExercises();
					}
				}
			},
			removeExercise : function(el){
				var parent = $(el).parents('.list-group-item');
				var name = parseId(parent.data('id'));
				if(name){
					delete this.pass.exercises[name];
					parent.remove();
					this.drawExerciseSelect();
				}
			}
    };
  });
