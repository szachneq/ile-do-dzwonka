const $ = window.jQuery = require('jquery');
const $progress = require('./progress');
const TimeStamp = require('./timestamp');
const TimeFrame = require('./timeframe');
const periods = require('./periods');
const lodash = require('lodash');

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

loop();

function commonFunction(timestamp) {
  $('#hour').text(`Godzina ${timestamp.toString()}`);
}

function lesson(timestamp) {
  const currentLesson = periods.getCurrentPeriod(timestamp);

  const secondsElapsed = timestamp - currentLesson.start;
  const minutesElapsed = secondsElapsed / 60;
  const minutesLeft = 45 - minutesElapsed;

  let pluralModifier = '';
  if (minutesLeft > 1 && minutesLeft < 5) pluralModifier = 'y';
  if (minutesLeft == 1) pluralModifier = 'a';
  $progress.circleProgress('value', minutesElapsed/45);

  $progress.find('strong').text(`${minutesLeft} minut${pluralModifier}`);

  const next = periods.getNextPeriod(timestamp);
  $('#period').text(`Następna przerwa jest ${next.getDurationInMinutes()} minutowa`);
}

function pause(timestamp) {
  $progress.stopAlarm();
  const currentPause = periods.getCurrentPeriod(timestamp);
  const secondsElapsed = timestamp - currentPause.start;
  const minutesElapsed = secondsElapsed / 60;
  const minutesLeft = currentPause.getDurationInMinutes() - minutesElapsed;

  let pluralModifier = '';
  if (minutesLeft > 1 && minutesLeft < 5) pluralModifier = 'y';
  if (minutesLeft == 1) pluralModifier = 'a';
  
  $progress.circleProgress('value', minutesElapsed/currentPause.getDurationInMinutes());

  $progress.find('strong').text(`${minutesLeft} minut${pluralModifier}`);

  const next = periods.getNextPeriod(timestamp);
  $('#period').html('Szczęśliwi czasu nie liczą &#128521;');
}

function inBetween(timestamp) {
  $progress.startAlarm();
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