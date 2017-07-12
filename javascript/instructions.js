export default function displayInstructions() {
  const frame = $w('<div>');
  frame.addClass('instruction-frame');

  let instructions = $w('<div>');
  instructions.append('<h3>Welcome to tuneLoop!</h3>');
  instructions.append('<p>Click spaces to select/deselect notes,</p><br/>');
  instructions.append('<p>Then click the <span>▶︎</span> button to hear your masterpiece!</p><br/>');
  instructions.append('<p>(Click anywhere to continue)</p>')
  frame.append(instructions);

  $w('body').append(frame);
  const instructionFrame = $w('.instruction-frame');
  instructionFrame.on('click', furtherInstructions(instructionFrame))
}

const furtherInstructions = (instructionFrame) => (e) => {
  e.stopPropagation();

  let pageTwo = $w('<div>');
  pageTwo.append("<p>The <span>M</span> button Modulates minor/major.</p><br/>");
  pageTwo.append("<p>Click <span>D</span> to hear a Demo melody.</p><br/>");
  pageTwo.append("<p>Careful! Clicking <span>C</span> will Clear every note.</p><br/>");
  pageTwo.append('<p>(Click anywhere to continue)</p>')

  instructionFrame.empty();
  instructionFrame.append(pageTwo);

  instructionFrame.off('click');
  instructionFrame.on('click', closeInstructions(instructionFrame));
}

const closeInstructions = (instructionFrame) => (e) => {
  e.stopPropagation();
  instructionFrame.remove();
}
