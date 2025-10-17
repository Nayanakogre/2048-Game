import React, { useEffect, useReducer } from 'react'
import { Board, startBoard, addRandomTile, move, isWin, canMove } from './game'
import BoardView from './BoardView'

type State = {
  board: Board;
  score: number;
  gameOver: boolean;
  won: boolean;
  size: number;
}

type Action =
  | {type: 'INIT'; size?: number}
  | {type: 'MOVE'; dir: 'left'|'right'|'up'|'down'}
  | {type: 'RESTART'}
  | {type: 'SET_SIZE'; size: number};

function initState(size = 4): State {
  const b = startBoard(size);
  return {board: b, score: 0, gameOver: false, won: false, size};
}

function reducer(state: State, action: Action): State {
  if (action.type === 'INIT') return initState(action.size ?? state.size);
  if (action.type === 'RESTART') return initState(state.size);
  if (action.type === 'SET_SIZE') return initState(action.size);
  if (action.type === 'MOVE') {
    if (state.gameOver || state.won) return state;
    const {board: movedBoard, scoreDelta, moved} = move(state.board, action.dir);
    if (!moved) return state;
    const withNew = addRandomTile(movedBoard);
    const newScore = state.score + scoreDelta;
    const won = isWin(withNew);
    const can = canMove(withNew);
    return {
      ...state,
      board: withNew,
      score: newScore,
      won,
      gameOver: !can && !won
    };
  }
  return state;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initState(4));

  // useEffect(() => {
  //   const handler = (e: KeyboardEvent) => {
  //     if (e.key === 'ArrowLeft') dispatch({type: 'MOVE', dir: 'left'});
  //     if (e.key === 'ArrowRight') dispatch({type: 'MOVE', dir: 'right'});
  //     if (e.key === 'ArrowUp') dispatch({type: 'MOVE', dir: 'up'});
  //     if (e.key === 'ArrowDown') dispatch({type: 'MOVE', dir: 'down'});
  //     if (e.key.toLowerCase() === 'r') dispatch({type: 'RESTART'});
  //   };
  //   window.addEventListener('keydown', handler);
  //   return () => window.removeEventListener('keydown', handler);
  // }, []);
  useEffect(() => {
  const handler = (e: globalThis.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        dispatch({ type: 'MOVE', dir: 'left' });
        break;
      case 'ArrowRight':
        dispatch({ type: 'MOVE', dir: 'right' });
        break;
      case 'ArrowUp':
        dispatch({ type: 'MOVE', dir: 'up' });
        break;
      case 'ArrowDown':
        dispatch({ type: 'MOVE', dir: 'down' });
        break;
      case 'r':
      case 'R':
        dispatch({ type: 'RESTART' });
        break;
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);


  return (
    <div className="app">
      <header className="header">
        <h1>2048</h1>
        <div className="controls">
          <div className="score">Score: <strong>{state.score}</strong></div>
          <button onClick={() => dispatch({type: 'RESTART'})}>Restart</button>
          <select value={state.size} onChange={e => dispatch({type: 'SET_SIZE', size: +e.target.value})}>
            <option value={3}>3x3</option>
            <option value={4}>4x4</option>
            <option value={5}>5x5</option>
            <option value={6}>6x6</option>
          </select>
        </div>
      </header>

      <main>
        <BoardView board={state.board} />
        <div className="buttons">
          <button onClick={() => dispatch({type: 'MOVE', dir: 'up'})}>↑</button>
          <div>
            <button onClick={() => dispatch({type: 'MOVE', dir: 'left'})}>←</button>
            <button onClick={() => dispatch({type: 'MOVE', dir: 'down'})}>↓</button>
            <button onClick={() => dispatch({type: 'MOVE', dir: 'right'})}>→</button>
          </div>
        </div>

        {state.won && <div className="overlay">You reached 2048! 🎉</div>}
        {state.gameOver && !state.won && <div className="overlay">Game Over</div>}
      </main>

      <footer className="footer">
        <small>Use arrow keys or buttons. Press "R" to restart.</small>
      </footer>
    </div>
  );
}
