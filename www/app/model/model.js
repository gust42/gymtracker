define(["require","model/cloud"],function (require,cloud) {

	return {
		loads : 0,
		sendRequest : function(options){

			var nextId = localStorage["gust.gymtracker.nextid"];
			if(!nextId)
				nextId = 0;

			var def = $.Deferred();
			this.startLoad();



			if(options.url.indexOf("exercise") >= 0)
			{
				var data = localStorage["gust.gymtracker.passes"];

				if(!data)
					data = [];
				else
					data = JSON.parse(data);

				var input = null;
				if(options.data)
				{
					if(typeof options.data == "object")
						input = options.data;
					else
						input = JSON.parse(options.data);
				}

				if(options.url.indexOf("get") >= 0)
				{
					def.resolve(data);
				}

				if(options.url.indexOf("add") >= 0)
				{
					input.id = ++nextId;

					for(var i in input.exercises)
					{
						input.exercises[i].id = ++nextId;
					}

					data.push(input);
					def.resolve(input);
				}

				if(options.url.indexOf("save") >= 0)
				{
					for(var i in data)
					{
						if(data[i].id == input.pass.id)
						{
							data[i] = input.pass;
							break;
						}
					}

					def.resolve(true);
				}

				if(options.url.indexOf("delete") >= 0)
				{
					for(var i = data.length-1; i >= 0; i--)
					{
						if(data[i].id == input.id)
						{
							data.splice(i,1);
							break;
						}

					}
					def.resolve(true);
				}


				localStorage["gust.gymtracker.passes"] = JSON.stringify(data);
			}

			if(options.url.indexOf('settings') >= 0)
			{
				var data = localStorage["gust.gymtracker.settings"];
				var input = null;
				if(options.data)
					input = options.data;
				if(!data)
					data = [];
				else
					data = JSON.parse(data);

				if(options.url.indexOf("get") >= 0)
				{
					def.resolve(data);
				}
			}
			if(options.url.indexOf('user') >= 0)
			{
				var data = localStorage["gust.gymtracker.users"];
				var input = null;
				if(options.data)
					input = options.data;
				if(!data)
					data = [];
				else
					data = JSON.parse(data);

				if(options.url.indexOf("get") >= 0)
				{
					def.resolve(data);
				}

				if(options.url.indexOf("update") >= 0)
				{
					for(var i in data)
					{
						if(data[i].id == input.user.id)
						{
							data[i] = input.user;
							break;
						}
					}
					cloud.update(data);
					def.resolve(true);
				}

				if(options.url.indexOf("save") >= 0)
				{
					input.id = ++nextId;
					data.push(input);
					def.resolve(input);
				}
				
				localStorage["gust.gymtracker.users"] = JSON.stringify(data);
			}

			localStorage["gust.gymtracker.nextid"] = nextId;

			this.stopLoad();

			return def;
		},
		startLoad : function(){
			if(this.loads <= 0)
			{
				$("body").append('<div id="loading">Kontaktar servern</div>');
			}
			this.loads++;
		},
		stopLoad : function(){
			this.loads--;
			if(this.loads <= 0)
			{
				$("#loading").remove();
			}
		}
	}

});