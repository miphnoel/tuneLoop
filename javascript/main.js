var Tone = require("tone");
import merge from 'lodash/merge';
import { pitches, defaultMap, intervals, demoSpaces } from './constants';

$w(() => {
  const grid = $w('#grid');

  for (let c = 0; c < 16; c++) {
    let column = $w('<ul>');
    column.addClass(`col-${c}`);

    for (let r = 0; r < 15; r++) {
      let space = $w('<li>');
      space.attr('pitch', r.toString());
      space.attr('col', c.toString());
      let classes = [`row-${r}`, `hue-${r % 7}`, 'unselected'];
      if (r % 7 === 0) classes.push('octave');
      if (r % 7 === 3) classes.push('fifth');
      classes.forEach(className => space.addClass(className));

      column.append(space);
    }
    grid.append(column)
  }

  const loopBar = $w('<div>');
  loopBar.addClass("loop-bar");
  loopBar.css('left', "-6.25%");
  grid.append(loopBar);

  const playButton = $w('<button>');
  playButton.addClass("play");
  playButton.html('▶︎');

  const modeButton = $w('<button>');
  modeButton.addClass("major");
  modeButton.html('M');

  const clearButton = $w('<button>');
  clearButton.addClass("clear");
  clearButton.html('C');

  const demoButton = $w('<button>');
  demoButton.addClass("demo");
  demoButton.html('D');

  const footer = $w('footer');

  footer.append(playButton);
  footer.append(modeButton);
  footer.append(clearButton);
  footer.append(demoButton);

  $w('body').on('mousedown', () => window.mousedown = true);
  $w('body').on('mouseup', () => window.mousedown = false);
  grid.on('mouseleave', () => window.mousedown = false);
  grid.on('mousedown', triggerToggle);
  grid.on('mouseover', triggerToggle);
  $w('.play').on('click', togglePlay);
  $w('.major').on('click', toggleMode);
  $w('.clear').on('click', clear);
  $w('.demo').on('click', demo);
});

Tone.Transport.scheduleRepeat(function(time) {
  Tone.Draw.schedule(function() {
    let loopBar = $w('.loop-bar');
    const startLeft = parseFloat(loopBar.css('left'));
    const newLeft = (startLeft + .125) % 100;
    loopBar.css('left', `+${newLeft}%`);
  }, time)
}, "8n / 50");

const resetLoop = Tone.Transport.schedule(function(time){
  $w('.loop-bar').css('left', '0');
}, 0);

Tone.Transport.bpm.value = 120;
Tone.Transport.loop = true;
Tone.Transport.loopEnd = '2m';
window.mode = 'major';

let seqMap = merge({}, defaultMap);

let eventIds = {};
const synth = new Tone.PolySynth(16).toMaster();

const triggerToggle = (e) => {
  if (!window.mousedown && e.type === 'mouseover') return;
  toggleSpace($w(e.target));
};

const toggleSpace = (space) => {
  if (space.hasClass('unselected') &&
      $w('button:first-child').hasClass('play')) {
    synth.triggerAttackRelease(
      pitches[window.mode][space.attr('pitch')], '8n');
  }
  updateSequenceMap(space);
  scheduleNotes(space.attr('col'));
  space.toggleClass('unselected');
  space.toggleClass('selected');
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
  const button = $w(e.currentTarget);
  if (button.hasClass('major')) {
    button.html('m');
    window.mode = 'minor';
  } else {
    button.html('M');
    window.mode = 'major';
  }
  button.toggleClass('minor');
  button.toggleClass('major');
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

const togglePlay = (e) => {
  let button = $w(e.currentTarget);
  button.hasClass('play') ? play(button) : pause(button);
};

const play = (button) => {
  $w('.loop-bar').css('left', '0');
  Tone.Transport.start('+0.3');
  button.nodes[0].className = "pause";
  button.html('🁢 🁢');
};

const pause = (button) => {
  clearInterval(window.loopId);
  $w('.loop-bar').css('left', '-6.25%');
  Tone.Transport.stop();
  button.nodes[0].className = "play";
  button.html('▶︎');
};

const clear = () => {
  resetGrid();
  clearMap();
  clearEvents();
  pause($w('button:first-child'));
  $w('.loop-bar').css('left', "-6.25%");
};

const resetGrid = () => {
  let selected = $w('.selected');
  selected.toggleClass('selected');
  selected.toggleClass('unselected');
};

const clearMap = () => seqMap = merge({}, defaultMap);

const clearEvents = () => {
  Object.values(eventIds).forEach(event =>
    Tone.Transport.clear(event)
  );
  eventIds = {};
};

const demoText = () => {
  const message = $w('<h1>');
  message.addClass("demo-text");
  message.html("A tune just for you...");
  $w('#grid').append(message);
  setTimeout(() => message.html("Let's go!"), 100 * 45);
  setTimeout(() => $w('.demo-text').remove(), 100 * 50);
}

const demo = () => {
  clear();
  demoSpaces().forEach((space, i) => {
    setTimeout(() => toggleSpace(space), 100 * i);
  });
  demoText();
  setTimeout(() => play($w('button:first-child')), 100 * 50);
}

window.defaultMap = defaultMap;
window.tone = Tone;
window.seqMap = seqMap;
