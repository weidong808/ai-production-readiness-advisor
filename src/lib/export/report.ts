import type { ReadinessReport } from "@/lib/schema/narrative";

export function reportToMarkdown(report: ReadinessReport): string {
  const lines: string[] = [];
  lines.push(`# Readiness report — ${report.context.systemName}`);
  lines.push("");
  lines.push(report.disclaimer);
  lines.push("");
  lines.push(`- **Final band:** ${report.finalBand}`);
  lines.push(`- **Score band:** ${report.scoreBand}`);
  lines.push(`- **Overall score:** ${report.overallScore}`);
  lines.push(`- **Job:** ${report.context.jobToBeDone}`);
  lines.push("");

  if (report.executiveSummary) {
    lines.push("## Executive summary");
    lines.push("");
    lines.push(report.executiveSummary);
    lines.push("");
  }

  if (report.hardGatesApplied.length) {
    lines.push("## Hard gates");
    lines.push("");
    for (const g of report.hardGatesApplied) {
      lines.push(`- **${g.gateId}** (ceiling ${g.ceiling}): ${g.reason}`);
    }
    lines.push("");
  }

  lines.push("## Dimension scores");
  lines.push("");
  for (const d of report.dimensions) {
    lines.push(`- **${d.dimensionId} ${d.name}:** ${d.score} (${d.band})`);
  }
  lines.push("");

  if (report.dimensionNarratives.length) {
    lines.push("## Dimension notes");
    lines.push("");
    for (const n of report.dimensionNarratives) {
      lines.push(`### ${n.dimensionId}`);
      lines.push("");
      lines.push(n.narrative);
      lines.push("");
    }
  }

  if (report.risks.length) {
    lines.push("## Risks");
    lines.push("");
    for (const r of report.risks) {
      lines.push(`- **[${r.severity}] ${r.title}:** ${r.description}`);
      if (r.citationIds.length) {
        lines.push(`  - Citations: ${r.citationIds.join(", ")}`);
      }
    }
    lines.push("");
  }

  if (report.remediationPlan.length) {
    lines.push("## Remediation plan");
    lines.push("");
    const sorted = [...report.remediationPlan].sort(
      (a, b) => a.priority - b.priority,
    );
    for (const m of sorted) {
      lines.push(
        `${m.priority}. **${m.title}** (${m.effort}) — ${m.description}`,
      );
      if (m.citationIds.length) {
        lines.push(`   - Citations: ${m.citationIds.join(", ")}`);
      }
    }
    lines.push("");
  }

  if (report.citations.length) {
    lines.push("## Citations");
    lines.push("");
    for (const c of report.citations) {
      lines.push(`- **${c.id}** — ${c.title} (${c.source})`);
    }
    lines.push("");
  }

  if (report.qualityFlags?.length) {
    lines.push("## Quality flags");
    lines.push("");
    for (const flag of report.qualityFlags) {
      lines.push(`- ${flag}`);
    }
    lines.push("");
  }

  lines.push("---");
  lines.push(
    `${report.context.rubricVersion} · ${report.context.corpusVersion} · ${report.model.promptVersion} · narrative=${report.model.narrativeStatus}`,
  );
  return `${lines.join("\n")}\n`;
}

export function reportToJson(report: ReadinessReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}
