var Tone = require("tone");
import merge from 'lodash/merge';

import { defaultMap, pitches, intervals } from './constants';

Tone.Transport.bpm.value = 120;
Tone.Transport.loop = true;
Tone.Transport.loopEnd = '2m';

export const transport = Tone.Transport;

const synth = new Tone.PolySynth(16).toMaster();

let sequenceMap = merge({}, defaultMap);
let eventIds = {};

export const playPitch = (pitch) => {
  const mode = $w('#mode').attr('class');
  synth.triggerAttackRelease(pitches[mode][pitch], '8n');
}

export const scheduleVisuals = () => {
  scheduleLoop();
  scheduleHighlights();
}

const scheduleLoop = () => {
  const loopBar = $w('.loop-bar');
  Tone.Transport.scheduleRepeat(function(time) {
    const startLeft = parseFloat(loopBar.css('left'));
    const newLeft = startLeft + .250;
    loopBar.css('left', `+${newLeft}%`);
  },"8n / 25");

  Tone.Transport.schedule(function(time){
    $w('.loop-bar').css('left', '0');
  }, 0);
}

const scheduleHighlights = () => {
  for (let i = 0; i < 16; i++) {
    let col = $w(`.col-${i}`);
    Tone.Transport.schedule(function(time){
      col.addClass('fade');
      col.addClass('highlight');
    }, `${2*i}*16n`);
    Tone.Transport.schedule(function(time){
      col.removeClass('highlight');
    }, `${(2*i)+1}*16n`)
    Tone.Transport.schedule(function(time){
      col.removeClass('fade');
    }, `${((2*i)+2)%32}*16n`);
  }
}

export const updateSequenceMap = (space) => {
  const col = space.attr('col');
  const mode = $w('#mode').attr('class');
  const pitch = pitches[mode][space.attr('pitch')];
  space.hasClass('selected')
    ? sequenceMap[col][pitch] = true
    : delete sequenceMap[col][pitch];
};

export const scheduleNotes = (col) => {
  if (eventIds[col]) { Tone.Transport.clear(eventIds[col]); }

  eventIds[col] = Tone.Transport.schedule(function(time){
    synth.triggerAttackRelease(Object.keys(sequenceMap[col]), '8n');
    }, `${col}*8n`);
};

const clearMap = () => sequenceMap = merge({}, defaultMap);

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

export const updateSequenceModality = (oldMode, newMode) => {
  for (let col = 0; col < 16; col++) {
    const column = sequenceMap[col];
    let adjusted = false;
    for(let i = 0; i < 4; i++) {
      let pitch = intervals[oldMode][i];
      if (column[pitch]) {
        delete column[pitch];
        column[intervals[newMode][i]] = true;
        adjusted = true;
      }
    }
    if (adjusted) scheduleNotes(col);
  }
};
