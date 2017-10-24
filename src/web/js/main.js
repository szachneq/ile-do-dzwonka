const $ = window.jQuery = require('jquery');
const $progress = require('./progress');
const TimeStamp = require('./timestamp');
const TimeFrame = require('./timeframe');
const periods = require('./periods');
const lodash = require('lodash');

function init() {
  setTimeout(() => $('#backimg').fadeOut(), 1000);
  serviceWorkerRegistration();

}

init()

function loop() {
  const timestamp = new TimeStamp();
  const schoolTime = periods.getSchoolTimeFrame(timestamp);
  commonFunction(timestamp);

  if (timestamp < schoolTime.start) beforeSchool(timestamp);
  else if (timestamp > schoolTime.end) afterSchool(timestamp);
  else if (periods.isDuringLesson(timestamp)) lesson(timestamp);
  else if (periods.isDuringPause(timestamp)) pause(timestamp);
  else inBetween(timestamp);
}

setInterval(loop, 1000);

function commonFunction(timestamp) {
  $('#hour').text(`Godzina ${timestamp.toString()}`);
}

function lesson(timestamp) {
  schoolPeriod(timestamp);
  const next = periods.getNextPeriod(timestamp);
  $('#period').text(`Następna przerwa jest ${next.getDurationInMinutes()} minutowa`);
}

function plural(noun, number) {
  if (number > 4 && number < 22) return noun;
  if (number % 10 > 1 && number % 10 < 5) return noun + 'y';
  if (number == 1) return noun + 'a';
  return noun;
}

function pause(timestamp) {
  schoolPeriod(timestamp);

  const next = periods.getNextPeriod(timestamp);
  $('#period').html('Szczęśliwi czasu nie liczą &#128521;');
}

function schoolPeriod(timestamp) {
  $progress.stopAlarm();

  const currentPeriod = periods.getCurrentPeriod(timestamp);
  const secondsElapsed = timestamp - currentPeriod.start;
  const minutesElapsed = secondsElapsed / 60;
  const duration = currentPeriod.getDurationInMinutes();
  const minutesLeft = duration - minutesElapsed;

  $progress.circleProgress('value', minutesElapsed/duration);

  $progress.find('strong').text(`${minutesLeft} ${plural('minut', minutesLeft)}`);

  let pluralModifier = '';
  if (minutesLeft > 1 && minutesLeft < 5) pluralModifier = 'y';
  if (minutesLeft == 1) pluralModifier = 'a';

  $progress.circleProgress('value', minutesElapsed/currentPause.getDurationInMinutes());

  $progress.find('strong').text(`${minutesLeft} ${plural('minut', minutesLeft)}`);

  const next = periods.getNextPeriod(timestamp);
  $('#period').html('Szczęśliwi czasu nie liczą &#128521;');

}

function inBetween(timestamp) {
  if (!$progress.alarmInterval) $progress.startAlarm();
  $progress.find('strong').html('&#128276;');
  const nextPeriod = periods.whatIsStarting(timestamp);
  if (!!nextPeriod && nextPeriod.type == 'lesson') $('#period').text('Zaczęła się lekcja');
  if (!!nextPeriod && nextPeriod.type == 'pause') $('#period').text(`Zaczęła się przerwa ${nextPeriod.getDurationInMinutes()} minutowa`);
  if (!nextPeriod) $('#period').text('Koniec zajęć na dziś');
}

function beforeSchool(timestamp) {
  $progress.stopAlarm();
  $progress.find('strong').html('&#128564;');
  $progress.circleProgress('value', 1);
  $('#period').text('Wyśpij się przed szkołą');
}

function afterSchool(timestamp) {
  $progress.stopAlarm();
  $progress.find('strong').html('&#128526;');
  $progress.circleProgress('value', 1);
  $('#period').text('Czas odpocząć');
}


function serviceWorkerRegistration() {

if (!('serviceWorker' in navigator)){
console.log('not supported');
return;}

navigator.serviceWorker.register(
    '../service-worker.js',

).then(function(registration) {
    console.log('SW registered! Scope is:',
    registration.scope);
});
}
