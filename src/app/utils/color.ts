export function colorNameToHex(colorName: string) {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = colorName;

  return ctx.fillStyle;
}
