export type AnswerValue = "yes" | "no" | "1" | "2" | "3" | "4" | "5";
export interface AuditAnswer { category: string; question: string; value: AnswerValue }
export interface AuditContact { name: string; business: string; phone: string; email: string; website: string }
export interface DiagnosticItem { question: string; answer: string }
export interface ClientRecord extends AuditContact {
  id?: number; answers: Record<string, AnswerValue>; score: number; gaps: string; diagnosticReport: DiagnosticItem[]; createdAt: string;
}
export type ContactErrors = Partial<Record<keyof AuditContact, string>>;
