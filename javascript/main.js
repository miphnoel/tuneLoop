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
  const body = $w('body');
  body.append("<header><img src='./images/logo.png' /></header>");
  const grid = createGrid();
  createFooter();
  createLoopBar();
  scheduleVisuals();

  body.on('mousedown', () => window.mousedown = true);
  body.on('mouseup', () => window.mousedown = false);
  document.onkeypress = handleKeyPress;
  grid.on('mouseleave', () => window.mousedown = false);
  grid.on('mousedown', triggerToggle);
  grid.on('mouseover', triggerToggle);

  $w('.play').on('click', togglePlay);
  $w('.major').on('click', toggleMode);
  $w('.clear').on('click', clear);
  $w('.demo').on('click', demo);

  displayInstructions();
});

const handleKeyPress = (e) => {
  e.preventDefault();
  switch (e.keyCode) {
    case 32:
    case 112:
      togglePlay();
      break;
    case 109:
      toggleMode();
      break;
    case 100:
      demo();
      break;
    case 99:
      clear();
      break;
    default:
      return;
  }
}

const triggerToggle = (e) => {
  if (!window.mousedown && e.type === 'mouseover') return;
  toggleSpace($w(e.target));
};

const toggleSpace = (space) => {
  if (space.hasClass('unselected') &&
      $w('#play').hasClass('play')) {
    playPitch(space.attr('pitch'));
  }
  space.toggleClass('unselected');
  space.toggleClass('selected');
  updateSequenceMap(space);
  scheduleNotes(space.attr('col'));
};

const toggleMode = () => {
  const button = $w('#mode');
  const oldMode = button.attr('class');

  if (oldMode === 'major') {
    button.attr('class', 'minor');
    button.html('m');
  } else {
    button.attr('class', 'major');
    button.html('M');
  }
  
  const newMode = button.attr('class');
  updateSequenceModality(oldMode, newMode);
};

const clear = () => {
  resetGrid();
  clearSequence();
  pause($w('#play'));
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
  let demoText = $w('.demo-text');
  setTimeout(() => demoText.html("Let's go!"), 100 * 45);
  setTimeout(() => demoText.remove(), 100 * 50);
}
