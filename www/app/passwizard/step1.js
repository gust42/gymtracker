define([], function () {
	return {
      pass : null,
			passModel : null,
      load : function(pass,passModel){
        this.pass = pass;
				this.passModel = passModel;
      },
      draw : function(element){
        var html = new EJS({url: 'app/passwizard/views/step1.ejs'}).render({});
        $(element).html(html);
      },
      validate : function(){
        var parent = $('#pass-name').parents('.form-group');
        var name = $('#pass-name').val().trim();
        if(name === ""){
          parent.addClass('has-error');
          parent.find(".error-message")
            .removeClass('hidden').text("Namn får inte vara tomt");
          return false;
        }
        if(!validateKey(name)) {

          parent.addClass('has-error');
          parent.find(".error-message")
            .removeClass('hidden').text("Namnet får inte innehålla följande tecken: . $ # [ ] /");
          return false;
        }

				if(this.passModel.get(name)){
					parent.addClass('has-error');
          parent.find(".error-message")
            .removeClass('hidden').text("Det finns redan ett pass med det namnet");
          return false;
				}


        return true;
      }
    };
  });
