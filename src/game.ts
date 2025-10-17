export type Tile = number | null;
export type Board = Tile[][];

export interface MoveResult {
  board: Board;
  scoreDelta: number;
  moved: boolean;
}

export const cloneBoard = (b: Board): Board => b.map(row => row.slice());
export const range = (n: number) => Array.from({length: n}, (_, i) => i);

export function emptyBoard(size: number): Board {
  return range(size).map(() => range(size).map(() => null));
}

function randChoice<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function addRandomTile(board: Board): Board {
  const size = board.length;
  const empties: [number, number][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === null) empties.push([r, c]);
    }
  }
  if (empties.length === 0) return board;
  const [r, c] = randChoice(empties);
  const value = Math.random() < 0.9 ? 2 : 4;
  const nb = cloneBoard(board);
  nb[r][c] = value;
  return nb;
}

export function startBoard(size = 4): Board {
  let b = emptyBoard(size);
  b = addRandomTile(b);
  b = addRandomTile(b);
  return b;
}

export function slideAndMergeRowLeft(row: Tile[]): {row: Tile[]; score: number; moved: boolean} {
  const compact = row.filter(x => x !== null) as number[];
  let score = 0;
  const out: number[] = [];
  let moved = false;

  let i = 0;
  while (i < compact.length) {
    if (i + 1 < compact.length && compact[i] === compact[i+1]) {
      const merged = compact[i]*2;
      out.push(merged);
      score += merged;
      i += 2;
      moved = true;
    } else {
      out.push(compact[i]);
      i += 1;
    }
  }
  const newRow: Tile[] = out.concat(Array(row.length - out.length).fill(null));
  if (!moved) {
    for (let j = 0, k = 0; j < row.length; j++) {
      if (row[j] !== null) {
        if (row[j] !== newRow[k]) { moved = true; break; }
        k++;
      }
    }
  }
  return {row: newRow, score, moved};
}

export function rotateBoard(board: Board): Board {
  const n = board.length;
  const nb = emptyBoard(n);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    nb[c][n - 1 - r] = board[r][c];
  }
  return nb;
}

export function moveLeft(board: Board): MoveResult {
  const size = board.length;
  let score = 0;
  let moved = false;
  const nb = range(size).map(r => {
    const {row, score: s, moved: m} = slideAndMergeRowLeft(board[r]);
    score += s;
    if (m) moved = true;
    return row;
  });
  return {board: nb, scoreDelta: score, moved};
}

export function move(board: Board, dir: 'left'|'right'|'up'|'down'): MoveResult {
  let working = cloneBoard(board);
  let rotatedTimes = 0;
  if (dir === 'up') { working = rotateBoard(working); rotatedTimes = 1; }
  else if (dir === 'right') { working = rotateBoard(rotateBoard(working)); rotatedTimes = 2; }
  else if (dir === 'down') { working = rotateBoard(rotateBoard(rotateBoard(working))); rotatedTimes = 3; }
  const {board: movedBoard, scoreDelta, moved} = moveLeft(working);
  let out = movedBoard;
  for (let i = 0; i < (4 - rotatedTimes) % 4; i++) {
    out = rotateBoard(out);
  }
  return {board: out, scoreDelta, moved};
}

export function isWin(board: Board, target = 2048): boolean {
  return board.some(row => row.some(cell => cell === target));
}

export function canMove(board: Board): boolean {
  const size = board.length;
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
    if (board[r][c] === null) return true;
  }
  for (let r = 0; r < size; r++) for (let c = 0; c < size - 1; c++) {
    if (board[r][c] === board[r][c+1]) return true;
  }
  for (let c = 0; c < size; c++) for (let r = 0; r < size - 1; r++) {
    if (board[r][c] === board[r+1][c]) return true;
  }
  return false;
}
