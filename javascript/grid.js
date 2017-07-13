export const createGrid = () => {
  const grid = $w('<div>');
  grid.attr('id', 'grid');

  for (let c = 0; c < 16; c++) {
    let column = $w('<ul>');
    column.addClass(`col-${c}`);

    for (let r = 0; r < 15; r++) {
      let space = $w('<li>');
      space.attr('pitch', r.toString());
      space.attr('col', c.toString());
      let classes = [`row-${r}`, `hue-${r % 7}`, 'unselected'];
      if (r % 7 === 0) classes.push('root');
      if (r % 7 === 3) classes.push('fifth');
      classes.forEach(className => space.addClass(className));

      column.append(space);
    }
    grid.append(column)
  }
  $w('body').append(grid);
  return $w('#grid');
}

export const resetGrid = () => {
  let selected = $w('.selected');
  selected.toggleClass('selected');
  selected.toggleClass('unselected');
};
