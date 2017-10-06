const TimeStamp = require('./timestamp');

function TimeFrame(startTimeStamp, endTimeStamp, type) {
  if (!(this instanceof TimeFrame)) {
		return new TimeFrame(startTimeStamp, endTimeStamp);
	}

  if (!(startTimeStamp instanceof TimeStamp)) throw 'Parameter must be instance of TimeStamp';
  if (!(startTimeStamp instanceof TimeStamp)) throw 'Parameter must be instance of TimeStamp';

  this.start = startTimeStamp;
  this.end = endTimeStamp;
  this.type = type;
}

TimeFrame.prototype.getDurationInMinutes = function() {
  let differenceInSeconds = 0;
  if (this.end > this.start) differenceInSeconds = this.end - this.start;
  else  differenceInSeconds = this.start - this.end;
  return differenceInSeconds / 60;
};

TimeFrame.prototype.contains = function(timestamp) {
  return timestamp > this.start && timestamp < this.end;
};

module.exports = TimeFrame;
