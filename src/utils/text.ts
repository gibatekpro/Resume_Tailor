// Text matching shared by fact verification and the rewrite checks.

const NUMBER_WORDS: Record<string, string> = {
    one: "1", two: "2", three: "3", four: "4", five: "5", six: "6",
    seven: "7", eight: "8", nine: "9", ten: "10", eleven: "11", twelve: "12",
};

// Lowercase words separated by single spaces and padded with a space at each end, so " react " only matches the word.
// Keeps the characters that matter in tech names (C#, C++, .NET, Node.js) but drops a full stop that ends a sentence.
// Number words become digits, so "a team of three" matches "a team of 3".
export const normaliseText = (value?: string) => {
    const words = (value || "")
        .toLowerCase()
        .replace(/[‘’]/g, "'")
        .replace(/(\d),(?=\d{3}\b)/g, "$1")
        .replace(/[^a-z0-9#+.]+/g, " ")
        .replace(/\.(?![a-z0-9])/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((word) => NUMBER_WORDS[word] ?? word);
    return ` ${words.join(" ")} `;
};

export const tokens = (value?: string) => normaliseText(value).trim().split(" ").filter(Boolean);

// Whether `phrase` appears in `text` as whole words.
export const containsPhrase = (text: string, phrase: string) => {
    const needle = normaliseText(phrase);
    return needle.trim().length > 0 && normaliseText(text).includes(needle);
};

// A rough stem, enough to match "developers"/"developer" and "building"/"build".
export const stem = (word: string) => word.length <= 4 ? word : word.replace(/(ing|ed|s)$/, "");

export const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
