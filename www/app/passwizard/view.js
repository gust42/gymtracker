define(['model/pass','./step1.js','./step2.js','./step3.js'],function (passModel,step1,step2,step3) {

    return {
        pass : null,
        currentStep : 1,
        init : function(){
          this.currentStep = 1;
          this.pass = {
            exercises : {}
          };
          step1.load(this.pass,passModel);
          step2.load(this.pass);
          step3.load(this.pass);
          this.updateView();
        },
        updateView : function(){
            var html = new EJS({url: 'app/passwizard/views/view.ejs'}).render({});
            $("#content").html(html);

            step1.draw($("#step-1"));

            this.binding();
        },
        binding : function(){
            var self = this;
            $(".step-buttons .btn",".passwizard").on("click", function(ev){
                if($(this).attr("data-func"))
                    self[$(this).attr("data-func")](this,ev);
            });
        },
        validateStep : function(step){
          $('.error-message').text('').addClass('hidden');
          $('.form-group').removeClass('has-error');
          if(step == 1){
            return step1.validate();
          }
          if(step == 2){
            return step2.validate();
          }
          if(step == 3){
            return step3.validate();
          }
          return true;
        },
        gotoStep : function(step){
          this.currentStep = step;

          $("#save-pass").addClass('hidden');
          $("#step-forward").removeClass('hidden');

          if(step == 2){
            this.pass.name = $('#pass-name').val().trim();
            step2.draw($("#step-2"));

          }
          if(step == 3){
            step3.draw($("#step-3"));
            $("#step-forward").addClass('hidden');
            $("#save-pass").removeClass('hidden');
          }
        },
        changeStep : function(stepMod){
          var step = this.currentStep+stepMod;
          if(this.validateStep(this.currentStep) || stepMod < 0){

            $("#step-"+this.currentStep).addClass('hidden');
            $("#step-"+step).removeClass('hidden');
            this.gotoStep(step);
            if(this.currentStep > 1)
              $("#step-back").removeClass('hidden');
            else {
              $("#step-back").addClass('hidden');
            }
          }
        },
        savePass : function(){
          if(this.pass){
            passModel.save(this.pass);
          }
        },
        stepGoForward : function(){
          this.changeStep(1);
        },
        stepGoBack : function(){
          this.changeStep(-1);
        }
    };
});
