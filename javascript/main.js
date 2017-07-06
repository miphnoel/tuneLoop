var Tone = require("tone");
import { major, minor } from './pitches';

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
      space.onmousedown = toggleNote;
      space.onmouseenter = toggleNote;
      column.appendChild(space);
    }

    grid.appendChild(column);
  }

  const loopBar = document.createElement('div');
  loopBar.className = "loop-bar";
  loopBar.style.left = "-6.25%";
  grid.appendChild(loopBar);

  const resetLoop = Tone.Transport.schedule(function(time){
    loopBar.style.left = 0;
  }, 0);

  Tone.Transport.scheduleRepeat(function(time) {
    const startLeft = parseFloat(loopBar.style.left);
    const newLeft = (startLeft + .125) % 100;
    loopBar.style.left = `+${newLeft}%`;
  }, "8n / 50");

  const footer = document.getElementById('footer');
  const playButton = document.createElement('button');
  playButton.className = "play";
  playButton.innerHTML = '▶︎';
  playButton.onclick = (e) => togglePlay(e, loopBar);
  footer.appendChild(playButton);

  const modeButton = document.createElement('button');
  modeButton.className = "major";
  modeButton.innerHTML = 'M';
  modeButton.onclick = (toggleMode);
  footer.appendChild(modeButton);
});


Tone.Transport.bpm.value = 180;
Tone.Transport.loop = true;
Tone.Transport.loopEnd = '2m';
window.mode = major;

const seqMap = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
  13: [],
  14: [],
  15: []
};

const eventIds = {};
const synth = new Tone.PolySynth(16).toMaster();

const toggleNote = (e) => {
  if (e.type === 'mouseenter' && !window.mousedown) return;
  const space = e.currentTarget;
  const col = space.col;
  if (space.classList.contains('unselected')) {
    seqMap[col].push(window.mode[space.pitch]);
  } else {
    let idx = seqMap[col].indexOf(window.mode[space.pitch]);
    seqMap[col].splice(idx, 1);
  }
  space.classList.toggle('unselected');
  if (eventIds[col]) {
    Tone.Transport.clear(eventIds[col]);
  }
  eventIds[col] = Tone.Transport.schedule(function(time){
    synth.triggerAttackRelease(seqMap[col], '8n');
  }, `${col}*8n`);
};

const toggleMode = (e) => {
  const button = e.currentTarget;
  if (button.className === 'major') {
    button.className = 'minor';
    button.innerHTML = 'm';
    window.mode = minor;
  } else {
    button.className = 'major';
    button.innerHTML = 'M';
    window.mode = major;
  }
};


const togglePlay = (e, bar) => {
  const button = e.currentTarget;
  if (button.className === 'play') {
    bar.style.left = 0;
    Tone.Transport.start();
    button.className = "pause";
    button.innerHTML = '🁢 🁢';
  } else {
    clearInterval(window.loopId);
    Tone.Transport.stop();
    button.className = "play";
    button.innerHTML = '▶︎';
  }
};



window.seqMap = seqMap;
