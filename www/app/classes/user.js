define(function(){

    function User(data){
        this.name = data.name;
        this.exercises = data.exercises ? data.exercises : [];
        this.id = data.id;
    }

    User.prototype.getExerciseById = function(id){
        if(this.exercises) {
            if (this.exercises[id])
                return this.exercises[id];
        }
    };

    return User;
});