function createFooter() {
  const playButton = $w('<button>');
  playButton.addClass("play");
  playButton.html('▶︎');

  const modeButton = $w('<button>');
  modeButton.addClass("major");
  modeButton.html('M');

  const demoButton = $w('<button>');
  demoButton.addClass("demo");
  demoButton.html('D');

  const clearButton = $w('<button>');
  clearButton.addClass("clear");
  clearButton.html('C');

  const footer = $w('footer');

  footer.append(playButton);
  footer.append(modeButton);
  footer.append(demoButton);
  footer.append(clearButton);

  return footer;
}

export default createFooter;
