const config = require('./lessons_config');
const TimeStamp = require('./timestamp');
const TimeFrame = require('./timeframe');
const lodash = require('lodash');

function Periods(config) {
  this.lessons = config
    .map(lesson => ({
      start: new TimeStamp(lesson.start),
      end: new TimeStamp(lesson.end),
    }))
    .map(lesson => new TimeFrame(lesson.start, lesson.end, 'lesson'));
    
  this.pauses = [];
  this.lessons.forEach((lesson, index, lessons) => {
    if (!lessons[index + 1]) return;
    else this.pauses.push(new TimeFrame(lesson.end, lessons[index+1].start, 'pause'));
  });

  this.all = [];
  this.lessons.forEach((lesson, index, lessons) => {
    if (!this.pauses[index]) this.all.push(lesson);
    else this.all.push(lesson, this.pauses[index]);
  });
}

Periods.prototype.getSchoolTimeFrame = function() {
  const firstLesson = lodash.head(this.lessons);
  const lastLesson = this.lessons[this.lessons.length-1];
  return new TimeFrame(firstLesson.start, lastLesson.end);
}

Periods.prototype.isDuringSchool = function(timestamp) {
  return !!this.all.find(timeframe => timeframe.contains(timestamp));
}

Periods.prototype.isDuringLesson = function(timestamp) {
  return !!this.lessons.find(lesson => lesson.contains(timestamp));
}

Periods.prototype.isDuringPause = function(timestamp) {
  return !!this.pauses.find(pause => pause.contains(timestamp));
}

Periods.prototype.getCurrentPeriod = function(timestamp) {
  return this.all.find(timeframe => timeframe.contains(timestamp));
}

Periods.prototype.getNextPeriod = function(timestamp) {
  const index = this.all.findIndex(timeframe => timeframe.contains(timestamp)) + 1;
  return this.all[index] || null;
}

Periods.prototype.whatIsStarting = function(timestamp) {
  // only works when used at extact time of bell ringing
  return this.all.find(timeframe => timeframe.start.toString() == timestamp.toString())
}

module.exports = new Periods(config);
