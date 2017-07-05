document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById('grid');
  for (let c = 0; c < 16; c++) {
    let column = document.createElement('ul');
    column.className = `col-${c}`;

    for (let r = 0; r < 16; r++) {
      let space = document.createElement('li');
      let classes = [`row-${r}`, `hue-${r % 7}`, 'unselected'];
      classes.forEach(className => space.classList.add(className));
      space.onclick = (e) => toggleSelected(e);
      column.appendChild(space);
    }

    grid.appendChild(column);
  }

  const loopBar = document.createElement('div');
  loopBar.className = "loop-bar";
  loopBar.style.left = 0;
  grid.appendChild(loopBar);

  var loop;

  const footer = document.getElementById('footer');
  const button = document.createElement('button');
  button.className = "play";
  button.innerHTML = '▶︎';
  button.onclick = (e) => togglePlay(e, loopBar);
  footer.appendChild(button);
});

const toggleSelected = (e) => {
  e.currentTarget.classList.toggle('unselected');
};

const togglePlay = (e, bar) => {
  const button = e.currentTarget;
  if (button.className === 'play') {
    loop = setInterval(function() {
      const startLeft = parseFloat(bar.style.left);
      const newLeft = (startLeft + .25) % 100;
      bar.style.left = `+${newLeft}%`;
    }, 12);
    button.className = "pause";
    button.innerHTML = '🁢 🁢';
  } else {
    clearInterval(loop);
    button.className = "play";
    button.innerHTML = '▶︎';
  }
};
