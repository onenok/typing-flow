// src/app/utils/getTextWidth.ts

export const getTextWidth = (text: string, font: string, className?: string, fallback: number = 1): number => {
  if (typeof document === 'undefined') return 0; // 防止 SSR 報錯

  if (text == '') { return fallback; };
  // 1. 建立一個隱形的 pre
  const pre = document.createElement('pre');
  
  // 2. 套用 Class，讓它吃 CSS 設定
  if (className) pre.className = className;

  // 3. 設定必要樣式以確保測量準確
  pre.style.font = font;
  pre.style.visibility = 'hidden';
  pre.style.position = 'absolute';
  pre.style.whiteSpace = 'pre';
  pre.style.display = 'inline-block';
  pre.style.left = '-9999px'; // 移出畫面
  
  // 4. 填入文字 (處理 Composition 時傳入的文字)
  pre.textContent = text;

  // 5. 插入 DOM 並量取寬度
  document.body.appendChild(pre);
  const width = pre.getBoundingClientRect().width; // 使用 getBoundingClientRect 更精準
  document.body.removeChild(pre);

  return width;
};
