import { pitches, demoSpaces } from './constants';
import displayInstructions from './instructions';
import { createGrid, resetGrid } from './grid';
import createFooter from './footer';
import createLoopBar from './loop_bar';
import { togglePlay, play, pause } from './play_functions';
import { playPitch,
         scheduleVisuals,
         updateSequenceMap,
         scheduleNotes,
         updateSequenceModality,
         clearSequence
       } from './sequence';

$w(() => {
  const grid = createGrid();
  const footer = createFooter();
  const loopBar = createLoopBar();

  grid.append(loopBar);
  scheduleVisuals();

  $w('body').on('mousedown', () => window.mousedown = true);
  $w('body').on('mouseup', () => window.mousedown = false);

  grid.on('mouseleave', () => window.mousedown = false);
  grid.on('mousedown', triggerToggle);
  grid.on('mouseover', triggerToggle);

  $w('.play').on('click', togglePlay);
  $w('.major').on('click', toggleMode);
  $w('.clear').on('click', clear);
  $w('.demo').on('click', demo);

  displayInstructions();
});

window.mode = 'major';

const triggerToggle = (e) => {
  if (!window.mousedown && e.type === 'mouseover') return;
  toggleSpace($w(e.target));
};

const toggleSpace = (space) => {
  if (space.hasClass('unselected') &&
      $w('button:first-child').hasClass('play')) {
    playPitch(space.attr('pitch'));
  }
  updateSequenceMap(space);
  scheduleNotes(space.attr('col'));
  space.toggleClass('unselected');
  space.toggleClass('selected');
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

const clear = () => {
  resetGrid();
  clearSequence();
  pause($w('button:first-child'));
};

const demo = () => {
  clear();
  demoSpaces().forEach((space, i) => {
    setTimeout(() => toggleSpace(space), 100 * i);
  });
  displayDemoText();
  setTimeout(() => play($w('button:first-child')), 100 * 50);
}

const displayDemoText = () => {
  const message = $w('<h1>');
  message.addClass("demo-text");
  message.html("A tune just for you...");
  $w('#grid').append(message);
  setTimeout(() => message.html("Let's go!"), 100 * 45);
  setTimeout(() => $w('.demo-text').remove(), 100 * 50);
}
