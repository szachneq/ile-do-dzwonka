const $ = window.jQuery = require('jquery');
require('jquery-circle-progress');
require('./jquery_easing');

$('#circle').circleProgress({
  value: 0.0,
  size: 500,
  startAngle: 1.5 * Math.PI,
  reverse: false,
  thickness: 'auto',
  lineCap: 'round',
  fill: {
    color: '#00bc8c',
  },
  emptyFill: '#222222',
  animation: {
    duration: 1200,
    easing: 'easeOutBounce',
  },
  animationStartValue: 0,
  insertMode: 'prepend',
})

const $progress = $('#circle');

$progress.isToggled = false;
$progress.alarmInterval = null;

$progress.startAlarm = function() {
  $progress.circleProgress({animation: {duration: 0}});
  $progress.alarmInterval = setInterval($progress.toggle, 500);
}

$progress.stopAlarm = function() {
  $progress.circleProgress({animation: {duration: 1200}});
  clearInterval($progress.alarmInterval);
}

$progress.toggle = function() {
  if(this.isToggled) $progress.circleProgress('value', 1);
  else $progress.circleProgress('value', 0);
  this.isToggled = !this.isToggled;
}

module.exports = $progress;
