// ComplianceOS - Core Data Types

export interface Customer {
  id: string;
  name: string;
  logo?: string;
  industry?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Questionnaire {
  id: string;
  customerId: string;
  name: string;
  dueDate?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  category?: string;
  owner?: string;
  dueDate?: string;
  status: 'not_started' | 'in_progress' | 'done';
  answer?: string;
  isFinal: boolean;
}

export interface Answer {
  id: string;
  questionText: string;
  answerText: string;
  keywords: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  customerId?: string; // null = global task
  title: string;
  description: string;
  category: 'soc2' | 'iso27001' | 'general';
  status: 'not_started' | 'in_progress' | 'done';
  evidence: Evidence[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  type: 'link' | 'file' | 'screenshot';
  title: string;
  url: string;
  addedAt: string;
}

export interface Obligation {
  id: string;
  customerId: string;
  title: string;
  type: 'soc2_renewal' | 'dpa_renewal' | 'pen_test' | 'security_review' | 'contract_renewal' | 'other';
  dueDate: string;
  reminderDays: number[];
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agreement {
  id: string;
  customerId: string;
  name: string;
  type: 'dpa' | 'nda' | 'msa' | 'sla' | 'other';
  status: 'draft' | 'pending' | 'active' | 'expired';
  signedDate?: string;
  expiryDate?: string;
  documentUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Store state type
export interface AppState {
  customers: Customer[];
  questionnaires: Questionnaire[];
  answers: Answer[];
  tasks: Task[];
  obligations: Obligation[];
  agreements: Agreement[];
}

// Action types for reducer
export type AppAction =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'ADD_QUESTIONNAIRE'; payload: Questionnaire }
  | { type: 'UPDATE_QUESTIONNAIRE'; payload: Questionnaire }
  | { type: 'DELETE_QUESTIONNAIRE'; payload: string }
  | { type: 'ADD_ANSWER'; payload: Answer }
  | { type: 'UPDATE_ANSWER'; payload: Answer }
  | { type: 'DELETE_ANSWER'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_OBLIGATION'; payload: Obligation }
  | { type: 'UPDATE_OBLIGATION'; payload: Obligation }
  | { type: 'DELETE_OBLIGATION'; payload: string }
  | { type: 'ADD_AGREEMENT'; payload: Agreement }
  | { type: 'UPDATE_AGREEMENT'; payload: Agreement }
  | { type: 'DELETE_AGREEMENT'; payload: string };
