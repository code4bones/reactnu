import { ReactNode } from "react";

type ParsedMnemonic = {
  mnemonicChar: string | null;
  mnemonicIndex: number | null;
  text: string;
};

export function parseMnemonicText(inputText: string): ParsedMnemonic {
  const outputChars: string[] = [];
  let mnemonicIndex: number | null = null;

  for (let index = 0; index < inputText.length; index += 1) {
    const currentChar = inputText[index];

    if (currentChar !== "&") {
      outputChars.push(currentChar);
      continue;
    }

    const nextChar = inputText[index + 1];

    if (nextChar === "&") {
      outputChars.push("&");
      index += 1;
      continue;
    }

    if (nextChar && mnemonicIndex === null) {
      mnemonicIndex = outputChars.length;
      outputChars.push(nextChar);
      index += 1;
    }
  }

  const parsedText = outputChars.join("");
  const mnemonicChar =
    mnemonicIndex !== null ? (parsedText[mnemonicIndex] ?? null) : null;

  return {
    mnemonicChar,
    mnemonicIndex,
    text: parsedText
  };
}

export function renderMnemonicText(
  text: string,
  keyClassName = "nu-mnemonic__key"
): ReactNode {
  const { mnemonicIndex, text: parsedText } = parseMnemonicText(text);

  if (
    mnemonicIndex === null ||
    mnemonicIndex < 0 ||
    mnemonicIndex >= parsedText.length
  ) {
    return parsedText;
  }

  return (
    <>
      {parsedText.slice(0, mnemonicIndex)}
      <span className={keyClassName}>
        {parsedText.slice(mnemonicIndex, mnemonicIndex + 1)}
      </span>
      {parsedText.slice(mnemonicIndex + 1)}
    </>
  );
}

export function renderMnemonicNode(
  value: ReactNode,
  keyClassName = "nu-mnemonic__key"
): ReactNode {
  return typeof value === "string"
    ? renderMnemonicText(value, keyClassName)
    : value;
}
