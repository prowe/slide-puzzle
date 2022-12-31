import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './App.module.css';

const SQUARES_PER_SIDE = 3;
const SQUARE_COUNT = Math.pow(SQUARES_PER_SIDE, 2);

interface Piece {
  label: String;
  position: number;
}

function indexToX(index: number): number {
  return index % SQUARES_PER_SIDE;
}

function indexToY(index: number): number {
  return Math.trunc(index / SQUARES_PER_SIDE);
}

function initPieceArray(): Piece[] {
  return (new Array(SQUARE_COUNT - 1))
    .fill(0)
    .map((_, i) => ({
      label: `${i + 1}`,
      position: i,
    }));
}

function findOpenPosition(pieces: Piece[]): number {
  let takenPositions = pieces.map(p => p.position);
  return new Array(SQUARE_COUNT)
    .findIndex((_, i) => !takenPositions.includes(i));
}

function isPieceBorderingOpenPosition(piece: Piece, openPosition: number): boolean {
  const openX = indexToX(openPosition);
  const openY = indexToY(openPosition);
  const pieceX = indexToX(piece.position);
  const pieceY = indexToY(piece.position);
  if (Math.abs(openX - pieceX) === 1 && openY === pieceY) {
    return true;
  }
  if (Math.abs(openY - pieceY) === 1 && openX === pieceX) {
    return true;
  }
  return false;
}

interface PieceButtonProps {
  piece: Piece;
  updatePieces: Dispatch<SetStateAction<Piece[]>>;
  enabled: boolean;
}

function PieceButton({piece, updatePieces, enabled}: PieceButtonProps) {
  const x = indexToX(piece.position);
  const y = indexToY(piece.position);

  const movePiece = (pieces: Piece[]): Piece[] => {
    const openPosition = findOpenPosition(pieces);
    return pieces.map(p => {
      if (p === piece) {
        console.log('Moving ', p, ' to ', openPosition);
        return {
          ...p,
          position: openPosition
        };
      }
      return p;
    });
  };

  return (
    <button
      className={styles.piece}
      disabled={!enabled}
      style={{
        left: `calc(${x} * var(--square-size))`,
        top: `calc(${y} * var(--square-size))`,
      }}
      onClick={() => updatePieces(movePiece)}
      >{piece.label}</button>
  )
}

function shufflePieces(pieces: Piece[]): Piece[] {
  const newPositions = (new Array(SQUARE_COUNT)).fill(0).map((_, i) => i);
  newPositions.sort(() => Math.random() - 0.5);
  console.log('Shuffled deck: ', newPositions);
  return pieces.map((p, i) => ({
    ...p,
    position: newPositions[i]
  }));
}

export default function App() {
  let [pieces, updatePieces] = useState(initPieceArray);
  useEffect(() => {
    setTimeout(() => updatePieces(shufflePieces), 1000);
  }, [updatePieces]);

  const openPosition = findOpenPosition(pieces);
  return (
    <main className={styles.main} style={{'--squares-per-side': SQUARES_PER_SIDE}}>
      <section className={styles.puzzle}>
        {pieces.map((p, i) => <PieceButton 
          key={i} 
          piece={p} 
          updatePieces={updatePieces}
          enabled={isPieceBorderingOpenPosition(p, openPosition)}
        />)}
      </section>
    </main>
  );
}
