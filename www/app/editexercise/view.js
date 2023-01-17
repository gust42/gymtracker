define(["model/user","model/exercise"],function ( userModel,exerciseModel) {

    return {
      element : null,
      users : null,
      exercises : null,
      totalRange : "today",
      init : function(saveCallback){
        this.saveCallback = saveCallback;
        this.updateView();
      },
      updateView : function(){
          var html = new EJS({url: 'app/editexercise/views/view.ejs'}).render({});
          this.contentElement.html(html);
          this.binding();
      },
      binding : function(){
          var self = this;
          $(".btn",".editexercise").on("click", function(ev){
              if($(this).attr("data-func"))
                  self[$(this).attr("data-func")](this,ev);
          });

          $('.editexercise .input-group-addon').off('click').on("click", function(ev){
						self.incrementData(this);
					});
      },
      saveExercise : function(){
        $(".error-message").addClass('hidden').text('');
        $(".form-group").removeClass('has-error');
        var name = $("#e-name").val().trim();
        if(!validateKey(name)){
          $("#e-name").parents('.form-group').addClass('has-error');
          $("#name-error")
            .removeClass('hidden')
            .text("Namnet får inte vara tomt eller innehålla följande tecken: . $ # [ ] /");
            return;
        }
        var set = $(".exercise-set").val();
        var rep = $(".exercise-rep").val();
        if(isNaN(set) || isNaN(rep)){
          $("#set").parents('.form-group').addClass('has-error');
          $("#setrep-error")
            .removeClass('hidden')
            .text("Set och repetationer måste bestå av siffror");
            return;
        }

        if(set == 0 || rep == 0 ){
          $("#set").parents('.form-group').addClass('has-error');
          $("#setrep-error")
            .removeClass('hidden')
            .text("Set och repetationer måste vara fler än 0");
            return;
        }

        var exercise = {
          name : name,
          set : set,
          rep : rep
        };

        exerciseModel.save(exercise);

        if(this.saveCallback)
          this.saveCallback();
      },
      incrementData : function(el){

        var parent = $(el).parents('.input-group');
        var type = $(el).is('.change-set') ? 'set' : "rep";

        var input = parent.find('input.exercise-'+type);
        var mod = parseInt(el.dataset.val);
        var newVal = parseInt(input.val()) + mod;
        if(newVal > 0){
          input.val(newVal);
        }
      }
    };
});
