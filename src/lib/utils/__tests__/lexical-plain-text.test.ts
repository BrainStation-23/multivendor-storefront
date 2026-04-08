import { describe, expect, it } from "vitest";
import { lexicalToPlainText } from "../lexical-plain-text";

describe("lexicalToPlainText", () => {
  it("returns null for empty input", () => {
    expect(lexicalToPlainText(null)).toBeNull();
    expect(lexicalToPlainText(undefined)).toBeNull();
    expect(lexicalToPlainText("")).toBeNull();
    expect(lexicalToPlainText("   ")).toBeNull();
  });

  it("returns plain strings unchanged", () => {
    expect(lexicalToPlainText("Hello")).toBe("Hello");
  });

  it("extracts text from Lexical root", () => {
    const doc = {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", text: "Hello ", version: 1 },
              { type: "text", text: "world", version: 1 },
            ],
          },
        ],
      },
    };
    expect(lexicalToPlainText(doc)).toBe("Hello world");
  });
});
