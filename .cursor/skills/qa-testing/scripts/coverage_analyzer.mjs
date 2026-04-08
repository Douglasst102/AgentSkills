#!/usr/bin/env node
/**
 * Coverage Analyzer
 *
 * Parses Jest/Istanbul coverage reports and identifies gaps,
 * uncovered branches, and provides actionable recommendations.
 *
 * Usage:
 *   node coverage_analyzer.mjs coverage/coverage-final.json --threshold 80
 *   node coverage_analyzer.mjs coverage/ --format html --output report.html
 *   node coverage_analyzer.mjs coverage/ --critical-paths
 */

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { resolve, basename, join } from 'path';

// ---------------------------------------------------------------------------
// Argument parsing (no external deps)
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { threshold: 80, format: 'text', strict: false, criticalPaths: false, verbose: false, json: false };
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--threshold' || a === '-t') { args.threshold = Number(argv[++i]); }
    else if (a.startsWith('--threshold=')) { args.threshold = Number(a.split('=')[1]); }
    else if (a === '--strict') { args.strict = true; }
    else if (a === '--critical-paths') { args.criticalPaths = true; }
    else if (a === '--verbose' || a === '-v') { args.verbose = true; }
    else if (a === '--json') { args.json = true; }
    else if (a === '--format' || a === '-f') { args.format = argv[++i]; }
    else if (a.startsWith('--format=')) { args.format = a.split('=')[1]; }
    else if (a === '--output' || a === '-o') { args.output = argv[++i]; }
    else if (a.startsWith('--output=')) { args.output = a.split('=')[1]; }
    else if (!a.startsWith('-')) { positional.push(a); }
  }

  if (!positional[0]) {
    console.error('Usage: node coverage_analyzer.mjs <coverage-path> [options]');
    process.exit(1);
  }
  args.coverage = positional[0];
  return args;
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

function pct(covered, total) {
  return total > 0 ? (covered / total) * 100 : 100;
}

function parseIstanbulJson(filePath) {
  const data = JSON.parse(readFileSync(filePath, 'utf8'));
  const files = {};
  const totals = { s: [0, 0], b: [0, 0], f: [0, 0], l: [0, 0] };

  for (const [fp, fd] of Object.entries(data)) {
    if (fp.includes('node_modules')) continue;

    const sMap = fd.statementMap || {};
    const sHits = fd.s || {};
    const coveredS = Object.values(sHits).filter(h => h > 0).length;
    totals.s[0] += coveredS; totals.s[1] += Object.keys(sMap).length;

    const bMap = fd.branchMap || {};
    const bHits = fd.b || {};
    const coveredB = Object.values(bHits).flat().filter(h => h > 0).length;
    const totalB = Object.values(bMap).reduce((acc, b) => acc + (b.locations?.length ?? 2), 0);
    totals.b[0] += coveredB; totals.b[1] += totalB;

    const fnMap = fd.fnMap || {};
    const fnHits = fd.f || {};
    const coveredF = Object.values(fnHits).filter(h => h > 0).length;
    totals.f[0] += coveredF; totals.f[1] += Object.keys(fnMap).length;

    const uncoveredLines = [];
    const lineSet = new Set(); const coveredLineSet = new Set();
    for (const [sid, stmt] of Object.entries(sMap)) {
      const sl = stmt?.start?.line ?? 0;
      const el = stmt?.end?.line ?? sl;
      for (let ln = sl; ln <= el; ln++) {
        lineSet.add(ln);
        if ((sHits[sid] ?? 0) > 0) coveredLineSet.add(ln);
      }
      if ((sHits[sid] ?? 0) === 0 && sl > 0 && !uncoveredLines.includes(sl)) uncoveredLines.push(sl);
    }
    const coveredL = coveredLineSet.size; const totalL = lineSet.size;
    totals.l[0] += coveredL; totals.l[1] += totalL;

    const uncoveredBranches = [];
    for (const [bid, hits] of Object.entries(bHits)) {
      hits.forEach((h, i) => { if (h === 0) uncoveredBranches.push(`${bid}:${i}`); });
    }

    files[fp] = {
      path: fp,
      stmtPct: pct(coveredS, Object.keys(sMap).length),
      branchPct: pct(coveredB, totalB),
      fnPct: pct(coveredF, Object.keys(fnMap).length),
      linePct: pct(coveredL, totalL),
      uncoveredLines: uncoveredLines.sort((a, b) => a - b).slice(0, 50),
      uncoveredBranches: uncoveredBranches.slice(0, 20),
    };
  }

  return { files, totals };
}

function parseLcov(filePath) {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  const files = {};
  const totals = { s: [0, 0], b: [0, 0], f: [0, 0], l: [0, 0] };
  let cur = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('SF:')) {
      cur = { path: line.slice(3), lh: 0, lt: 0, fh: 0, ft: 0, bh: 0, bt: 0, uncoveredLines: [] };
    } else if (cur) {
      if (line.startsWith('DA:')) {
        const [ln, hits] = line.slice(3).split(',');
        cur.lt++; if (Number(hits) > 0) cur.lh++; else cur.uncoveredLines.push(Number(ln));
      } else if (line.startsWith('FN:')) { cur.ft++; }
      else if (line.startsWith('FNDA:')) { if (Number(line.slice(5).split(',')[0]) > 0) cur.fh++; }
      else if (line.startsWith('BRDA:')) {
        cur.bt++;
        const parts = line.slice(5).split(',');
        if (parts[3] !== '-' && Number(parts[3]) > 0) cur.bh++;
      } else if (line === 'end_of_record') {
        if (!cur.path.includes('node_modules')) {
          files[cur.path] = {
            path: cur.path,
            stmtPct: pct(cur.lh, cur.lt),
            branchPct: pct(cur.bh, cur.bt),
            fnPct: pct(cur.fh, cur.ft),
            linePct: pct(cur.lh, cur.lt),
            uncoveredLines: cur.uncoveredLines.slice(0, 50),
            uncoveredBranches: [],
          };
          totals.s[0] += cur.lh; totals.s[1] += cur.lt;
          totals.b[0] += cur.bh; totals.b[1] += cur.bt;
          totals.f[0] += cur.fh; totals.f[1] += cur.ft;
          totals.l[0] += cur.lh; totals.l[1] += cur.lt;
        }
        cur = null;
      }
    }
  }

  return { files, totals };
}

function findAndParse(inputPath) {
  const resolved = resolve(inputPath);
  const stat = statSync(resolved);

  if (stat.isFile()) {
    if (resolved.endsWith('.json')) return parseIstanbulJson(resolved);
    if (resolved.endsWith('.info') || basename(resolved).includes('lcov')) return parseLcov(resolved);
  }

  if (stat.isDirectory()) {
    for (const name of ['coverage-final.json', 'coverage-summary.json', 'lcov.info']) {
      const candidate = join(resolved, name);
      if (existsSync(candidate)) return findAndParse(candidate);
    }
  }

  throw new Error(`Cannot find or parse coverage data at: ${inputPath}`);
}

// ---------------------------------------------------------------------------
// Analyzer
// ---------------------------------------------------------------------------

const CRITICAL_PATTERNS = /auth|payment|security|login|register|checkout|order|transaction|billing/i;
const SERVICE_PATTERNS = /service|api|handler|controller|middleware/i;

function lowerSeverity(s) {
  return { critical: 'high', high: 'medium', medium: 'low', low: 'low' }[s];
}

function analyzeFile(fp, cov, threshold) {
  const gaps = [];
  const isCritical = CRITICAL_PATTERNS.test(fp);
  const isService = SERVICE_PATTERNS.test(fp);
  const baseSeverity = isCritical ? 'critical' : isService ? 'high' : 'medium';
  const target = isCritical ? 95 : isService ? 85 : threshold;

  if (cov.linePct < target) {
    const sev = cov.linePct < 50 ? baseSeverity : lowerSeverity(baseSeverity);
    const rec = cov.linePct < 30
      ? 'Very low coverage. Add basic render/unit tests first.'
      : cov.linePct < 60
        ? 'Add tests covering main functionality and happy paths.'
        : 'Focus on edge cases and error handling paths.';
    gaps.push({ file: fp, type: 'lines', lines: cov.uncoveredLines.slice(0, 20), severity: sev,
      description: `Line coverage at ${cov.linePct.toFixed(1)}% (target: ${target}%)`, recommendation: rec });
  }

  if (cov.branchPct < target - 5) {
    const sev = cov.branchPct < 40 ? baseSeverity : lowerSeverity(baseSeverity);
    gaps.push({ file: fp, type: 'branches', lines: [], severity: sev,
      description: `Branch coverage at ${cov.branchPct.toFixed(1)}%`,
      recommendation: `Add tests for conditional logic. ${cov.uncoveredBranches.length} uncovered branches.` });
  }

  if (cov.fnPct < target) {
    gaps.push({ file: fp, type: 'functions', lines: [], severity: lowerSeverity(baseSeverity),
      description: `Function coverage at ${cov.fnPct.toFixed(1)}%`,
      recommendation: 'Add tests for uncovered functions/methods.' });
  }

  return gaps;
}

function analyze(files, totals, threshold) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  let gaps = [];
  for (const [fp, cov] of Object.entries(files)) gaps.push(...analyzeFile(fp, cov, threshold));
  gaps.sort((a, b) => order[a.severity] - order[b.severity] || b.lines.length - a.lines.length);

  const recs = { critical: [], high: [], medium: [], low: [] };
  for (const g of gaps) recs[g.severity].push({ file: g.file, type: g.type, lines: g.lines.slice(0, 10), description: g.description, recommendation: g.recommendation });

  const linePct = pct(totals.l[0], totals.l[1]);
  const stats = {
    stmtPct: pct(totals.s[0], totals.s[1]),
    branchPct: pct(totals.b[0], totals.b[1]),
    fnPct: pct(totals.f[0], totals.f[1]),
    linePct,
    filesAnalyzed: Object.keys(files).length,
    filesBelowThreshold: Object.values(files).filter(f => f.linePct < threshold).length,
    totalGaps: gaps.length,
    criticalGaps: recs.critical.length,
    meetsThreshold: linePct >= threshold,
    threshold,
  };

  return { gaps, recs, stats };
}

// ---------------------------------------------------------------------------
// Report generators
// ---------------------------------------------------------------------------

function textReport(files, analysis) {
  const { recs, stats } = analysis;
  const { threshold } = stats;
  const lines = [
    '='.repeat(60),
    'COVERAGE ANALYSIS REPORT',
    `Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)}`,
    '='.repeat(60), '',
    'OVERALL COVERAGE:',
    `  Statements: ${stats.stmtPct.toFixed(1)}%`,
    `  Branches:   ${stats.branchPct.toFixed(1)}%`,
    `  Functions:  ${stats.fnPct.toFixed(1)}%`,
    `  Lines:      ${stats.linePct.toFixed(1)}%`, '',
    `Threshold (${threshold}%): ${stats.meetsThreshold ? 'PASS' : 'FAIL'}`,
    `Files analyzed: ${stats.filesAnalyzed}`,
    `Files below threshold: ${stats.filesBelowThreshold}`, '',
  ];

  if (recs.critical.length) {
    lines.push('-'.repeat(60), 'CRITICAL GAPS (requires immediate attention):');
    for (const r of recs.critical.slice(0, 5)) {
      lines.push(`  - ${r.file}`, `    ${r.description}`);
      if (r.lines.length) lines.push(`    Uncovered lines: ${r.lines.slice(0, 5).join(', ')}`);
    }
    lines.push('');
  }

  if (recs.high.length) {
    lines.push('-'.repeat(60), 'HIGH PRIORITY GAPS:');
    for (const r of recs.high.slice(0, 5)) lines.push(`  - ${r.file}`, `    ${r.description}`);
    lines.push('');
  }

  const below = Object.entries(files).filter(([, c]) => c.linePct < threshold).sort(([, a], [, b]) => a.linePct - b.linePct);
  if (below.length) {
    lines.push('-'.repeat(60), `FILES BELOW ${threshold}% THRESHOLD:`);
    for (const [fp, cov] of below.slice(0, 10)) lines.push(`  ${cov.linePct.toFixed(1).padStart(5)}%  ${basename(fp)}`);
    if (below.length > 10) lines.push(`  ... and ${below.length - 10} more files`);
    lines.push('');
  }

  const allRecs = [...recs.critical.slice(0, 2), ...recs.high.slice(0, 2), ...recs.medium.slice(0, 2)].slice(0, 5);
  lines.push('-'.repeat(60), 'RECOMMENDATIONS:');
  allRecs.forEach((r, i) => lines.push(`  ${i + 1}. ${r.recommendation}`, `     File: ${r.file}`));
  lines.push('', '='.repeat(60));
  return lines.join('\n');
}

function htmlReport(files, analysis) {
  const { recs, stats } = analysis;
  const pass = (v, t) => v >= t ? 'pass' : 'fail';
  const t = stats.threshold;

  const gapRows = [...recs.critical.map(g => [g, 'critical']), ...recs.high.map(g => [g, 'high']), ...recs.medium.slice(0, 5).map(g => [g, 'medium'])]
    .slice(0, 15)
    .map(([g, sev]) => `<tr class="gap-${sev}"><td>${sev.toUpperCase()}</td><td>${basename(g.file)}</td><td>${g.description}</td><td>${g.recommendation}</td></tr>`)
    .join('\n');

  const fileRows = Object.entries(files).sort(([, a], [, b]) => a.linePct - b.linePct).slice(0, 20)
    .map(([fp, c]) => `<tr><td>${basename(fp)}</td><td>${c.stmtPct.toFixed(1)}%</td><td>${c.branchPct.toFixed(1)}%</td><td>${c.fnPct.toFixed(1)}%</td><td>${c.linePct.toFixed(1)}%</td></tr>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Coverage Analysis Report</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:40px}
    .summary{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin:20px 0}
    .stat{background:#f5f5f5;padding:20px;border-radius:8px;text-align:center}
    .stat-value{font-size:2em;font-weight:bold}
    .pass{color:#22c55e}.fail{color:#ef4444}
    table{width:100%;border-collapse:collapse;margin:20px 0}
    th,td{padding:12px;text-align:left;border-bottom:1px solid #ddd}
    th{background:#f5f5f5}
    .gap-critical{background:#fef2f2}.gap-high{background:#fffbeb}
  </style>
</head>
<body>
  <h1>Coverage Analysis Report</h1>
  <p>Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)}</p>
  <div class="summary">
    <div class="stat"><div class="stat-value ${pass(stats.stmtPct, t)}">${stats.stmtPct.toFixed(1)}%</div><div>Statements</div></div>
    <div class="stat"><div class="stat-value ${pass(stats.branchPct, t - 5)}">${stats.branchPct.toFixed(1)}%</div><div>Branches</div></div>
    <div class="stat"><div class="stat-value ${pass(stats.fnPct, t)}">${stats.fnPct.toFixed(1)}%</div><div>Functions</div></div>
    <div class="stat"><div class="stat-value ${pass(stats.linePct, t)}">${stats.linePct.toFixed(1)}%</div><div>Lines</div></div>
  </div>
  <h2>Threshold Status: <span class="${stats.meetsThreshold ? 'pass' : 'fail'}">${stats.meetsThreshold ? 'PASS' : 'FAIL'}</span></h2>
  <p>Target: ${t}% | Files Analyzed: ${stats.filesAnalyzed} | Below Threshold: ${stats.filesBelowThreshold}</p>
  <h2>Coverage Gaps</h2>
  <table>
    <thead><tr><th>Severity</th><th>File</th><th>Issue</th><th>Recommendation</th></tr></thead>
    <tbody>${gapRows}</tbody>
  </table>
  <h2>File Coverage Details</h2>
  <table>
    <thead><tr><th>File</th><th>Statements</th><th>Branches</th><th>Functions</th><th>Lines</th></tr></thead>
    <tbody>${fileRows}</tbody>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));

try {
  console.error(`Analyzing coverage from: ${args.coverage}`);
  const { files, totals } = findAndParse(args.coverage);
  console.error(`Found coverage data for ${Object.keys(files).length} files`);

  const analysis = analyze(files, totals, args.threshold);

  let report;
  if (args.format === 'html') report = htmlReport(files, analysis);
  else if (args.format === 'json') report = JSON.stringify(analysis.stats, null, 2);
  else report = textReport(files, analysis);

  if (args.output) {
    writeFileSync(args.output, report, 'utf8');
    console.error(`Report written to: ${args.output}`);
  } else {
    console.log(report);
  }

  if (args.json && args.format !== 'json') console.log(JSON.stringify(analysis.stats, null, 2));

  if (args.strict && !analysis.stats.meetsThreshold) {
    console.error(`\nFailed: Coverage ${analysis.stats.linePct.toFixed(1)}% below threshold ${args.threshold}%`);
    process.exit(1);
  }
} catch (err) {
  console.error(`Error: ${err.message}`);
  if (args.verbose) console.error(err.stack);
  process.exit(1);
}
