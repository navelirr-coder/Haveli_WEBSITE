import type { AuditAnswer, DiagnosticItem } from "./types";
export function calculateScore(answers: AuditAnswer[]): number;
export function generateGapSummary(answers: AuditAnswer[]): string;
export function generateDiagnosticReport(answers: AuditAnswer[]): DiagnosticItem[];
