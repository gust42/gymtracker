/*jslint browser: true*/
/*global define*/
define(["model/user", "model/train", "model/pass", "model/exercise"], function( userModel, trainModel, passModel, exerciseModel) {
  'use strict';
  return {
    passes: {},
    users: null,
    exercises: {},
    addedExercises: [],
    participants: {},
    participant: null,

    init: function(data) {
      this.exercises = exerciseModel.get();
      this.selectedPass = data.selectedPass;
      this.participants = {};
      this.selectedDate = moment();
      for (var i in data.participants) {
        this.participants[i] = userModel.get(i);
      }
      this.currentSet = 0;
      this.updateView();
    },
    updateView: function() {
      var html = new EJS({
        url: 'app/train/views/view.ejs'
      }).render(this.selectedPass);
      $("#content").html(html);
      var div = "";
      for (var i in this.participants) {
        div += '<li id="' + makeId(i) + '"><a href="#">' + i + '</a></li>';
      }
      $("#user-tabs").html(div);
      $("#user-tabs").find('li').first().addClass("active");

      div = "";
      var first = null;
      for (i in this.selectedPass.exercises) {
        if (!first)
          first = i;

        div += '<button id="' + makeId(i) + '" type="button" class="switch-exercise btn btn-primary">' + i.substr(0, 2) + '</button>';
      }

      $("#exercise-list").html(div);
      $("#exercise-list").find('button').first().addClass("active");

      if (first && this.exercises[first]) {
        this.participant = parseId($("#user-tabs").find(".active").attr('id'));
        this.selectedExercise = first;

        this.draw(this.exercises[first]);
      }

      var self = this;

      $("#user-tabs li").off('click').on('click', function() {
        $("#user-tabs li").removeClass("active");
        $(this).addClass('active');
        self.participant = parseId(this.id);
        var exercises = self.getExercises(self.selectedExercise);
        if(exercises && exercises[dateToId(self.selectedDate)]) {
          if(self.exercises[self.selectedExercise].set == Object.keys(exercises[dateToId(self.selectedDate)]).length)
            self.currentSet = Object.keys(exercises[dateToId(self.selectedDate)]).length-1;
          else
            self.currentSet = Object.keys(exercises[dateToId(self.selectedDate)]).length;
        }
        else
          self.currentSet = 0;
        self.draw(self.exercises[self.selectedExercise]);
      });
      $(".switch-exercise").off('click').on('click', function() {
        var exerciseId = parseId(this.id);
        if (self.exercises[exerciseId]) {
          self.selectedExercise = exerciseId;
          self.currentSet = 0;
          $(".switch-exercise").removeClass("active");
          $(this).addClass('active');
          self.draw(self.exercises[exerciseId]);
        }
      });

      $(document).off("cloudUpdated").on("cloudUpdated", function(ev, data) {
        for (var i in self.participants) {
          for (var j in data.users) {
            if (i == j)
              self.participants[i] = data.users[j];
          }
        }
      });
    },
    draw: function(exercise) {

      var div = $(new EJS({
        url: 'app/train/views/exercise.ejs'
      }).render(exercise));

      if (this.participant && this.participants[this.participant])
        this.drawExercise(this.participants[this.participant], div, exercise);

      $("#exercise-container").html(div);

      var set = this.getSet(this.currentSet);
      if (set && set.reps)
        $("#number-of-refs").val(set.reps);

      div = "";
      for (var i = 0; i < exercise.set; i++) {
        var color = "";
        set = this.getSet(i);
        if (set)
          color = set.fail ? "btn-danger" : "btn-success";
        div += '<div class="btn-group" role="group"><button type="button" data-set="' + i + '" class="select-set btn btn-default ' + color + '">Set ' + (i + 1) + '</button></div>';
      }
      //div += '<div class="btn-group" role="group"><button type="button" class="add-set btn btn-default">+</button></div>';
      $(".exercise-sets").html(div);
      $('.exercise-sets [data-set=' + this.currentSet + ']').addClass("active");

      $(".switch-exercise").removeClass('btn-success');
      var participantPass = this.getParticipantPass(this.selectedPass.name);
      if(participantPass) {
        for(i in this.selectedPass.exercises){
          if(participantPass.exercises && participantPass.exercises[i] && participantPass.exercises[i][dateToId(this.selectedDate)])
              $('#'+makeId(i)).removeClass("active").addClass("btn-success");
        }
      }

      this.drawHistory();

      var self = this;

      $(".date input").val(this.selectedDate.format("MM/DD"));
      $(".input-group.date").datepicker({
        format: "mm/dd",
        todayBtn: "linked",
        autoclose: true
      }).off('changeDate').on('changeDate',function(e){
        self.selectedDate = moment(e.date);
        self.draw(self.exercises[self.selectedExercise]);
      });


      $(".quick-add").off('click').on("click", function() {
        var element = $(this).parents(".top").find(".exercise-weight");
        var val = parseFloat(element.val());

        var add = $(this).attr("data-val");
        if (val.toString() == "NaN")
          val = 0;
        element.val(parseFloat(val) + parseFloat(add));
        element.trigger("change");
      });

      $(".quick-add").off('click').on("click", function() {
        var element = $(this).parents(".top").find(".exercise-weight");
        var val = parseFloat(element.val());

        var add = $(this).attr("data-val");
        if (val.toString() == "NaN")
          val = 0;
        element.val(parseFloat(val) + parseFloat(add));
        element.trigger("change");
      });

      $(".fail-button").off('click').on("click", function() {
        var element = $(this).parents(".top").find(".exercise-weight");
        $(this).toggleClass("btn-success").toggleClass("btn-danger");

        $(this).find(".glyphicon").toggleClass("glyphicon-thumbs-up").toggleClass("glyphicon-thumbs-down");

        element.trigger("change");
      });

      $(".select-set").off('click').on('click', function() {
        $(".select-set").removeClass("active");
        $(this).addClass('active');
        self.currentSet = this.dataset.set;
        self.draw(self.exercises[self.selectedExercise]);
      });

      $(".change-reps").off('click').on('click', function() {
        var element = $('#number-of-refs');
        var add = parseInt(this.dataset.val);
        element.val(parseInt(element.val()) + add);
        $(".exercise-weight").trigger("change");
      });

      $("#set-done").off('click').on('click',function(){
        $(".exercise-weight").trigger('change');
        if(self.currentSet == self.exercises[self.selectedExercise].set-1){
          if($("#"+self.selectedExercise).next().length > 0){

            $('#'+self.selectedExercise).removeClass("active").addClass("btn-success");
            $("#"+self.selectedExercise).next().trigger("click");
          }
        }
        else {
          self.currentSet++;
          self.draw(self.exercises[self.selectedExercise]);
        }
      });

      $(".exercise-weight").off('change').on("change", function() {
        var person = self.participants[self.participant];
        if (person) {
          var exerciseId = self.selectedExercise;
          var weight = $(this).val();
          var fail = $('.fail-button').is(".btn-success") ? false : true;
          var dateId = dateToId(self.selectedDate);

          var newExercise = {
            name: exerciseId,
            reps: $("#number-of-refs").val(),
            user: person.name,
            date: self.selectedDate.format(),
            weight: weight,
            fail: fail
          };
          if (!person.exercises[exerciseId])
            person.exercises[exerciseId] = {};

          if (!person.exercises[exerciseId][dateId])
            person.exercises[exerciseId][dateId] = [];

          var day = person.exercises[exerciseId][dateId];
          trainModel.update(dateId, self.currentSet, newExercise);


          if(!person.passes)
            person.passes = {};
          if(!person.passes[self.selectedPass.name])
            person.passes[self.selectedPass.name] = {};

          var add = 0;
          if(!day[self.currentSet])
            add++;

          if(Object.keys(day).length + add == self.exercises[exerciseId].set){
            $('#'+exerciseId).removeClass("active").addClass("btn-success");
            userModel.updatePath(person.name+"/passes/"+
                self.selectedPass.name+
                "/exercises/"+newExercise.name+"/"+dateToId(newExercise.date),true);
          }

          userModel.updatePath(person.name+"/passes/"+self.selectedPass.name+"/lastUpdate",newExercise.date);

          self.drawHistory();
        }
      });
    },
    drawExercise: function(person, div, exercise) {
      var setNr = parseInt(this.currentSet);
      div.find(".user-exercise").append(new EJS({
        url: 'app/train/views/user.ejs'
      }).render({
        currentSet: parseInt(this.currentSet) + 1,
        user: person,
        exercise: exercise
      }));
      var weight = 0;
      var reps = "";
      var fail = "btn-success";
      var thumb = "glyphicon-thumbs-up";

      if (!person[this.selectedPass.name])
        person[this.selectedPass.name] = {};
      if (!person.exercises)
        person.exercises = {};
      var data = person.exercises[exercise.name];
      if (data) {
        var last = null;
        var current = dateToId(this.selectedDate);
        if(data[current]){
          if(data[current][setNr]){
            last =  data[current][setNr];
          }
        }

        if(!last) {
          var keys = Object.keys(data);
          var lastPracticeDay = data[keys[keys.length - 1]];
          if (lastPracticeDay) {
            if (lastPracticeDay[setNr]) {
              last = lastPracticeDay[setNr];
            } else if (setNr !== 0 && lastPracticeDay[setNr-1]) {
              weight = lastPracticeDay[setNr-1].weight;
            }
          }
        }

        if(last) {
          reps = last.reps;
          weight = last.weight;
          fail = last && last.fail ? "btn-danger" : "btn-success";
          thumb = last && last.fail ? "glyphicon-thumbs-down" : "glyphicon-thumbs-up";
        }

      }

      if(reps)
        div.find("#number-of-refs").val(reps);
      div.find('.exercise-weight').val(weight);
      div.find('.fail-button').addClass(fail);
      div.find('.fail-button .glyphicon').addClass(thumb);
    },
    drawHistory: function() {

      var history = this.getExercises(this.selectedExercise);
      if(history){
        var keyArray = Object.keys(history);
        var keys = keyArray.slice(-3);

        var div = "";
        for(var i in keys){
          div += new EJS({
              url: 'app/train/views/history.ejs'
            }).render(history[keys[i]]);
        }

        $(".history").html(div);
      }
    },
    getParticipantPass : function(passName){
      if (this.participants[this.participant])
        if (this.participants[this.participant].passes)
          if (this.participants[this.participant].passes[passName])
              return this.participants[this.participant].passes[passName];
      return null;
    },
    getExercises : function(name){
      if (this.participants[this.participant])
        if (this.participants[this.participant].exercises)
          if (this.participants[this.participant].exercises[name])
            return this.participants[this.participant].exercises[name];
          return null;
    },
    getSet: function(set) {
      var dateId = dateToId(this.selectedDate);
      if (this.participants[this.participant])
        if (this.participants[this.participant].exercises)
          if (this.participants[this.participant].exercises[this.selectedExercise])
            if (this.participants[this.participant].exercises[this.selectedExercise][dateId])
              if (this.participants[this.participant].exercises[this.selectedExercise][dateId][set])
                return this.participants[this.participant].exercises[this.selectedExercise][dateId][set];
      return null;
    }
  };

});
