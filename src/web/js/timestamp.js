function TimeStamp(timeStampString) {
	if (!(this instanceof TimeStamp)) {
		return new TimeStamp(timeStampString);
	}

  if (validTimestampString(timeStampString)) {
    const [ hours, minutes ] = timeStampString.split(':');
    this.hours = parseInt(hours);
    this.minutes = parseInt(minutes);
  } else {
    const currentDate = new Date();
    this.hours = parseInt(currentDate.getHours());
    this.minutes = parseInt(currentDate.getMinutes());
  }
}

function validTimestampString(string) {
  const regexp = /\d{1,2}[:]\d{1,2}/;
  if (typeof string !== 'string') return false;
  if (!string.match(regexp)) return false;
  return true;
}

TimeStamp.prototype.valueOf = function() {
	let seconds = 0;
	seconds += this.minutes * 60;
	seconds += this.hours * 60 * 60;
	return seconds;
};

TimeStamp.prototype.toString = function() {
	let minutes = this.minutes;
	if (minutes < 10) minutes = '0' + minutes;
	return this.hours + ':' + minutes;
}

module.exports = TimeStamp;
