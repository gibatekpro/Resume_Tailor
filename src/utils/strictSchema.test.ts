import {describe, expect, it} from "vitest";
import {arrayOf, integer, object, oneOf, schemaErrors, string} from "./strictSchema";
import {ANALYSIS_SCHEMA, REWRITE_SCHEMA} from "../data/tailoringSchemas";
import type {JsonSchema} from "./strictSchema";

const schema = object({name: string(), level: oneOf("mid", "lead"), tags: arrayOf(object({id: integer()}))});

describe("schemaErrors", () => {
    it("accepts a matching value", () => {
        expect(schemaErrors(schema, {name: "x", level: "lead", tags: [{id: 1}]})).toEqual([]);
    });

    it("lists every mismatch with its path", () => {
        expect(schemaErrors(schema, {name: 1, level: "boss", tags: [{id: 1.5}], extra: true})).toEqual([
            "$.extra: not allowed",
            "$.name: expected a string",
            "$.level: expected one of mid, lead",
            "$.tags[0].id: expected an integer",
        ]);
        expect(schemaErrors(schema, {})).toEqual(["$.name: missing", "$.level: missing", "$.tags: missing"]);
    });
});

// Strict structured outputs need every object to list all its properties as required and forbid extra ones.
const isStrict = (node: JsonSchema): boolean => {
    if (node.type === "object") {
        return node.additionalProperties === false &&
            Object.keys(node.properties).every((key) => node.required.includes(key)) &&
            Object.values(node.properties).every(isStrict);
    }
    return node.type === "array" ? isStrict(node.items) : true;
};

describe("step schemas", () => {
    it("meet OpenAI's strict mode rules", () => {
        expect(isStrict(ANALYSIS_SCHEMA)).toBe(true);
        expect(isStrict(REWRITE_SCHEMA)).toBe(true);
    });
});
