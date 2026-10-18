"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { questions, categories, categoryLabels, scaleLabels, validateContact, extractAnswers, interpretScore } from "@/lib/audit/model";
import { calculateScore, generateGapSummary, generateDiagnosticReport } from "@/lib/audit/engine";
import { readyDatabase, saveClientRecord } from "@/lib/audit/database";
import type { AnswerValue, AuditContact, ContactErrors, ClientRecord } from "@/lib/audit/types";
import { AuditAdmin } from "./audit-admin";

const emptyContact: AuditContact = { name:"", business:"", phone:"", email:"", website:"" };
type Phase = "questions" | "loading" | "result";
export function BrandAudit() {
  const [contact, setContact] = useState(emptyContact);
  const [answers, setAnswers] = useState<Record<string,AnswerValue>>({});
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [stepError, setStepError] = useState("");
  const [phase, setPhase] = useState<Phase>("questions");
  const [result, setResult] = useState<ClientRecord | null>(null);
  const [saved, setSaved] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [systemError, setSystemError] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  const saving = useRef(false);
  useEffect(() => { mounted.current=true; return () => { mounted.current=false; if(timer.current) clearTimeout(timer.current); }; }, []);
  useEffect(() => { if (phase !== "loading") heading.current?.focus({ preventScroll:true }); }, [step,phase]);

  const currentCategory = categories[step - 1];
  const currentQuestions = questions.filter((question) => question.category === currentCategory);
  const answered = Object.keys(answers).length;
  function focusPanel() { panel.current?.scrollIntoView({ behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block:"start" }); }
  function changeStep(next: number) { setStepError(""); setStep(next); requestAnimationFrame(focusPanel); }
  function validateStep() {
    if (step === 0) {
      const nextErrors = validateContact(contact); setErrors(nextErrors);
      if (Object.keys(nextErrors).length) { setStepError("Please check your contact details before continuing."); requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus()); return false; }
    } else {
      const missing = currentQuestions.find((question) => !answers[question.id]);
      if (missing) { setStepError("Please answer each question in this section before continuing."); requestAnimationFrame(() => panel.current?.querySelector<HTMLInputElement>(`input[name='${missing.id}']`)?.focus()); return false; }
    }
    return true;
  }
  async function storeRecord(record: ClientRecord) {
    await readyDatabase();
    await saveClientRecord(record);
  }
  async function calculate() {
    if (!validateStep() || saving.current) return;
    const allAnswers = extractAnswers(answers);
    if (allAnswers.length !== questions.length) { setStepError("Please complete all 25 questions."); return; }
    saving.current=true; setPhase("loading"); setSystemError(""); requestAnimationFrame(focusPanel);
    try {
      // Preserve the original six-second diagnostic processing interval.
      await new Promise<void>((resolve) => { timer.current=setTimeout(resolve,6000); });
      if (!mounted.current) return;
      const record: ClientRecord = {
        ...Object.fromEntries(Object.entries(contact).map(([key,value]) => [key,value.trim()])) as unknown as AuditContact,
        answers:{ ...answers }, score:calculateScore(allAnswers), gaps:generateGapSummary(allAnswers), diagnosticReport:generateDiagnosticReport(allAnswers), createdAt:new Date().toISOString(),
      };
      let stored = false;
      try { await storeRecord(record); stored=true; } catch { /* Keep the diagnostic available and offer an explicit save retry. */ }
      if (!mounted.current) return;
      setResult(record); setSaved(stored); setPhase("result"); requestAnimationFrame(focusPanel);
    } catch { if(mounted.current) { setSystemError("The diagnostic couldn’t be completed. Your answers are still here. Please try again."); setPhase("questions"); } }
    finally { saving.current=false; }
  }
  async function retrySave() {
    if (!result || retrying || saved) return;
    setRetrying(true); setSystemError("");
    try { await storeRecord(result); setSaved(true); } catch { setSystemError("Your result is available, but this browser still couldn’t save it. Check that browser storage is enabled."); }
    finally { setRetrying(false); }
  }
  function contactField(key: keyof AuditContact, label: string, type: string, placeholder: string) {
    return <div className={`field ${key === "website" ? "field-full" : ""}`}><label htmlFor={`audit-${key}`}>{label}{key !== "website" ? " *" : " (optional)"}</label><input id={`audit-${key}`} type={type} name={key} value={contact[key]} placeholder={placeholder} onChange={(event) => { setContact((current) => ({ ...current,[key]:event.target.value })); setErrors((current) => ({ ...current,[key]:undefined })); }} required={key !== "website"} maxLength={key === "name" ? 50 : key === "business" ? 100 : key === "phone" ? 10 : undefined} inputMode={key === "phone" ? "numeric" : undefined} autoComplete={key === "business" ? "organization" : key === "phone" ? "tel-national" : key === "website" ? "url" : key} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `audit-error-${key}` : undefined} />{errors[key] && <span className="field-error" id={`audit-error-${key}`}>{errors[key]}</span>}</div>;
  }
  return <MotionConfig reducedMotion="user"><div className="audit-layout section-pad">
    <aside className="audit-sidebar"><span className="eyebrow">Brand diagnostic / Studio Haveli</span><h1>A closer look.<br /><em>A clearer picture.</em></h1><p>25 questions about the brand you have today. Answer honestly; this is a starting point for a better conversation.</p><ol className="audit-chapters">{["Your details",...categories.map((category) => categoryLabels[category])].map((label,index) => <li key={label} aria-current={phase === "questions" && index === step ? "step" : undefined}><span className="chapter-marker" aria-hidden="true">{index < step || phase === "result" ? <Check size={12} aria-hidden="true" /> : null}</span>{label}</li>)}</ol><p className="audit-storage-note">Your result is saved locally in this browser. It is not sent to the studio.</p></aside>
    <div className="audit-panel" ref={panel}>
      <div className="audit-progress-top"><span className="eyebrow">{phase === "result" ? "Your diagnostic" : phase === "loading" ? "Analysing your brand" : `Step ${step + 1} of 7`}</span><span>{phase === "result" ? "Complete" : `${answered} / 25 answered`}</span></div><div className="audit-progress" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={25} aria-valuenow={answered}><motion.div animate={{ width:`${answered / 25 * 100}%` }} transition={{ duration:.25 }} /></div>

      {phase === "loading" && <div className="audit-loading" role="status" aria-live="polite"><LoaderCircle className="loading-icon" size={42} aria-hidden="true" /><h2>Connecting<br /><em>the dots.</em></h2><p>Checking structural integrity of your brand…</p><span className="eyebrow">Your answers are being analysed</span></div>}

      {phase === "questions" && <form noValidate aria-label="Brand diagnostic" onSubmit={(event) => { event.preventDefault(); if(step === 6) void calculate(); else if(validateStep()) changeStep(step + 1); }}>
        <div className="audit-step-heading"><span className="eyebrow">{step === 0 ? "A place to begin" : "Chapter"}</span><h2 ref={heading} tabIndex={-1}>{step === 0 ? "First, an introduction." : categoryLabels[currentCategory]}</h2><p>{step === 0 ? "Tell us whose brand we’re taking a closer look at." : "Choose the answer that best reflects your business today."}</p></div>
        {step === 0 ? <div className="form-grid audit-contact-fields">{contactField("name","Your name","text","Your full name")}{contactField("business","Business name","text","Your business or brand")}{contactField("phone","Phone","tel","10-digit phone number")}{contactField("email","Email","email","you@yourbrand.com")}{contactField("website","Website","url","https://yourwebsite.com")}</div> : <>
          <div className="scale-guide"><span className="eyebrow">For questions with a 1-5 scale</span><p><b>1</b> Not created yet <span>·</span> <b>3</b> Exists but needs improvement <span>·</span> <b>5</b> Fully developed and professional</p></div>
          {currentQuestions.map((question) => <fieldset key={question.id} className="audit-question" id={question.id} data-category={question.category} data-question={question.question}><legend>{question.question}</legend><div className={`audit-options ${question.options.length === 2 ? "binary" : ""}`}>{question.options.map((value) => <label key={value} className="audit-answer"><input type="radio" name={question.id} value={value} checked={answers[question.id] === value} onChange={() => { setAnswers((current) => ({ ...current,[question.id]:value })); setStepError(""); }} required aria-label={value === "yes" ? "Yes" : value === "no" ? "No" : `${value}: ${scaleLabels[value]}`} /><span>{value === "yes" ? "Yes" : value === "no" ? "No" : value}</span>{answers[question.id] === value && <Check size={13} aria-hidden="true" className="answer-check" />}</label>)}</div></fieldset>)}
        </>}
        {(stepError || systemError) && <p className="form-notice" role="alert">{stepError || systemError}</p>}
        <div className="audit-controls">{step > 0 ? <button type="button" className="small-link" onClick={() => changeStep(step - 1)}><ArrowLeft size={15} aria-hidden="true" />Previous</button> : <span className="audit-required-note">* Required fields</span>}<motion.button type="submit" className="pill-button primary" whileTap={{ scale:.97 }}>{step === 6 ? "Check my brand strength" : "Continue"}<ArrowRight size={17} aria-hidden="true" /></motion.button></div>
      </form>}

      {phase === "result" && result && <section className="audit-result" aria-labelledby="result-heading"><span className="eyebrow">{result.business} / Your brand today</span><h2 ref={heading} tabIndex={-1} id="result-heading">Here’s where<br /><em>you stand.</em></h2><div className="result-score" aria-label={`Brand score ${result.score} out of 100`}>{result.score}<span>/ 100</span></div><p className="result-interpretation">{interpretScore(result.score)}</p><div className="result-gaps"><span className="eyebrow">Areas that need work</span><p>{result.gaps === "None" ? "None" : result.gaps}</p><small>Categories with an average response below 3 out of 5.</small></div>
        <div className="result-category-list">{categories.map((category) => { const categoryAnswers = extractAnswers(result.answers).filter((answer) => answer.category === category); const points=calculateScore(categoryAnswers); const max=categoryAnswers.length * 4; return <div key={category}><span>{categoryLabels[category]}</span><div className="category-bar"><span style={{ width:`${points / max * 100}%` }} /></div><strong>{points} / {max}</strong></div>; })}</div>
        <p className="save-status" role="status">{saved ? "Saved locally in this browser. Nothing has been sent to the studio." : "Your result is ready, but it couldn’t be saved in this browser."}</p>{!saved && <button type="button" className="small-link" onClick={retrySave} disabled={retrying}>{retrying ? "Saving…" : "Try saving again"}</button>}{systemError && <p className="form-notice" role="alert">{systemError}</p>}
        <details className="result-details"><summary>See all 25 answers</summary><ol className="report-answers">{result.diagnosticReport.map((item,index) => <li key={index}><span>{item.question}</span><strong data-answer={item.answer}>{item.answer}</strong></li>)}</ol></details>
        <div className="result-next"><h3>What comes next?</h3><p>Use this diagnostic as a starting point. If you’d like to talk through your brand, tell us what you discovered.</p><Link className="pill-button primary" href="/contact">Talk to the studio<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        <button type="button" className="small-link" onClick={() => { setContact(emptyContact); setAnswers({}); setErrors({}); setStepError(""); setSystemError(""); setResult(null); setSaved(false); setStep(0); setPhase("questions"); requestAnimationFrame(focusPanel); }}>Start a new diagnostic<ArrowRight size={14} aria-hidden="true" /></button>
      </section>}
    </div>
  </div><div className="audit-admin-wrap"><AuditAdmin /></div></MotionConfig>;
}
