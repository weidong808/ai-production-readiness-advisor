import { describe, expect, it } from "vitest";
import { redactFreeTextMap, redactSecrets } from "@/lib/security/redact";

describe("redactSecrets", () => {
  it("redacts openai-looking keys and bearer tokens", () => {
    const sample =
      "key=sk-abcdefghijklmnopqrstuvwxyz012345 and Bearer abcdefghijklmnopqrstuvwxyz0123456789";
    const { text, redactions } = redactSecrets(sample);
    expect(text).not.toContain("sk-abcdefghijklmnopqrstuvwxyz012345");
    expect(text).toContain("[REDACTED:openai_key]");
    expect(text).toContain("[REDACTED:generic_bearer]");
    expect(redactions).toEqual(
      expect.arrayContaining(["openai_key", "generic_bearer"]),
    );
  });

  it("redacts free-text maps used in assessments", () => {
    const { freeText, redactions } = redactFreeTextMap({
      "X.1": "password=supersecretvalue123",
    });
    expect(freeText?.["X.1"]).toContain("[REDACTED:connection_string_password]");
    expect(redactions).toContain("connection_string_password");
  });
});
