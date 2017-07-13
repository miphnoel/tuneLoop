# tuneLoop

[tuneLoop Live][pages]

[pages]:https://miphnoel.github.io/tuneLoop

tuneLoop is an interactive melody sequencer built with JavaScript, CSS, and [wizzDOM](https://www.github.com/miphnoel/wizzDOM), a custom DOM manipulation library. Every element on the page is constructed and manipulated entirely through wizzDOM.

```HTML
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="https://use.fontawesome.com/656b8686eb.js"></script>
    <script type="text/javascript" src="./wizzDOM/bundle.js"></script>
    <script type="text/javascript" src="bundle.js"></script>
    <title>tuneLoop</title>
  </head>
  <body></body>
</html>
```
(Satisfyingly sparse HTML)

## UI/UX

![Scale Loop](/images/scale_loop.gif)

tuneLoop is built with the user in mind. On load, six lines of instructions are all that's necessary to teach a budding composer how to take advantage of tuneLoop's core functionality, simply rendered as a responsive grid and four buttons.

The grid represents a collection of possible notes, each selectable through clicking, or clicking and dragging. Colors are consistent for pitches across two octaves, and the roots and fifths are distinguished for convenience.

![Rainbow Drag](/images/rainbow_drag.gif)

The buttons allow a user to play or pause the loop, dynamically toggle the modality, trigger a demo tune, or wipe the canvas clean by deselecting all currently selected notes.

(Demo tune's grand cascading entrance)

![Demo Tune](/images/demo_loop.gif)

## Creating a Melody

When a user interacts with a space on the grid, they are actually triggering several actions.

```JavaScript
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
```

1. If the loop is currently paused and a space is selected, tuneLoop plays the pitch associated with the space. This gives the user immediate feedback without the need to play the whole loop, and also allows for selecting notes during the loop without triggering notes at the wrong time.

2. The space becomes `selected` or `unselected`, displaying different styling by default, when hovered, and when activated during the loop. Later functionality takes advantage of these classes for easier DOM traversal.

3. The `sequenceMap` is updated, adding or removing the `pitch` associated with the space to/from the collection of selected pitches mapped to the space's column.

4. tuneLoop harnesses the power of Tone.js to prepare to play the newest change to the melody. First, it clears any currently scheduled audio event associated with the column. Then, it collects the selected pitches from the `sequenceMap`, and creates an event that will play the pitches through a `PolySynth` (with up to 16 voices) at the proper `time`. In order to create metronomic fidelity, this `time` corresponds to `AudioContext` time rather than `setTimeout` or `setInterval` functionality, which would be delayed by higher-priority processes. Here, the `time` is given in relative musical notation (`8n` for 'eighth-note'), to allow for future flexible tempo functionality.

```JavaScript
export const updateSequenceMap = (space) => {
  const col = space.attr('col');
  const pitch = pitches[window.mode][space.attr('pitch')];
  if (space.hasClass('selected')) { sequenceMap[col][pitch] = true; }
  else { delete sequenceMap[col][pitch]; }
};

export const scheduleNotes = (col) => {
  if (eventIds[col]) { Tone.Transport.clear(eventIds[col]); }

  eventIds[col] = Tone.Transport.schedule(function(time){
    synth.triggerAttackRelease(Object.keys(sequenceMap[col]), '8n');
    }, `${col}*8n`);
};
```

### Moving Forward

Features planned for future implementation include:

+ Tempo control
+ Choice of instrument
+ More modes
+ Percussion
+ Choice of Key
+ Mobile optimization
+ Harmony generation
