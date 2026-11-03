// The subset of JSON Schema that OpenAI's strict structured outputs accept, and a validator for it.
// One schema per step is sent to OpenAI as response_format and used again here to check the answer at runtime.
// The server imports this file, so its relative imports (none yet) must end in ".js".

export type JsonSchema =
    | {type: "string", enum?: string[]}
    | {type: "integer" | "number" | "boolean"}
    | {type: "array", items: JsonSchema}
    | {type: "object", properties: Record<string, JsonSchema>, required: string[], additionalProperties: false};

export const string = (): JsonSchema => ({type: "string"});
export const integer = (): JsonSchema => ({type: "integer"});
export const oneOf = (...values: string[]): JsonSchema => ({type: "string", enum: values});
export const arrayOf = (items: JsonSchema): JsonSchema => ({type: "array", items});
// Strict mode needs every property listed as required and no extra properties allowed.
export const object = (properties: Record<string, JsonSchema>): JsonSchema =>
    ({type: "object", properties, required: Object.keys(properties), additionalProperties: false});

// Every place `value` doesn't match `schema`, as "path: problem". Empty when it matches.
export const schemaErrors = (schema: JsonSchema, value: unknown, path = "$"): string[] => {
    switch (schema.type) {
        case "string":
            if (typeof value !== "string") return [`${path}: expected a string`];
            return schema.enum && !schema.enum.includes(value) ? [`${path}: expected one of ${schema.enum.join(", ")}`] : [];
        case "integer":
            return Number.isInteger(value) ? [] : [`${path}: expected an integer`];
        case "number":
            return typeof value === "number" && Number.isFinite(value) ? [] : [`${path}: expected a number`];
        case "boolean":
            return typeof value === "boolean" ? [] : [`${path}: expected true or false`];
        case "array":
            if (!Array.isArray(value)) return [`${path}: expected an array`];
            return value.flatMap((item, index) => schemaErrors(schema.items, item, `${path}[${index}]`));
        case "object": {
            if (typeof value !== "object" || value === null || Array.isArray(value)) return [`${path}: expected an object`];
            const record = value as Record<string, unknown>;
            return [
                ...schema.required.filter((key) => !(key in record)).map((key) => `${path}.${key}: missing`),
                ...Object.keys(record).filter((key) => !(key in schema.properties)).map((key) => `${path}.${key}: not allowed`),
                ...Object.entries(schema.properties).flatMap(([key, child]) => key in record ? schemaErrors(child, record[key], `${path}.${key}`) : []),
            ];
        }
    }
};

// The response_format that asks OpenAI for JSON matching `schema`.
export const jsonSchemaFormat = (name: string, schema: JsonSchema) =>
    ({type: "json_schema", json_schema: {name, strict: true, schema}});
