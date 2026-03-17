// components/typing/HiddenInput.tsx
import { useTyping } from "./TypingProvider";

export default function HiddenInput() {
  const {
    hiddenInputRef,
    handleCompositionStart,
    handleCompositionEnd,
    handleInput,
    handleBlur,
    cursorPosition,
  } = useTyping();

  return (
    <input
      ref={hiddenInputRef}
      type="text"
      autoFocus
      style={{
        position: "absolute",
        left: `${cursorPosition.left}px`,
        top: `${cursorPosition.top}px`,
        width: "300px",
        height: "2em",
        padding: "0",
        margin: "0",
        border: "none",
        outline: "none",
        background: "transparent",
        color: "transparent",
        caretColor: "transparent",
        fontSize: "1.25rem",
        lineHeight: "1.5",
        pointerEvents: "auto",
      }}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onInput={handleInput}
      onBlur={handleBlur}
      autoComplete="off"
      spellCheck={false}
    />
  );
}