define(["model/user","model/exercise"],function ( userModel,exerciseModel) {

    return {
      users : null,
      exercises : null,
      totalRange : "today",
      init : function(){
        this.users = userModel.get();
        this.exercises = exerciseModel.get();
        this.updateView();
      },
      updateView : function(){
          var html = new EJS({url: 'app/stats/views/view.ejs'}).render({});
          $("#content").html(html);
          this.drawTotalWeight();
          this.binding();
      },
      binding : function(){
          var self = this;
          $(".btn").on("click", function(ev){
              if($(this).attr("data-func"))
                  self[$(this).attr("data-func")](this,ev);
          });

          $("#choose-total-range li").on("click", function(ev){
              self.chooseTotalLiftRange(this,ev);
          });
      },
      drawTotalWeight : function(){
        var div = "";
        for(var exerciseName in this.exercises) {
          var data = {};
          div += '<div class="list-group-item"><div class="list-group-item-heading">'+exerciseName+'</div>';
          userDivs = [];
          for(var userName in this.users){
            if(this.users[userName].exercises[exerciseName]){
              data[userName] = { weight : 0 };
              if(this.totalRange == "alltime"){
                for(var date in this.users[userName].exercises[exerciseName]){
                  this.getWeightForDate(data[userName],this.users[userName].exercises[exerciseName],date);
                }
              }
              else if(this.totalRange == "week"){
                  var today = parseInt(dateToId(moment()));
                  for(var date in this.users[userName].exercises[exerciseName]){
                    if(today-parseInt(date) <= 7 && today-parseInt(date) >= 0){
                      this.getWeightForDate(data[userName],this.users[userName].exercises[exerciseName],date);
                    }
                  }
              }
              else if(this.totalRange == "today"){
                this.getWeightForDate(data[userName],this.users[userName].exercises[exerciseName],dateToId(moment()));
              }
            }
            if(data[userName])
              userDivs.push('<b>'+userName + '</b> ' +data[userName].weight+'kg');
          }
          div += userDivs.join(', ');
          div += '</div>';
        }
        $("#total-lift").html(div);
      },
      getWeightForDate : function(data,exercise,date){
        for(var set in exercise[date]){
          var curSet = exercise[date][set];
          var w = parseInt(curSet.weight);
          if(curSet.reps){
            var reps = parseInt(curSet.reps);
            data.weight += w*reps;
          } else {
            data.weight += w;
          }
        }
      },
      chooseTotalLiftRange : function(el,ev){
        $("#choose-total-range li").removeClass('active');
        $(el).addClass('active');
        this.totalRange = el.dataset.range;
        this.drawTotalWeight();
      }
    };
});
