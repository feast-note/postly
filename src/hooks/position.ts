"use client";
import { useState } from "react";

export const usePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 캔버스 위치
  const onPosition = (x: number, y: number) => setPosition({ x, y });

  return { position, onPosition };
};
