import { describe, expect, it } from "vitest";
import { smartUnescapeJsonString, urlDecode, urlEncode } from "./jsonUtils";

describe("smartUnescapeJsonString", () => {
  it("unwraps an escaped JSON string and formats the JSON inside it", () => {
    const input = '"{\\n  \\"name\\": \\"Alma\\",\\n  \\"items\\": [1, 2]\\n}"';

    expect(smartUnescapeJsonString(input)).toBe(
      '{\n  "name": "Alma",\n  "items": [\n    1,\n    2\n  ]\n}'
    );
  });

  it("falls back to decoding escaped text that is not a JSON string literal", () => {
    const input = '{\\n  \\"name\\": \\"Alma\\"\\n}';

    expect(smartUnescapeJsonString(input)).toBe('{\n  "name": "Alma"\n}');
  });

  it("keeps already valid JSON objects intact apart from formatting", () => {
    const input = '{"name":"Alma","items":[1,2]}';

    expect(smartUnescapeJsonString(input)).toBe(
      '{\n  "name": "Alma",\n  "items": [\n    1,\n    2\n  ]\n}'
    );
  });
});

describe("URL codec", () => {
  it("encodes text for use in URL parameters", () => {
    expect(urlEncode('{"name":"张三","msg":"hello world & ok"}')).toBe(
      "%7B%22name%22%3A%22%E5%BC%A0%E4%B8%89%22%2C%22msg%22%3A%22hello%20world%20%26%20ok%22%7D"
    );
  });

  it("decodes URL encoded text", () => {
    expect(
      urlDecode(
        "%7B%22name%22%3A%22%E5%BC%A0%E4%B8%89%22%2C%22msg%22%3A%22hello%20world%20%26%20ok%22%7D"
      )
    ).toBe('{"name":"张三","msg":"hello world & ok"}');
  });

  it("throws a clear error for malformed URL encoding", () => {
    expect(() => urlDecode("%E4%B8%AD%")).toThrow("URL 编码格式错误");
  });
});
