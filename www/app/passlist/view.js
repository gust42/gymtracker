define([ "app/page_handler","model/user","model/pass", "model/exercise"], function (pageHandler,userModel, passModel, exerciseModel) {
	return {
		passes : {},
		users : null,
		exercises : {},
		addedExercises : [],
		participants : {},

		init : function(){
			this.participants = {};
			this.passes = passModel.get();
			var self = this;


			this.updateView();
			this.binding();
			this.users = userModel.get();
			this.exercises = exerciseModel.get();

			var savedParticipants = localStorage['gust.gymtracker.selectedUsers'];
			var div = "";
			for (var j in this.users) {
				var checked = 'checked="checked"';
				if(savedParticipants && savedParticipants.indexOf(self.users[j].name) == -1)
					checked = '';

				div += '<a href="#" class="select-user btn btn-primary"><input class="' + j + '" '+checked+' type="checkbox" /> ' + j + '</a>';
			}

			$(".user-list").html(div);

			div = "";

			for(var i in this.passes) {
				var pass = this.passes[i];
				div = $(new EJS({url: 'app/passlist/views/pass.ejs'}).render(pass));
				var date = null;
				for (j in pass.exercises) {
					var exercise = this.exercises[j];
					//var data = this.users[0].getExerciseById(exercise.id);
					div.find(".pass-exerciselist").append('<li class="list-group-item">' + exercise.name + " - " + exercise.set + " * " + exercise.rep + '</li>');

				}

				for(j in this.users){
					var lastUpdated = "";
					if(!this.users[j].passes)
						this.users[j].passes = {};
					if(this.users[j].passes[i] && this.users[j].passes[i].lastUpdate)
						lastUpdated = " - "+moment(this.users[j].passes[pass.name].lastUpdate).fromNow();
					if(lastUpdated)
						div.find('.last-used').append('<div>'+j+lastUpdated+'</div>');
				}
				/*var lastUpdated = "";
				if(!this.users[j].passes)
					this.users[j].passes = {};
				if(this.users[j].passes[pass.name] && this.users[j].passes[pass.name].lastUpdate)
					lastUpdated = " - "+moment(this.users[j].passes[pass.name].lastUpdate).fromNow();
				if (date)*/
					//div.find(".pass-date").html(moment(date).format("MM/DD"));
				$("#passes").append(div);
			}

			if(!div)
				$("#passes").html('<div class="alert alert-info">Det finns inga pass än, gå till hantera pass för att skapa</div>');

			$('.select-user').off('click').on('click',function(){
				var input = $(this).find('input');
				input.prop("checked", !input.prop("checked"));
				return false;
			});
		},
		updateView : function(){
			var html = new EJS({url: 'app/passlist/views/view.ejs'}).render({});
    		$("#content").html(html);
		},
		binding : function(){
			var self = this;
			$(document).off('click',".passlist .panel,.passlist .btn").on("click",".passlist .panel,.passlist .btn",function(ev){
				if($(this).attr("data-func"))
					self[$(this).attr("data-func")](this,ev);
			});
		},
		getParticipants : function(){
			var checked = $(".user-list").find(":checked");
			var self = this;
			var participants = [];
			$.each(checked,function(){
				var id = $(this).attr("class");
				for(var i in self.users)
				{
					if(i == id) {
						self.participants[i] = self.users[i];
						participants.push(self.participants[i].name);
					}
				}
			});

			return participants;
		},
		select_pass : function(element,ev){
			if(!$(ev.target).is("input"))
			{
				var name = $(element).find(".panel-heading div").first().text();
				var pass = this.passes[name];

				this.selectedPass = pass;

				var participants = this.getParticipants();

				if(participants.length === 0){
					$(element).append('Du måste välja minst en deltagare');
					return;
				}

				localStorage['gust.gymtracker.selectedUsers'] = participants.join(",");

				pageHandler.changePage("train",{selectedPass : pass, participants : this.participants});
			}
		},
		chooseCustomExercises : function(){
			if($('#custom-exercises').length > 0){
				$('#custom-exercises').remove();
			}
			else {
				var self = this;
				$("#content").append(new EJS({url: 'app/passlist/views/customexercises.ejs'})
					.render(this.exercises));

				$(".popup .list-group-item").off('click').on('click',function(){
					$(this).toggleClass('active');
				});

				$("#popup-cancel").off('click').on('click',function(){
						$('#custom-exercises').remove();
				});

				$("#popup-train").off('click').on('click',function(){
						var items = $(".popup .list-group-item.active");
						if(items.length>0){
							var exercises = {};
							items.each(function(){
								var name = parseId(this.id);
								exercises[name] = name;
							});

							var participants = self.getParticipants();

							var pass = {
								exercises : exercises,
								name : "Valda övningar"
							}

							pageHandler.changePage("train",{selectedPass : pass, participants : self.participants});

						}
						else {
							$(".popup list-group").after('Välj minst en övning');
						}
				});
			}
		}
	};

});
