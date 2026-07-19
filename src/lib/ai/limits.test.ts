import { describe, expect, it } from "vitest";
import { truncateFreeText } from "@/lib/ai/limits";

describe("truncateFreeText", () => {
  it("caps total free-text characters", () => {
    const out = truncateFreeText(
      {
        a: "x".repeat(3000),
        b: "y".repeat(3000),
      },
      4000,
    );
    const total = Object.values(out ?? {}).reduce((n, s) => n + s.length, 0);
    expect(total).toBeLessThanOrEqual(4000);
    expect(out?.a?.length).toBe(3000);
    expect(out?.b?.length).toBe(1000);
  });
});
