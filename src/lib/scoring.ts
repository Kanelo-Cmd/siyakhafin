import type { AppState } from "@/store/AppStore";
import {
  docsForType,
  questionsForType,
  LENDERS,
  type Lender,
} from "@/lib/mockData";

export type Rating = "Low" | "Medium" | "High";

export interface ScoreItem {
  key: string;
  label: string;
  value: number;
  hint: string;
}

const clamp = (n: number) => Math.max(4, Math.min(99, Math.round(n)));

export interface Scores {
  completion: number;
  readiness: number;
  rating: Rating;
  ratingColor: string;
  uploadedDocs: number;
  totalDocs: number;
  answeredQuestions: number;
  totalQuestions: number;
  missingDocs: number;
  generatedDocs: number;
  items: ScoreItem[];
  fraudRisk: number;
}

export function ratingFrom(v: number): Rating {
  if (v < 45) return "Low";
  if (v < 72) return "Medium";
  return "High";
}

export function ratingColor(rating: Rating): string {
  return rating === "High" ? "success" : rating === "Medium" ? "warning" : "danger";
}

export function computeScores(state: AppState): Scores {
  const docs = docsForType(state.applicantType);
  const totalDocs = docs.length;
  const uploadedDocs = docs.filter((d) => state.documents[d.id]?.uploaded).length;

  const questions = questionsForType(state.applicantType);
  const totalQuestions = questions.length + 1; // + applicant type
  const answeredQuestions =
    questions.filter((q) => state.answers[q.id]?.trim()).length +
    (state.applicantType ? 1 : 0);

  const docRatio = totalDocs ? uploadedDocs / totalDocs : 0;
  const qRatio = totalQuestions ? answeredQuestions / totalQuestions : 0;

  const completion = clamp(docRatio * 55 + qRatio * 45);

  const has = (id: string) => !!state.documents[id]?.uploaded;
  const financialSignal =
    (has("afs") ? 1 : 0) +
    (has("bank_statements") ? 1 : 0) +
    (has("mgmt_accounts") ? 1 : 0);

  const readiness = clamp(docRatio * 58 + qRatio * 34 + financialSignal * 3);
  const rating = ratingFrom(readiness);

  const items: ScoreItem[] = [
    {
      key: "evidence",
      label: "Evidence Confidence",
      value: clamp(docRatio * 90 + 8),
      hint: "How well your documents back up your claims.",
    },
    {
      key: "affordability",
      label: "Affordability",
      value: clamp(financialSignal * 22 + qRatio * 30 + 18),
      hint: "Whether cashflow can comfortably carry repayments.",
    },
    {
      key: "repayment",
      label: "Repayment Capacity",
      value: clamp((has("bank_statements") ? 40 : 12) + docRatio * 40 + 10),
      hint: "Your proven ability to service debt on time.",
    },
    {
      key: "financial_health",
      label: "Financial Health",
      value: clamp((has("afs") ? 45 : 15) + financialSignal * 12 + 10),
      hint: "Profitability, assets vs liabilities strength.",
    },
    {
      key: "cashflow",
      label: "Cashflow Quality",
      value: clamp((has("bank_statements") ? 48 : 14) + docRatio * 30 + 8),
      hint: "Stability and consistency of money in and out.",
    },
    {
      key: "stability",
      label: "Business Stability",
      value: clamp(
        (Number(state.answers.years_trading) || 0) * 8 + qRatio * 40 + 12
      ),
      hint: "Trading history and operational maturity.",
    },
    {
      key: "docs",
      label: "Document Completeness",
      value: clamp(docRatio * 100),
      hint: "Share of required documents provided.",
    },
    {
      key: "approval",
      label: "Approval Probability",
      value: clamp(readiness + 4),
      hint: "Estimated likelihood of a lender saying yes.",
    },
  ];

  return {
    completion,
    readiness,
    rating,
    ratingColor: ratingColor(rating),
    uploadedDocs,
    totalDocs,
    answeredQuestions,
    totalQuestions,
    missingDocs: totalDocs - uploadedDocs,
    generatedDocs: Math.min(14, Math.round(qRatio * 9 + docRatio * 5)),
    items,
    fraudRisk: clamp(18 - docRatio * 12),
  };
}

export interface LenderMatch extends Lender {
  approval: number;
  reasons: string[];
}

export function matchLenders(state: AppState, scores: Scores): LenderMatch[] {
  const product = state.answers.funding_product;
  return LENDERS.map((l) => {
    const productMatch = product ? l.products.includes(product) : false;
    let approval = scores.readiness + l.bias + (productMatch ? 8 : -6);
    if (scores.readiness < l.minReadiness) approval -= 18;
    approval = clamp(approval);

    const reasons: string[] = [];
    if (productMatch) reasons.push(`Offers ${product}`);
    if (scores.readiness >= l.minReadiness)
      reasons.push("Meets minimum readiness threshold");
    else reasons.push("Below their usual readiness threshold");
    reasons.push(l.focus);

    return { ...l, approval, reasons };
  })
    .sort((a, b) => b.approval - a.approval);
}

export function coachTips(state: AppState, scores: Scores): string[] {
  const tips: string[] = [];
  const has = (id: string) => !!state.documents[id]?.uploaded;
  if (!has("bank_statements"))
    tips.push("Upload 3–6 months of bank statements to prove repayment ability.");
  if (!has("afs") && !has("mgmt_accounts"))
    tips.push("Add financial statements or management accounts to lift affordability.");
  if ((Number(state.answers.years_trading) || 0) < 2)
    tips.push("Build more trading history — even 6 more months strengthens your case.");
  if (scores.readiness < 45 && state.answers.funding_amount)
    tips.push("Consider reducing your requested amount to match current affordability.");
  if (state.applicantType === "informal")
    tips.push("Register your business at CIPC to unlock bank and DFI funding.");
  if (!state.answers.collateral)
    tips.push("Identify collateral or a signed contract to secure the facility.");
  if (tips.length === 0)
    tips.push("Strong profile — proceed to lender matching and submission.");
  return tips;
}
