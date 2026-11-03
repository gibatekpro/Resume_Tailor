import {readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";

// The repo is public: fixtures (including any recorded model responses) may only hold placeholder contact details.
const ALLOWED_EMAILS = ["name@example.com"];
const ALLOWED_PHONES = ["+44 0000 000000"];

const fixtureFiles = (dir: string): string[] => readdirSync(dir, {withFileTypes: true}).flatMap((entry) =>
    entry.isDirectory() ? fixtureFiles(join(dir, entry.name)) : /\.(ts|json|txt|md)$/.test(entry.name) ? [join(dir, entry.name)] : []);

const contactDetailsIn = (text: string) => [
    ...(text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || []).filter((email) => !ALLOWED_EMAILS.includes(email)),
    ...(text.match(/(?:\+44\s?|\b0)(?:\d[\s-]?){9,10}\b/g) || []).filter((phone) => !ALLOWED_PHONES.includes(phone.trim())),
    ...(text.match(/linkedin\.com\/in\/[\w-]+/gi) || []).filter((url) => !/linkedin\.com\/in\/your-profile/i.test(url)),
];

describe("fixture privacy", () => {
    it("recognises real contact details and allows the placeholders", () => {
        expect(contactDetailsIn("jo.bloggs@gmail.com, 07700 900123, +44 7700 900123, linkedin.com/in/jo-bloggs")).toHaveLength(4);
        expect(contactDetailsIn("name@example.com, +44 0000 000000, linkedin.com/in/your-profile, from 2 days to 2 hours")).toEqual([]);
    });

    it("finds no real email, phone number or LinkedIn URL in any fixture", () => {
        const dir = join(process.cwd(), "src/utils/__fixtures__");
        const found = fixtureFiles(dir)
            .filter((file) => !file.endsWith("fixturePrivacy.test.ts"))
            .flatMap((file) => contactDetailsIn(readFileSync(file, "utf8")).map((detail) => `${file}: ${detail}`));
        expect(found).toEqual([]);
    });
});
