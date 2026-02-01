const gameBoard = document.getElementById("gameBoard");
let isHighlighting = false;

for (let i = 0; i < 6; i++) {
  const boxRow = document.createElement("div");
  boxRow.className = "boxRow";
  for (let j = 0; j < 6; j++) {
    const box = document.createElement("div");
    box.className = "box";
    box.setAttribute('data-row', i);
    box.setAttribute('data-col', j);

    if (i % 2 === 0) {
      box.style.backgroundColor = j % 2 === 0 ? "black" : "aqua";
    } else {
      box.style.backgroundColor = j % 2 === 0 ? "aqua" : "black";
    }

    if (i === 0 && j === 4) box.style.background = "radial-gradient(lightBlue, black 20%)";
    if (i === 2 && j === 1) box.style.background = "radial-gradient(red, aqua 20%)";
    if (i === 2 && j === 2) box.style.background = "radial-gradient(orange, black 20%)";
    if (i === 4 && j === 0) box.style.background = "radial-gradient(lightGreen, black 20%)";
    if (i === 5 && j === 4) box.style.background = "radial-gradient(purple, aqua 20%)";

    boxRow.append(box);

    if (i === 0 && j === 3) {
      const knight = document.createElement("img");
      knight.src = "knight.svg";
      knight.alt = "Knight Piece";
      knight.className = "knight";
      knight.draggable = true;
      box.append(knight);
    }
  }
  gameBoard.append(boxRow);
}

const knight = document.querySelector('.knight');

function getKnightPosition() {
  const box = knight.parentElement;
  return {
    row: parseInt(box.dataset.row),
    col: parseInt(box.dataset.col)
  };
}

function getLegalMoves(row, col) {
  const deltas = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  return deltas
    .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
    .filter(m => m.row >= 0 && m.row < 6 && m.col >= 0 && m.col < 6);
}

function highlightLegalMoves() {
  document.querySelectorAll('.legal').forEach(el => el.classList.remove('legal'));
  const { row, col } = getKnightPosition();
  getLegalMoves(row, col).forEach(({ row: r, col: c }) => {
    const box = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    box?.classList.add('legal');
  });
}

function clearHighlights() {
  document.querySelectorAll('.legal').forEach(el => el.classList.remove('legal'));
}

let isDragging = false;
let startX, startY;
let originalBox;

knight.addEventListener('pointerdown', e => {
  e.preventDefault();
  isDragging = true;
  originalBox = knight.parentElement;

  const rect = knight.getBoundingClientRect();

  knight.style.position = 'fixed';
  knight.style.left = rect.left + 'px';
  knight.style.top = rect.top + 'px';

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  startX = e.clientX - centerX;
  startY = e.clientY - centerY;

  knight.style.zIndex = '1000';
  knight.style.transform = 'scale(1.15)';
  knight.style.pointerEvents = 'none';
  knight.setPointerCapture(e.pointerId);

  highlightLegalMoves();
});

document.addEventListener('pointermove', e => {
  if (!isDragging) return;
  e.preventDefault();

  const x = e.clientX - startX;
  const y = e.clientY - startY;
  knight.style.left = x + 'px';
  knight.style.top = y + 'px';
});

document.addEventListener('pointerup', e => {
  if (!isDragging) return;
  isDragging = false;

  knight.style.position = '';
  knight.style.left = '';
  knight.style.top = '';
  knight.style.transform = '';
  knight.style.zIndex = '';
  knight.style.pointerEvents = '';

  const target = document.elementFromPoint(e.clientX, e.clientY);
  let droppedOnBox = target?.closest('.box');

  if (droppedOnBox) {
    const tRow = parseInt(droppedOnBox.dataset.row);
    const tCol = parseInt(droppedOnBox.dataset.col);
    const legal = getLegalMoves(...Object.values(getKnightPosition()))
      .some(m => m.row === tRow && m.col === tCol);

    if (legal) {
      droppedOnBox.appendChild(knight);
    } else {
      originalBox.appendChild(knight);
    }
  } else {
    originalBox.appendChild(knight);
  }

  clearHighlights();
});

knight.addEventListener('click', e => {
  if (isDragging) return;
  if (document.querySelector('.legal')) {
    clearHighlights();
  } else {
    highlightLegalMoves();
  }
});

document.querySelectorAll('.box').forEach(box => {
  box.addEventListener('click', e => {
    if (!document.querySelector('.legal')) return;
    const { row, col } = getKnightPosition();
    const tRow = parseInt(box.dataset.row);
    const tCol = parseInt(box.dataset.col);
    if (getLegalMoves(row, col).some(m => m.row === tRow && m.col === tCol)) {
      box.appendChild(knight);
    }
    clearHighlights();
  });
});