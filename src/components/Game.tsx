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
  const [xWins, setXWins] = useState<number>(() => {
    const storedXWins = localStorage.getItem("ticTacToeXWins");
    return storedXWins ? parseInt(storedXWins) : 0;
  });

  const [oWins, setOWins] = useState<number>(() => {
    const storedOWins = localStorage.getItem("ticTacToeOWins");
    return storedOWins ? parseInt(storedOWins) : 0;
  });
  const [winner, setWinner] = useState<Player | null>(null);
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

  //   const winner = calculateWinner(currentSquares);
  const isBoardFull = currentSquares.every((square) => square !== null);

  useEffect(() => {
    localStorage.setItem("ticTacToeXWins", xWins.toString());
    localStorage.setItem("ticTacToeOWins", oWins.toString());
  }, [xWins, oWins]);

  function handlePlay(nextSquares: Player[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const gameWinner = calculateWinner(nextSquares);
    if (gameWinner) {
      setWinner(gameWinner); // ✅ 상태 업데이트
      if (gameWinner === "X") setXWins((prev) => prev + 1);
      else if (gameWinner === "O") setOWins((prev) => prev + 1);
    }
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinner(null);
  }

  function resetScore() {
    setXWins(0);
    setOWins(0);
    localStorage.setItem("ticTacToeXWins", "0");
    localStorage.setItem("ticTacToeOWins", "0");
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
    <div className="flex flex-col items-center ">
      <div className="flex justify-center text-center text-5xl mb-10">
        Let's TicTacTo!
      </div>
      <hr className="w-[600px]" />
      <div className="flex justify-center items-center gap-8 text-2xl font-semibold my-4">
        <div>X Wins : {xWins}</div>
        <div>O Wins : {oWins}</div>
        <button className="border-2 p-2" onClick={resetScore}>
          reset scores
        </button>
      </div>
      <hr className="w-[600px]" />
      <div className="flex gap-[10rem] mt-4 w-full p-4 items-start">
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
      <div>
        <button
          className="mt-14 border-2 p-2 bg-black text-white w-[10rem]"
          onClick={restartGame}
        >
          Restart
        </button>
      </div>

      {(winner || isBoardFull) && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow text-center">
            <h2 className="text-2xl mb-8 px-2 py-2">
              {winner ? `🎉  Winner: ${winner}  🎉` : "무승부입니다!"}
            </h2>
            <button
              onClick={restartGame}
              className="bg-black text-white px-4 py-2 cursor-pointer"
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
