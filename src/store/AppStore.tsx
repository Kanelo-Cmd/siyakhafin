import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ApplicantType = "individual" | "company" | "informal" | "startup";

export interface DocRecord {
  id: string;
  uploaded: boolean;
  fileName?: string;
  extracted?: Record<string, string>;
}

export interface AppUser {
  name: string;
  email: string;
  phone: string;
  verified: boolean;
}

export interface AppState {
  user: AppUser | null;
  applicantType: ApplicantType | null;
  answers: Record<string, string>;
  documents: Record<string, DocRecord>;
  paid: boolean;
}

const STORAGE_KEY = "siyakhafin.v1";

const initialState: AppState = {
  user: null,
  applicantType: null,
  answers: {},
  documents: {},
  paid: false,
};

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState, ...JSON.parse(raw) };
  } catch (e) {
    console.log("Failed to load state", e);
  }
  return initialState;
}

interface AppContextValue {
  state: AppState;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
  setApplicantType: (type: ApplicantType) => void;
  setAnswer: (key: string, value: string) => void;
  uploadDocument: (id: string, extracted: Record<string, string>) => void;
  updateExtracted: (id: string, field: string, value: string) => void;
  removeDocument: (id: string) => void;
  setPaid: (paid: boolean) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: AppContextValue = {
    state,
    setUser: (user) => setState((s) => ({ ...s, user })),
    logout: () => setState((s) => ({ ...s, user: null })),
    setApplicantType: (applicantType) =>
      setState((s) => ({ ...s, applicantType })),
    setAnswer: (key, value) =>
      setState((s) => ({ ...s, answers: { ...s.answers, [key]: value } })),
    uploadDocument: (id, extracted) =>
      setState((s) => ({
        ...s,
        documents: {
          ...s.documents,
          [id]: { id, uploaded: true, fileName: `${id}.pdf`, extracted },
        },
      })),
    updateExtracted: (id, field, value) =>
      setState((s) => ({
        ...s,
        documents: {
          ...s.documents,
          [id]: {
            ...s.documents[id],
            extracted: { ...s.documents[id]?.extracted, [field]: value },
          },
        },
      })),
    removeDocument: (id) =>
      setState((s) => {
        const docs = { ...s.documents };
        delete docs[id];
        return { ...s, documents: docs };
      }),
    setPaid: (paid) => setState((s) => ({ ...s, paid })),
    resetAll: () => setState(initialState),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
