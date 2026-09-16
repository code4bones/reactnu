type TextMaskTokenKind = "digit" | "letter";

type TextMaskPart =
  | {
      type: "literal";
      value: string;
    }
  | {
      type: "token";
      kind: TextMaskTokenKind;
      min: number;
      max: number;
    };

const INFINITE_MASK_REPEAT = Number.POSITIVE_INFINITY;

function isAsciiDigit(character: string) {
  return /^\d$/.test(character);
}

function isLetter(character: string) {
  return character.toUpperCase() !== character.toLowerCase();
}

function matchesMaskToken(kind: TextMaskTokenKind, character: string) {
  return kind === "digit" ? isAsciiDigit(character) : isLetter(character);
}

function parseTextMask(mask: string): TextMaskPart[] {
  const parts: TextMaskPart[] = [];

  for (let index = 0; index < mask.length; index += 1) {
    const currentCharacter = mask[index];

    if (currentCharacter !== "D" && currentCharacter !== "A") {
      parts.push({
        type: "literal",
        value: currentCharacter
      });
      continue;
    }

    const kind: TextMaskTokenKind =
      currentCharacter === "D" ? "digit" : "letter";
    let min = 1;
    let max = 1;
    const quantifierStart = index + 1;
    const quantifierCharacter = mask[quantifierStart];

    if (quantifierCharacter === "*") {
      min = 0;
      max = INFINITE_MASK_REPEAT;
      index = quantifierStart;
    } else if (quantifierCharacter && isAsciiDigit(quantifierCharacter)) {
      let quantifierText = quantifierCharacter;
      let cursor = quantifierStart + 1;

      while (cursor < mask.length && isAsciiDigit(mask[cursor])) {
        quantifierText += mask[cursor];
        cursor += 1;
      }

      const exactAmount = Number.parseInt(quantifierText, 10);

      min = exactAmount;
      max = exactAmount;

      if (mask[cursor] === "+") {
        max = INFINITE_MASK_REPEAT;
        cursor += 1;
      }

      index = cursor - 1;
    }

    parts.push({
      type: "token",
      kind,
      min,
      max
    });
  }

  return parts;
}

function collectTokenValues(parts: TextMaskPart[], rawValue: string) {
  const sourceCharacters = Array.from(rawValue);
  const tokenValues = new Map<number, string>();
  let sourceIndex = 0;

  parts.forEach((part, partIndex) => {
    if (part.type !== "token") {
      return;
    }

    let collectedValue = "";

    while (
      sourceIndex < sourceCharacters.length &&
      collectedValue.length < part.max
    ) {
      const nextCharacter = sourceCharacters[sourceIndex];
      sourceIndex += 1;

      if (matchesMaskToken(part.kind, nextCharacter)) {
        collectedValue += nextCharacter;
      }
    }

    tokenValues.set(partIndex, collectedValue);
  });

  return tokenValues;
}

function hasFutureTokenValue(
  parts: TextMaskPart[],
  tokenValues: Map<number, string>,
  fromIndex: number
) {
  for (let index = fromIndex; index < parts.length; index += 1) {
    if (
      parts[index]?.type === "token" &&
      (tokenValues.get(index)?.length ?? 0) > 0
    ) {
      return true;
    }
  }

  return false;
}

function findPreviousTokenIndex(parts: TextMaskPart[], fromIndex: number) {
  for (let index = fromIndex - 1; index >= 0; index -= 1) {
    if (parts[index]?.type === "token") {
      return index;
    }
  }

  return -1;
}

function findNextTokenIndex(parts: TextMaskPart[], fromIndex: number) {
  for (let index = fromIndex + 1; index < parts.length; index += 1) {
    if (parts[index]?.type === "token") {
      return index;
    }
  }

  return -1;
}

function shouldRenderLiteral(
  parts: TextMaskPart[],
  tokenValues: Map<number, string>,
  partIndex: number
) {
  const previousTokenIndex = findPreviousTokenIndex(parts, partIndex);
  const nextTokenIndex = findNextTokenIndex(parts, partIndex);

  if (previousTokenIndex < 0) {
    return (
      nextTokenIndex >= 0 &&
      hasFutureTokenValue(parts, tokenValues, nextTokenIndex)
    );
  }

  const previousPart = parts[previousTokenIndex];

  if (previousPart?.type !== "token") {
    return false;
  }

  const previousValueLength = tokenValues.get(previousTokenIndex)?.length ?? 0;

  if (nextTokenIndex < 0) {
    return previousValueLength > 0 && previousValueLength >= previousPart.min;
  }

  return hasFutureTokenValue(parts, tokenValues, nextTokenIndex);
}

export function applyTextMask(mask: string, rawValue: string) {
  const parts = parseTextMask(mask);
  const tokenValues = collectTokenValues(parts, rawValue);
  let formattedValue = "";

  parts.forEach((part, partIndex) => {
    if (part.type === "token") {
      formattedValue += tokenValues.get(partIndex) ?? "";
      return;
    }

    if (shouldRenderLiteral(parts, tokenValues, partIndex)) {
      formattedValue += part.value;
    }
  });

  return formattedValue;
}

export function getTextMaskInputMode(mask: string) {
  const parts = parseTextMask(mask);
  const hasTokens = parts.some((part) => part.type === "token");

  if (
    !hasTokens ||
    parts.some((part) => part.type === "token" && part.kind !== "digit")
  ) {
    return undefined;
  }

  return "numeric";
}

export function isTextMaskComplete(mask: string, rawValue: string) {
  const parts = parseTextMask(mask);
  const tokenValues = collectTokenValues(parts, rawValue);

  return parts.every((part, partIndex) => {
    if (part.type !== "token") {
      return true;
    }

    const tokenLength = tokenValues.get(partIndex)?.length ?? 0;

    return tokenLength >= part.min && tokenLength <= part.max;
  });
}

export function getMaskedFieldState(mask: string, rawValue: string) {
  const formattedValue = applyTextMask(mask, rawValue);
  const isComplete = isTextMaskComplete(mask, formattedValue);
  const isInvalid = formattedValue.length > 0 && !isComplete;

  return {
    formattedValue,
    isComplete,
    isInvalid
  };
}
