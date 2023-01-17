define(["model/cloud","model/pass","model/user","model/exercise"], function (cloud,passModel,userModel,exerciseModel) {
    return {
        convertFromV1 : function(){

            var exercises = {};
            var passes = passModel.get();
            for(var i in passes){
                $.extend(exercises,passes[i].exercises);
            }

            cloud.update("exercises",exercises);

            var users = userModel.get();

            for(var i in users){
                if(!users[i].exercises)
                    users[i].exercises = {};
                if(!users[i].passes)
                    users[i].passes = {};
                for(var j in users[i]){
                    if(j != "name" && j != "passes" && j != "exercises"){
                        users[i].passes[j] = users[i][j];
                        for(var k in users[i][j]){
                            if(k != "lastUpdate") {
                                users[i].exercises[k] = users[i][j][k];
                                delete users[i][j][k];
                            }
                        }

                        delete users[i][j];
                    }

                }
            }

            console.log(users);
            cloud.update("users",users);
            cloud.update("settings/dataVersion",1);
        },
        convertToV2 : function(){
          var users = userModel.get();
          var exercises = exerciseModel.get();
          for(var userName in users){
            var newExercises = {};
            if(!users[userName].exercises)
                users[userName].exercises = {};
            for(var exerciseName in users[userName].exercises){
              //console.log(users[i].exercises[j])
              for(var trainInst in users[userName].exercises[exerciseName]){
                var dateId = dateToId(users[userName].exercises[exerciseName][trainInst].date);

                if(!newExercises[exerciseName])
                  newExercises[exerciseName] = {};
                if(!newExercises[exerciseName][dateId])
                  newExercises[exerciseName][dateId] = {}


                delete users[userName].exercises[exerciseName][trainInst].pass;

                var index = Object.keys(newExercises[exerciseName][dateId]).length;
                newExercises[exerciseName][dateId][index] = users[userName].exercises[exerciseName][trainInst];
              }
            }
            users[userName].exercises = newExercises;
          }

          cloud.update("users",users);
          cloud.update("settings/dataVersion",2);
        }
    }
});
