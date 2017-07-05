document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById('grid');
  for (let c = 0; c < 8; c++) {
    let column = document.createElement('ul');
    column.className = `col-${c}`;

    for (let r = 0; r < 8; r++) {
      let space = document.createElement('li');
      space.className = `row-${r}`;
      space.onclick = (e) => toggleSelected(e);
      column.appendChild(space);
    }

    grid.appendChild(column);
  }
});

const toggleSelected = (e) => {
  e.currentTarget.classList.toggle('selected');
};
