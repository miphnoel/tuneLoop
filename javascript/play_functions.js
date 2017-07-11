import { transport } from './sequence';

export const togglePlay = (e) => {
  let button = $w(e.currentTarget);
  button.hasClass('play') ? play(button) : pause(button);
};

export const play = (button) => {
  $w('.loop-bar').css('left', '0');
  transport.start('+0.3');
  button.nodes[0].className = "pause";
  button.html('🁢 🁢');
};

export const pause = (button) => {
  $w('.loop-bar').css('left', '-6.25%');
  $w('.playing').toggleClass('playing');
  transport.stop();
  button.nodes[0].className = "play";
  button.html('▶︎');
};
