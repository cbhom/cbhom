let gameBoard = document.getElementById("gameBoard")
let isHighlighting = false;

//loop that creates the 6x6 board of the game
for (let i=0; i<6; i++) {
  const boxRow = document.createElement("div");
  boxRow.className = "boxRow";
  for (let j=0; j<6; j++) {
    const box = document.createElement("div");
    box.className = "box";
    box.setAttribute('data-row', i);
    box.setAttribute('data-col', j);
    
    //algorithm to color light and dark boxes
    if(i%2===0){
      if(j%2===0){
        box.style.backgroundColor = "black";
      }
      else {
        box.style.backgroundColor = "aqua";
      }
    }
    else{
      if(j%2===0){
        box.style.backgroundColor = "aqua";
      }
      else {
        box.style.backgroundColor = "black";
      }
    }
    
    if(i===0 && j===4) {
      box.style.background = "radial-gradient(lightBlue,black 20%)";
    }
    if(i===2 && j===1) {
      box.style.background = "radial-gradient(red,aqua 20%)";
    }
    if(i===2 && j===2) {
      box.style.background = "radial-gradient(orange,black 20%)";
    }
    if(i===4 && j===0) {
      box.style.background = "radial-gradient(lightGreen,black 20%)";
    }
    if(i===5 && j===4) {
      box.style.background = "radial-gradient(purple,aqua 20%)";
    }


    boxRow.append(box);

    //knight
    if (i===0 && j===3) {
      const knight = document.createElement("img")
      knight.src = "knight.svg";
      knight.alt = "Knight Piece";
      knight.className = "knight";
      knight.draggable = true;
      box.append(knight)
    }

  }
  gameBoard.append(boxRow);
}

function getKnightPosition() {
  const knight = document.querySelector('.knight');
  const box = knight.parentElement;
  return {
    row: parseInt(box.getAttribute('data-row')),
    col: parseInt(box.getAttribute('data-col'))
  };
}

function getLegalMoves(row, col) {
  const moves = [];
  const possibleMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  for (let [dr, dc] of possibleMoves) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < 6 && nc >= 0 && nc < 6) {
      moves.push({ row: nr, col: nc });
    }
  }
  return moves;
}

function highlightLegalMoves() {
  const pos = getKnightPosition();
  const moves = getLegalMoves(pos.row, pos.col);
  moves.forEach(move => {
    const box = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
    box.classList.add('legal');
  });
}

function clearHighlights() {
  document.querySelectorAll('.legal').forEach(box => box.classList.remove('legal'));
}

//movements of the knight
const knight = document.querySelector(".knight");
knight.addEventListener("dragstart", dragStart);

let beingDragged;
document.querySelectorAll(".box").forEach(box => {
  box.addEventListener("dragover", dragOver);
  box.addEventListener("drop", dragDrop);
})

function dragOver(e) {
  e.preventDefault();
}

function dragStart(e) {
  beingDragged = e.target;
  e.dataTransfer.setData('text/plain', '');
  e.dataTransfer.effectAllowed = 'move';
  highlightLegalMoves();
}

function dragDrop(e) {
  const targetBox = e.currentTarget;
  const pos = getKnightPosition();
  const moves = getLegalMoves(pos.row, pos.col);
  const targetRow = parseInt(targetBox.getAttribute('data-row'));
  const targetCol = parseInt(targetBox.getAttribute('data-col'));
  const isLegal = moves.some(move => move.row === targetRow && move.col === targetCol);
  if (isLegal) {
    e.currentTarget.append(beingDragged);
  }
  clearHighlights();
}

// Click functionality
const knightElement = document.querySelector('.knight');
knightElement.addEventListener('click', () => {
  if (!isHighlighting) {
    highlightLegalMoves();
    isHighlighting = true;
  }
});



document.querySelectorAll('.box').forEach(box => {
  box.addEventListener('click', (e) => {
    if (isHighlighting) {
      const pos = getKnightPosition();
      const moves = getLegalMoves(pos.row, pos.col);
      const targetRow = parseInt(box.getAttribute('data-row'));
      const targetCol = parseInt(box.getAttribute('data-col'));
      const isLegal = moves.some(move => move.row === targetRow && move.col === targetCol);
      if (isLegal) {
        box.append(document.querySelector('.knight'));
      }
      clearHighlights();
      isHighlighting = false;
    }
  });
});