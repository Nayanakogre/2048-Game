import React from 'react'
import { Board } from './game'

function tileClass(val: number | null) {
  if (val === null) return 'tile empty';
  return `tile tile-${val}`;
}

export default function BoardView({ board }: { board: Board }) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)` }}>
      {board.flat().map((v, idx) => (
        <div key={idx} className={tileClass(v as number | null)}>
          {v !== null ? v : ''}
        </div>
      ))}
    </div>
  );
}
