var Tone = require("tone");
import merge from 'lodash/merge';
import { pitches, defaultMap, intervals, demoSpaces } from './constants';

$(() => {
  $('body').on('mousedown', () => window.mousedown = true);
  $('body').on('mouseup', () => window.mousedown = false);
  const grid = $('#grid');
  for (let c = 0; c < 16; c++) {
    let column = $('<ul>');
    column.addClass(`col-${c}`);

    for (let r = 0; r < 15; r++) {
      let space = $('<li>');
      space.attr('pitch', r);
      space.attr('col', c);
      let classes = [`row-${r}`, `hue-${r % 7}`, 'unselected'];
      if (r % 7 === 0) classes.push('octave');
      if (r % 7 === 3) classes.push('fifth');
      space.addClass(classes.join(' '));
      space.on('mousedown', triggerToggle);
      space.on('mouseenter',triggerToggle);
      column.append(space);
    }

    grid.append(column);
  }

  const loopBar = $('<div>');
  loopBar.addClass("loop-bar");
  loopBar.css('left', "-6.25%");
  grid.append(loopBar);

  const footer = $('footer');

  const playButton = $('<button>');
  playButton.addClass("play");
  playButton.html('▶︎');
  playButton.on('click', togglePlay);
  footer.append(playButton);

  const modeButton = $('<button>');
  modeButton.addClass("major");
  modeButton.html('M');
  modeButton.on('click', toggleMode);
  footer.append(modeButton);

  const clearButton = $('<button>');
  clearButton.addClass("clear");
  clearButton.html('C');
  clearButton.on('click', clear);
  footer.append(clearButton);

  const demoButton = $('<button>');
  demoButton.addClass("demo");
  demoButton.html('D');
  demoButton.on('click', demo);
  footer.append(demoButton);

  window.loopBar = loopBar;
  window.playButton = playButton;
  window.demoSpaces = demoSpaces();
});

Tone.Transport.scheduleRepeat(function(time) {
  Tone.Draw.schedule(function() {
    const startLeft = parseFloat(window.loopBar[0].style.left);
    const newLeft = (startLeft + .125) % 100;
    window.loopBar.css('left', `+${newLeft}%`);
  }, time)
}, "8n / 50");

const resetLoop = Tone.Transport.schedule(function(time){
  window.loopBar.css('left', 0);
}, 0);

Tone.Transport.bpm.value = 120;
Tone.Transport.loop = true;
Tone.Transport.loopEnd = '2m';
window.mode = 'major';

let seqMap = merge({}, defaultMap);

let eventIds = {};
const synth = new Tone.PolySynth(16).toMaster();

const triggerToggle = (e) => {
  if (!window.mousedown && e.type === 'mouseenter') return;
  toggleSpace($(e.currentTarget));
};

const toggleSpace = (space) => {
  if (space.hasClass('unselected') &&
      window.playButton.hasClass('play')) {
    synth.triggerAttackRelease(
      pitches[window.mode][space.attr('pitch')], '8n');
  }
  updateSequenceMap(space);
  space.toggleClass('unselected selected');
  scheduleNotes(space.attr('col'));
};

const updateSequenceMap = (space) => {
  const col = space.attr('col');
  const pitch = pitches[window.mode][space.attr('pitch')];
  if (space.hasClass('unselected')) {

    seqMap[col][pitch] = true;
  } else {
    delete seqMap[col][pitch];
  }
};

const scheduleNotes = (col) => {
  if (eventIds[col]) {
    Tone.Transport.clear(eventIds[col]);
  }
  eventIds[col] = Tone.Transport.schedule(function(time){
    synth.triggerAttackRelease(Object.keys(seqMap[col]), '8n');
  }, `${col}*8n`);
};

const toggleMode = (e) => {
  updateSequenceModality();
  const button = $(e.currentTarget);
  if (button.hasClass('major')) {
    button.html('m');
    window.mode = 'minor';
  } else {
    button.html('M');
    window.mode = 'major';
  }
  button.toggleClass('minor major');
};

const updateSequenceModality = () => {
  const newMode = window.mode === 'major' ? 'minor' : 'major';
  for (let col = 0; col < 16; col++) {
    const column = seqMap[col];
    let adjusted = false;
    for(let i = 0; i < 4; i++) {
      let pitch = intervals[window.mode][i];
      if (column[pitch]) {
        delete column[pitch];
        column[intervals[newMode][i]] = true;
        adjusted = true;
      }
    }
    if (adjusted) scheduleNotes(col);
  }
};

const togglePlay = () => {
  window.playButton.hasClass('play') ? play() : pause();
};

const play = () => {
  window.loopBar.css('left', 0);
  Tone.Transport.start('+0.3');
  window.playButton[0].className = "pause";
  window.playButton.html('🁢 🁢');
};

const pause = () => {
  clearInterval(window.loopId);
  window.loopBar.css('left', '-6.25%');
  Tone.Transport.stop();
  window.playButton[0].className = "play";
  window.playButton.html('▶︎');
};

const clear = () => {
  resetGrid();
  clearMap();
  clearEvents();
  pause();
  window.loopBar.css('left', "-6.25%");
};

const resetGrid = () => {
   $('.selected').toggleClass('selected unselected');
};

const clearMap = () => seqMap = merge({}, defaultMap);

const clearEvents = () => {
  Object.values(eventIds).forEach(event =>
    Tone.Transport.clear(event)
  );
  eventIds = {};
};

const demoText = () => {
  const message = $('<h1>');
  message.addClass("demo-text");
  message.html("A tune just for you...");
  $('#grid').append(message);
  setTimeout(() => message.html("Let's go!"), 100 * 45);
  setTimeout(() => $('.demo-text').remove(), 100 * 50);
}

const demo = () => {
  clear();
  window.demoSpaces.forEach((space, i) => {
    setTimeout(() => toggleSpace(space), 100 * i);
  });
  demoText();
  setTimeout(() => play(), 100 * 50);
}

window.defaultMap = defaultMap;
window.tone = Tone;
window.seqMap = seqMap;
