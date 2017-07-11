var Tone = require("tone");
import merge from 'lodash/merge';

import { defaultMap, pitches, intervals } from './constants';

Tone.Transport.bpm.value = 120;
Tone.Transport.loop = true;
Tone.Transport.loopEnd = '2m';

export const transport = Tone.Transport;

const synth = new Tone.PolySynth(16).toMaster();

let seqMap = merge({}, defaultMap);
let eventIds = {};

export const playPitch = (pitch) => {
  synth.triggerAttackRelease(pitches[window.mode][pitch], '8n');
}

export const scheduleLoop = () => {
  const loopBar = $w('.loop-bar');
  Tone.Transport.scheduleRepeat(function(time) {
    Tone.Draw.schedule(function() {
      const startLeft = parseFloat(loopBar.css('left'));
      const newLeft = startLeft + .250;
      loopBar.css('left', `+${newLeft}%`);
    }, time)
  }, "8n / 25");

  Tone.Transport.schedule(function(time){
    $w('.loop-bar').css('left', '0');
  }, 0);
}

export const updateSequenceMap = (space) => {
  const col = space.attr('col');
  const pitch = pitches[window.mode][space.attr('pitch')];
  if (space.hasClass('unselected')) {
    seqMap[col][pitch] = true;
  } else {
    delete seqMap[col][pitch];
  }
};

export const scheduleNotes = (col) => {
  if (eventIds[col]) {
    Tone.Transport.clear(eventIds[col]);
  }
  eventIds[col] = Tone.Transport.schedule(function(time){
    synth.triggerAttackRelease(Object.keys(seqMap[col]), '8n');
  }, `${col}*8n`);
};

const clearMap = () => seqMap = merge({}, defaultMap);

const clearEvents = () => {
  Object.values(eventIds).forEach(event =>
    Tone.Transport.clear(event)
  );
  eventIds = {};
};

export const clearSequence = () => {
  clearMap();
  clearEvents();
}

export const updateSequenceModality = () => {
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
