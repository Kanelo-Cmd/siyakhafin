import type { ApplicantType } from "@/store/AppStore";

/* ----------------------------- Applicant types ---------------------------- */

export const APPLICANT_TYPES: {
  id: ApplicantType;
  title: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: "individual",
    title: "As an Individual",
    desc: "Sole trader or personal application",
    icon: "User",
  },
  {
    id: "company",
    title: "Registered Company",
    desc: "CIPC registered (Pty) Ltd, CC or NPC",
    icon: "Building2",
  },
  {
    id: "informal",
    title: "Informal Business",
    desc: "Trading but not yet registered",
    icon: "Store",
  },
  {
    id: "startup",
    title: "Start-up",
    desc: "Early stage with limited trading history",
    icon: "Rocket",
  },
];

/* ------------------------------- Documents -------------------------------- */

export interface DocDef {
  id: string;
  label: string;
  category: "compliance" | "financial" | "supporting";
  generatable: boolean; // compliance = false
  appliesTo?: ApplicantType[];
  /** Mock OCR extraction returned when "uploaded" */
  extract: Record<string, string>;
}

export const DOCUMENTS: DocDef[] = [
  {
    id: "sa_id",
    label: "South African ID",
    category: "compliance",
    generatable: false,
    extract: {
      "ID Number": "8501015800083",
      Gender: "Male",
      "Date of Birth": "1985-01-01",
      Names: "Thabo Sipho Nkosi",
    },
  },
  {
    id: "proof_address",
    label: "Proof of Address",
    category: "compliance",
    generatable: false,
    extract: {
      "Address": "42 Vilakazi Street, Soweto",
      Province: "Gauteng",
      Municipality: "City of Johannesburg",
    },
  },
  {
    id: "cipc",
    label: "CIPC Registration",
    category: "compliance",
    generatable: false,
    appliesTo: ["company", "startup"],
    extract: {
      "Company Registration Number": "2019/451233/07",
      "Registration Date": "2019-03-14",
      Directors: "Thabo Nkosi, Lerato Nkosi",
    },
  },
  {
    id: "tax_reg",
    label: "Tax Registration (SARS)",
    category: "compliance",
    generatable: false,
    extract: {
      "Tax Number": "9012345678",
      "Tax Type": "Income Tax",
    },
  },
  {
    id: "vat_reg",
    label: "VAT Registration",
    category: "compliance",
    generatable: false,
    appliesTo: ["company"],
    extract: { "VAT Number": "4560123789" },
  },
  {
    id: "tax_clearance",
    label: "Tax Compliance Status",
    category: "compliance",
    generatable: false,
    extract: { Status: "Compliant", "Valid Until": "2026-12-31" },
  },
  {
    id: "bee",
    label: "BEE Certificate (optional)",
    category: "compliance",
    generatable: false,
    extract: { "BEE Level": "Level 1", "Black Ownership": "100%" },
  },
  {
    id: "bank_confirmation",
    label: "Business Banking Confirmation",
    category: "compliance",
    generatable: false,
    extract: { Bank: "FNB", "Account Type": "Gold Business Account" },
  },
  {
    id: "afs",
    label: "Annual Financial Statements",
    category: "financial",
    generatable: true,
    extract: {
      "Annual Revenue": "R 4,850,000",
      "Net Profit": "R 612,000",
      "Total Assets": "R 2,100,000",
      "Total Liabilities": "R 780,000",
    },
  },
  {
    id: "mgmt_accounts",
    label: "Management Accounts",
    category: "financial",
    generatable: true,
    extract: {
      "YTD Revenue": "R 2,940,000",
      "YTD Expenses": "R 2,310,000",
      "YTD Profit": "R 630,000",
    },
  },
  {
    id: "bank_statements",
    label: "Bank Statements (3–6 months)",
    category: "financial",
    generatable: false,
    extract: {
      "Avg Monthly Deposits": "R 402,000",
      "Avg Monthly Withdrawals": "R 355,000",
      "Returned Debit Orders": "1",
      "Debt Servicing": "On time",
    },
  },
  {
    id: "purchase_orders",
    label: "Purchase Orders",
    category: "supporting",
    generatable: false,
    extract: { "PO Value": "R 1,200,000", Buyer: "Shoprite Holdings" },
  },
  {
    id: "contracts",
    label: "Signed Contracts",
    category: "supporting",
    generatable: false,
    extract: { "Contract Value": "R 3,600,000", Term: "24 months" },
  },
  {
    id: "invoices",
    label: "Invoices / Quotations",
    category: "supporting",
    generatable: false,
    extract: { "Total Outstanding": "R 540,000" },
  },
  {
    id: "lease",
    label: "Lease / Asset Register",
    category: "supporting",
    generatable: false,
    extract: { Premises: "Owned", "Asset Value": "R 950,000" },
  },
];

export function docsForType(type: ApplicantType | null): DocDef[] {
  return DOCUMENTS.filter((d) => !d.appliesTo || (type && d.appliesTo.includes(type)));
}

/* -------------------------------- Questions -------------------------------- */

export interface Question {
  id: string;
  label: string;
  hint?: string;
  type: "text" | "number" | "select" | "textarea";
  options?: string[];
  section: "business" | "funding";
  appliesTo?: ApplicantType[];
}

export const PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

export const FUNDING_PRODUCTS = [
  "Working Capital",
  "Purchase Order Finance",
  "Contract Finance",
  "Invoice Finance",
  "Asset Finance",
  "Equipment Finance",
  "Vehicle Finance",
  "Expansion Finance",
  "Agriculture Finance",
  "Trade Finance",
  "Bridging Finance",
  "Stock Finance",
];

export const QUESTIONS: Question[] = [
  {
    id: "industry",
    label: "Which industry are you in?",
    type: "select",
    section: "business",
    options: [
      "Retail",
      "Manufacturing",
      "Construction",
      "Agriculture",
      "Transport & Logistics",
      "Professional Services",
      "Hospitality",
      "Technology",
      "Wholesale",
    ],
  },
  {
    id: "activities",
    label: "Describe your main business activities",
    hint: "In one or two short sentences",
    type: "textarea",
    section: "business",
  },
  {
    id: "years_trading",
    label: "How many years have you been trading?",
    type: "number",
    section: "business",
  },
  {
    id: "employees",
    label: "How many employees do you have?",
    type: "number",
    section: "business",
  },
  {
    id: "business_model",
    label: "How does your business make money?",
    hint: "e.g. sell products to retailers, deliver services on contract",
    type: "textarea",
    section: "business",
  },
  {
    id: "customers",
    label: "Who are your main customers?",
    type: "text",
    section: "business",
  },
  {
    id: "suppliers",
    label: "Who are your major suppliers?",
    type: "text",
    section: "business",
  },
  {
    id: "competitors",
    label: "Who are your main competitors?",
    type: "text",
    section: "business",
  },
  {
    id: "funding_product",
    label: "What type of funding do you need?",
    type: "select",
    section: "funding",
    options: FUNDING_PRODUCTS,
  },
  {
    id: "funding_amount",
    label: "How much funding do you need? (Rand)",
    type: "number",
    section: "funding",
  },
  {
    id: "funding_purpose",
    label: "What will the funding be used for?",
    type: "textarea",
    section: "funding",
  },
  {
    id: "repayment_period",
    label: "Preferred repayment period (months)",
    type: "number",
    section: "funding",
  },
  {
    id: "own_contribution",
    label: "How much can you contribute yourself? (Rand)",
    type: "number",
    section: "funding",
  },
  {
    id: "collateral",
    label: "What collateral or security can you offer?",
    hint: "Property, equipment, contracts, or none",
    type: "text",
    section: "funding",
  },
];

export function questionsForType(type: ApplicantType | null): Question[] {
  return QUESTIONS.filter((q) => !q.appliesTo || (type && q.appliesTo.includes(type)));
}

/* --------------------------------- Lenders --------------------------------- */

export interface Lender {
  id: string;
  name: string;
  type: "Bank" | "Fintech" | "DFI" | "Government";
  focus: string;
  minReadiness: number;
  bias: number; // adjusts approval probability
  products: string[];
}

export const LENDERS: Lender[] = [
  {
    id: "lulalend",
    name: "Lulalend",
    type: "Fintech",
    focus: "Fast working capital for SMEs",
    minReadiness: 35,
    bias: 8,
    products: ["Working Capital", "Bridging Finance", "Stock Finance"],
  },
  {
    id: "bridgement",
    name: "Bridgement",
    type: "Fintech",
    focus: "Invoice & purchase order finance",
    minReadiness: 40,
    bias: 6,
    products: ["Invoice Finance", "Purchase Order Finance", "Working Capital"],
  },
  {
    id: "merchant",
    name: "Merchant Capital",
    type: "Fintech",
    focus: "Revenue-based cash advances",
    minReadiness: 38,
    bias: 5,
    products: ["Working Capital", "Expansion Finance"],
  },
  {
    id: "businesspartners",
    name: "Business Partners",
    type: "DFI",
    focus: "Growth & expansion finance",
    minReadiness: 55,
    bias: 2,
    products: ["Expansion Finance", "Asset Finance", "Contract Finance"],
  },
  {
    id: "sefa",
    name: "Sefa",
    type: "Government",
    focus: "Small enterprise development funding",
    minReadiness: 45,
    bias: 4,
    products: ["Working Capital", "Asset Finance", "Agriculture Finance"],
  },
  {
    id: "idc",
    name: "IDC",
    type: "DFI",
    focus: "Industrial & large-scale funding",
    minReadiness: 65,
    bias: -2,
    products: ["Expansion Finance", "Equipment Finance", "Agriculture Finance"],
  },
  {
    id: "nef",
    name: "NEF",
    type: "Government",
    focus: "Black-owned business empowerment",
    minReadiness: 50,
    bias: 3,
    products: ["Expansion Finance", "Contract Finance", "Asset Finance"],
  },
  {
    id: "fnb",
    name: "FNB Business",
    type: "Bank",
    focus: "Established business lending",
    minReadiness: 60,
    bias: -3,
    products: ["Working Capital", "Vehicle Finance", "Asset Finance", "Trade Finance"],
  },
  {
    id: "nedbank",
    name: "Nedbank SimplyBiz",
    type: "Bank",
    focus: "SME banking & term loans",
    minReadiness: 62,
    bias: -4,
    products: ["Working Capital", "Equipment Finance", "Expansion Finance"],
  },
];

/* ---------------------------- Generated documents -------------------------- */

export const GENERATED_DOCS = [
  "Executive Summary",
  "Company Profile",
  "Business Plan",
  "Funding Motivation Letter",
  "Income Statement",
  "Balance Sheet",
  "Cash Flow Forecast",
  "Financial Ratio Analysis",
  "SWOT Analysis",
  "Industry Analysis",
  "Risk Assessment",
  "Working Capital Assessment",
  "Repayment Analysis",
  "AI Credit Assessment",
];
