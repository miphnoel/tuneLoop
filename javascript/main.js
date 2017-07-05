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

  const loopId = setInterval(function() {
    const startLeft = parseFloat(loopBar.style.left);
    const newLeft = (startLeft + .25) % 100;
    loopBar.style.left = `+${newLeft}%`;
  }, 12);
});

const toggleSelected = (e) => {
  e.currentTarget.classList.toggle('unselected');
};
