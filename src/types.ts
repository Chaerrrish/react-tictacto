export type Player = "X" | "O" | null;

export type Position = number;

export type MoveLog = {
  moveNumber: number; // 턴 번호 (1부터)
  player: Player; // X 또는 O
  position: Position; // 클릭한 위치 (0~8)
};
