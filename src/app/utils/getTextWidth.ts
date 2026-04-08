// src/app/utils/getTextWidth.ts

export const getTextWidth = (text: string, font: string, className?: string, fallback: number = 1): number => {
  if (typeof document === 'undefined') return 0; // Prevent SSR errors

  if (text == '') { return fallback; };
  // 1. Create an invisible span
  const span = document.createElement('span');
  
  // 2. Apply Class to get CSS settings
  if (className) span.className = className;

  // 3. Set necessary styles to ensure accurate measurement
  span.style.font = font;
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.style.whiteSpace = 'pre-wrap';
  span.style.display = 'inline-block';
  span.style.left = '-9999px'; // Move off screen
  
  // 4. Fill in text (text passed when handling Composition)
  span.textContent = text;

  // 5. Insert into DOM and measure width
  document.body.appendChild(span);
  const width = span.getBoundingClientRect().width; // Use getBoundingClientRect for more accuracy
  document.body.removeChild(span);

  return width;
};
