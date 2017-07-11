const createLoopBar = () => {
  const loopBar = $w('<div>');
  loopBar.addClass("loop-bar");
  loopBar.css('left', "-6.25%");

  return loopBar;
}

export default createLoopBar;
