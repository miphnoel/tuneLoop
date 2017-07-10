var Tone = require("tone");
import merge from 'lodash/merge';
import { pitches, defaultMap, intervals, demoSpaces } from './constants';

document.addEventListener("DOMContentLoaded", () => {
  document.body.onmousedown = () => window.mousedown = true;
  document.body.onmouseup = () => window.mousedown = false;
  const grid = document.getElementById('grid');
  for (let c = 0; c < 16; c++) {
    let column = document.createElement('ul');
    column.className = `col-${c}`;

    for (let r = 0; r < 15; r++) {
      let space = document.createElement('li');
      space['pitch'] = r;
      space['col'] = c;
      let classes = [`row-${r}`, `hue-${r % 7}`, 'unselected'];
      if (r % 7 === 0) classes.push('octave');
      if (r % 7 === 3) classes.push('fifth');
      classes.forEach(className => space.classList.add(className));
      space.onmousedown = triggerToggle;
      space.onmouseenter = triggerToggle;
      column.appendChild(space);
    }

    grid.appendChild(column);
  }

  const loopBar = document.createElement('div');
  loopBar.className = "loop-bar";
  loopBar.style.left = "-6.25%";
  grid.appendChild(loopBar);

  const footer = document.getElementById('footer');

  const playButton = document.createElement('button');
  playButton.className = "play";
  playButton.innerHTML = '▶︎';
  playButton.onclick = togglePlay;
  footer.appendChild(playButton);

  const modeButton = document.createElement('button');
  modeButton.className = "major";
  modeButton.innerHTML = 'M';
  modeButton.onclick = toggleMode;
  footer.appendChild(modeButton);

  const clearButton = document.createElement('button');
  clearButton.className = "clear";
  clearButton.innerHTML = 'C';
  clearButton.onclick = clear;
  footer.appendChild(clearButton);

  const demoButton = document.createElement('button');
  demoButton.className = "demo";
  demoButton.innerHTML = 'D';
  demoButton.onclick = demo;
  footer.appendChild(demoButton);

  window.loopBar = loopBar;
  window.playButton = playButton;
  window.demoSpaces = demoSpaces();
});

Tone.Transport.scheduleRepeat(function(time) {
  Tone.Draw.schedule(function() {
    const startLeft = parseFloat(window.loopBar.style.left);
    const newLeft = (startLeft + .125) % 100;
    window.loopBar.style.left = `+${newLeft}%`;
  }, time)
}, "8n / 50");

const resetLoop = Tone.Transport.schedule(function(time){
  window.loopBar.style.left = 0;
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
  toggleSpace(e.currentTarget);
};

const toggleSpace = (space) => {
  if (space.classList.contains('unselected') &&
      window.playButton.className === 'play') {
    synth.triggerAttackRelease(pitches[window.mode][space.pitch], '8n');
  }
  updateSequenceMap(space);
  space.classList.toggle('unselected');
  space.classList.toggle('selected');
  scheduleNotes(space.col);
};

const updateSequenceMap = (space) => {
  const col = space.col;
  const pitch = pitches[window.mode][space.pitch];
  if (space.classList.contains('unselected')) {
    seqMap[col][[pitch]] = true;
  } else {
    delete seqMap[col][[pitch]];
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
  const button = e.currentTarget;
  if (button.className === 'major') {
    button.className = 'minor';
    button.innerHTML = 'm';
    window.mode = 'minor';
  } else {
    button.className = 'major';
    button.innerHTML = 'M';
    window.mode = 'major';
  }
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
  if (window.playButton.className === 'play') play();
  else pause();
};

const play = () => {
  window.loopBar.style.left = 0;
  Tone.Transport.start('+0.1');
  window.playButton.className = "pause";
  window.playButton.innerHTML = '🁢 🁢';
};

const pause = () => {
  clearInterval(window.loopId);
  Tone.Transport.stop();
  window.playButton.className = "play";
  window.playButton.innerHTML = '▶︎';
};

const clear = () => {
  resetGrid();
  clearMap();
  clearEvents();
  pause();
  window.loopBar.style.left = "-6.25%";
};

const resetGrid = () => {
  let selected = document.querySelectorAll('.selected');
  selected.forEach(space => {
    space.classList.toggle('selected');
    space.classList.toggle('unselected');
  });
};

const clearMap = () => seqMap = merge({}, defaultMap);

const clearEvents = () => {
  Object.values(eventIds).forEach(event =>
    Tone.Transport.clear(event)
  );
  eventIds = {};
};

const demoText = () => {
  const message = document.createElement('h1');
  message.className = "demo-text";
  message.textContent = "A tune just for you...";
  $('#grid').append(message);
  setTimeout(() => message.textContent = "Let's go!", 100 * 45);
  setTimeout(() => $('.demo-text').remove(), 100 * 50);
}

const demo = () => {
  clear();
  window.demoSpaces.forEach((space, i) => {
    setTimeout(() => toggleSpace(space[0]), 100 * i);
  });
  demoText();
  setTimeout(() => play(), 100 * 50);
}

window.defaultMap = defaultMap;
window.tone = Tone;
