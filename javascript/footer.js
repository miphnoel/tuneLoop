function createFooter() {
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

  return footer;
}

export default createFooter;
