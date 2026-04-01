// src/app/utils/getTextWidth.ts

export const getTextWidth = (text: string, font: string, className?: string, fallback: number = 1): number => {
  if (typeof document === 'undefined') return 0; // 防止 SSR 報錯

  if (text == '') { return fallback; };
  // 1. 建立一個隱形的 span
  const span = document.createElement('span');
  
  // 2. 套用 Class，讓它吃 CSS 設定
  if (className) span.className = className;

  // 3. 設定必要樣式以確保測量準確
  span.style.font = font;
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.style.whiteSpace = 'pre-wrap';
  span.style.display = 'inline-block';
  span.style.left = '-9999px'; // 移出畫面
  
  // 4. 填入文字 (處理 Composition 時傳入的文字)
  span.textContent = text;

  // 5. 插入 DOM 並量取寬度
  document.body.appendChild(span);
  const width = span.getBoundingClientRect().width; // 使用 getBoundingClientRect 更精準
  document.body.removeChild(span);

  return width;
};
