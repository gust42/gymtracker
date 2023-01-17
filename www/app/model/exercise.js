define(["model/cloud"], function (cloud) {
    var exercises = {};

    cloud.registerUpdate(function(data){
        exercises = data.exercises ? data.exercises : {};
    });

    return {
        save : function(exercise){

            cloud.update("exercises/"+exercise.name,exercise);

        },
        update : function(exercise){
            exercises[exercise.name] = exercise;
            cloud.update("/exercises/"+exercise.name,exercise);
        },
        get : function(id){
            if(id)
                return exercises[id];

            return exercises;
        },
        remove : function(){

        }
    }
});
