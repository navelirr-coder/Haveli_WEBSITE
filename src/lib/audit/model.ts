import questionData from "@/data/audit-questions.json";
import type { AuditContact, ContactErrors, AnswerValue, AuditAnswer } from "./types";
export const questions = questionData as { id:string; category:string; question:string; options:AnswerValue[] }[];
export const categories = ["strategy", "identity", "stationery", "packaging", "website", "trust"] as const;
export const categoryLabels: Record<string,string> = { strategy:"Business clarity", identity:"Logo & visual look", stationery:"Business material", packaging:"Packaging", website:"Website", trust:"Trust" };
export const scaleLabels: Record<string,string> = { "1":"Not created yet", "2":"2 of 5", "3":"Exists but needs improvement", "4":"4 of 5", "5":"Fully developed and professional" };

// Mirrors the original validateForm rules; no new branching or omitted questions.
export function validateContact(contact: AuditContact): ContactErrors {
  const errors: ContactErrors = {};
  if (contact.name.trim().length < 2 || /^\d+$/.test(contact.name.trim())) errors.name = "Please enter a valid name.";
  if (contact.business.trim().length < 2) errors.business = "Business name required.";
  if (!/^[0-9]{10}$/.test(contact.phone.trim())) errors.phone = "Enter a valid 10-digit phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) errors.email = "Enter a valid email address.";
  if (contact.website.trim() !== "") { try { new URL(contact.website.trim()); } catch { errors.website = "Enter a valid URL (e.g., https://site.com)."; } }
  return errors;
}
export function extractAnswers(values: Record<string,AnswerValue>): AuditAnswer[] {
  return questions.flatMap((question) => values[question.id] ? [{ category:question.category, question:question.question, value:values[question.id] }] : []);
}
export function interpretScore(score: number) {
  if (score <= 20) return "Brand structurally weak";
  if (score <= 40) return "Brand needs major improvement";
  if (score <= 60) return "Brand average";
  if (score <= 80) return "Brand strong";
  return "Brand elite";
}
