import React, { useEffect, useState } from "react";
import Board from "./Board";
import type { Player } from "../types";

function Game() {
  const [history, setHistory] = useState<Player[][]>(() => {
    const storedHistory = localStorage.getItem("ticTacToeHistory");
    return storedHistory ? JSON.parse(storedHistory) : [Array(9).fill(null)];
  });
  const [currentMove, setCurrentMove] = useState<number>(() => {
    const storedMove = localStorage.getItem("ticTacToeCurrentMove");
    return storedMove ? parseInt(storedMove) : 0;
  });
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  useEffect(() => {
    localStorage.setItem("ticTacToeHistory", JSON.stringify(history));
    localStorage.setItem("ticTacToeCurrentMove", currentMove.toString());
  }, [history, currentMove]);

  function calculateWinner(squares: Player[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  const winner = calculateWinner(currentSquares);
  const isBoardFull = currentSquares.every((square) => square !== null);

  function handlePlay(nextSquares: Player[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="">
      <div className="flex justify-center text-center text-5xl mb-10">
        Let's TicTacTo!
      </div>
      <div className="flex gap-[10rem] w-full p-4 items-start">
        <div className="flex-1 text-center">
          <div className="text-2xl mb-4">
            {winner
              ? `Winner: ${winner}`
              : `Next player : ${xIsNext ? "X" : "O"}`}
          </div>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="flex-1 text-center items-start">
          <div className="text-2xl mb-4">History</div>
          <ol className="flex flex-col gap-1">{moves}</ol>
        </div>
      </div>

      {(winner || isBoardFull) && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow text-center">
            <h2 className="text-2xl mb-8 px-2">
              {winner ? `🎉  Winner: ${winner}  🎉` : "무승부입니다!"}
            </h2>
            <button
              onClick={restartGame}
              className="bg-[#82739f] text-white px-4 py-2 rounded cursor-pointer"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
