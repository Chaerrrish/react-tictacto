// import React, { useState } from "react";
import type { Player } from "../types";

type SquareProps = {
  value: Player;
  onSquareClick: () => void;
};

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button
      className="w-20 h-20 flex items-center justify-center text-xl font-bold border border-black"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export default Square;
