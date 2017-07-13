import { transport } from './sequence';

export const togglePlay = () => {
  let button = $w('#play');
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
  $w('.highlight').toggleClass('highlight');
  transport.stop();
  button.nodes[0].className = "play";
  button.html('▶︎');
};
