const BLOCKLIST = [
  /soc\s*2\s*certified/i,
  /soc2\s*certified/i,
  /hipaa\s*compliant/i,
  /official\s*audit/i,
  /approved\s+for\s+production\s+by\s+this\s+tool/i,
  /you\s+are\s+approved\s+for\s+production\s+by/i,
];

export function findBlocklistMatches(text: string): string[] {
  const hits: string[] = [];
  for (const re of BLOCKLIST) {
    const m = text.match(re);
    if (m) hits.push(m[0]);
  }
  return hits;
}

/** Soft scrub: replace blocked phrases so we never show certification claims. */
export function scrubBlocklist(text: string): string {
  let out = text;
  for (const re of BLOCKLIST) {
    out = out.replace(re, "[advisory assessment]");
  }
  return out;
}
