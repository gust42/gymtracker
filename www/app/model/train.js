define(["model/cloud"], function (cloud) {
    return {
        save : function(exercise){
            //fb.child("/exercise/"+exercise.user+"/"+exercise.pass+"/"+exercise.name).push(exercise);
            return cloud.push("users/"+exercise.user+"/exercises/"+exercise.name, exercise);
        },
        update : function(dateId,set,exercise){
            //fb.child("/exercise/"+exercise.user+"/"+exercise.pass+"/"+exercise.name).update(exercise);
            cloud.update("users/"+exercise.user+"/exercises/"+exercise.name+"/"+dateId+"/"+set, exercise);
        },
        get : function(id){

        },
        remove : function(user){

        }
    }
});
