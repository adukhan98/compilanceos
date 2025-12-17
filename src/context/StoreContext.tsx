import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { nanoid } from 'nanoid';
import type {
    AppState,
    AppAction,
    Customer,
    Questionnaire,
    Question,
    Answer,
    Task,
    Obligation,
    Agreement,
} from '../types/index.ts';

const STORAGE_KEY = 'complianceOS_data';

const initialState: AppState = {
    customers: [],
    questionnaires: [],
    answers: [],
    tasks: [],
    obligations: [],
    agreements: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_STATE':
            return action.payload;

        // Customers
        case 'ADD_CUSTOMER':
            return { ...state, customers: [...state.customers, action.payload] };
        case 'UPDATE_CUSTOMER':
            return {
                ...state,
                customers: state.customers.map(c => c.id === action.payload.id ? action.payload : c),
            };
        case 'DELETE_CUSTOMER':
            return {
                ...state,
                customers: state.customers.filter(c => c.id !== action.payload),
                questionnaires: state.questionnaires.filter(q => q.customerId !== action.payload),
                tasks: state.tasks.filter(t => t.customerId !== action.payload),
                obligations: state.obligations.filter(o => o.customerId !== action.payload),
                agreements: state.agreements.filter(a => a.customerId !== action.payload),
            };

        // Questionnaires
        case 'ADD_QUESTIONNAIRE':
            return { ...state, questionnaires: [...state.questionnaires, action.payload] };
        case 'UPDATE_QUESTIONNAIRE':
            return {
                ...state,
                questionnaires: state.questionnaires.map(q => q.id === action.payload.id ? action.payload : q),
            };
        case 'DELETE_QUESTIONNAIRE':
            return {
                ...state,
                questionnaires: state.questionnaires.filter(q => q.id !== action.payload),
            };

        // Answers
        case 'ADD_ANSWER':
            return { ...state, answers: [...state.answers, action.payload] };
        case 'UPDATE_ANSWER':
            return {
                ...state,
                answers: state.answers.map(a => a.id === action.payload.id ? action.payload : a),
            };
        case 'DELETE_ANSWER':
            return { ...state, answers: state.answers.filter(a => a.id !== action.payload) };

        // Tasks
        case 'ADD_TASK':
            return { ...state, tasks: [...state.tasks, action.payload] };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
            };
        case 'DELETE_TASK':
            return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };

        // Obligations
        case 'ADD_OBLIGATION':
            return { ...state, obligations: [...state.obligations, action.payload] };
        case 'UPDATE_OBLIGATION':
            return {
                ...state,
                obligations: state.obligations.map(o => o.id === action.payload.id ? action.payload : o),
            };
        case 'DELETE_OBLIGATION':
            return { ...state, obligations: state.obligations.filter(o => o.id !== action.payload) };

        // Agreements
        case 'ADD_AGREEMENT':
            return { ...state, agreements: [...state.agreements, action.payload] };
        case 'UPDATE_AGREEMENT':
            return {
                ...state,
                agreements: state.agreements.map(a => a.id === action.payload.id ? action.payload : a),
            };
        case 'DELETE_AGREEMENT':
            return { ...state, agreements: state.agreements.filter(a => a.id !== action.payload) };

        default:
            return state;
    }
}

interface StoreContextValue {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;

    // Customer helpers
    addCustomer: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Customer;
    updateCustomer: (customer: Customer) => void;
    deleteCustomer: (id: string) => void;
    getCustomer: (id: string) => Customer | undefined;

    // Questionnaire helpers
    addQuestionnaire: (data: Omit<Questionnaire, 'id' | 'createdAt' | 'updatedAt'>) => Questionnaire;
    updateQuestionnaire: (questionnaire: Questionnaire) => void;
    deleteQuestionnaire: (id: string) => void;
    getQuestionnaire: (id: string) => Questionnaire | undefined;
    getCustomerQuestionnaires: (customerId: string) => Questionnaire[];

    // Question helpers (update within questionnaire)
    updateQuestion: (questionnaireId: string, question: Question) => void;

    // Answer helpers
    addAnswer: (data: Omit<Answer, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Answer;
    updateAnswer: (answer: Answer) => void;
    deleteAnswer: (id: string) => void;
    searchAnswers: (query: string) => Answer[];
    getSuggestedAnswers: (questionText: string) => Answer[];

    // Task helpers
    addTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
    updateTask: (task: Task) => void;
    deleteTask: (id: string) => void;
    getCustomerTasks: (customerId: string) => Task[];

    // Obligation helpers
    addObligation: (data: Omit<Obligation, 'id' | 'createdAt' | 'updatedAt'>) => Obligation;
    updateObligation: (obligation: Obligation) => void;
    deleteObligation: (id: string) => void;
    getCustomerObligations: (customerId: string) => Obligation[];
    getUpcomingObligations: (days: number) => Obligation[];

    // Agreement helpers
    addAgreement: (data: Omit<Agreement, 'id' | 'createdAt' | 'updatedAt'>) => Agreement;
    updateAgreement: (agreement: Agreement) => void;
    deleteAgreement: (id: string) => void;
    getCustomerAgreements: (customerId: string) => Agreement[];
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                dispatch({ type: 'SET_STATE', payload: parsed });
            } catch (e) {
                console.error('Failed to parse saved state:', e);
            }
        }
    }, []);

    // Save to localStorage on state change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const now = () => new Date().toISOString();

    // Customer helpers
    const addCustomer = (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
        const customer: Customer = {
            ...data,
            id: nanoid(),
            createdAt: now(),
            updatedAt: now(),
        };
        dispatch({ type: 'ADD_CUSTOMER', payload: customer });
        return customer;
    };

    const updateCustomer = (customer: Customer) => {
        dispatch({ type: 'UPDATE_CUSTOMER', payload: { ...customer, updatedAt: now() } });
    };

    const deleteCustomer = (id: string) => {
        dispatch({ type: 'DELETE_CUSTOMER', payload: id });
    };

    const getCustomer = (id: string) => state.customers.find(c => c.id === id);

    // Questionnaire helpers
    const addQuestionnaire = (data: Omit<Questionnaire, 'id' | 'createdAt' | 'updatedAt'>) => {
        const questionnaire: Questionnaire = {
            ...data,
            id: nanoid(),
            createdAt: now(),
            updatedAt: now(),
        };
        dispatch({ type: 'ADD_QUESTIONNAIRE', payload: questionnaire });
        return questionnaire;
    };

    const updateQuestionnaire = (questionnaire: Questionnaire) => {
        dispatch({ type: 'UPDATE_QUESTIONNAIRE', payload: { ...questionnaire, updatedAt: now() } });
    };

    const deleteQuestionnaire = (id: string) => {
        dispatch({ type: 'DELETE_QUESTIONNAIRE', payload: id });
    };

    const getQuestionnaire = (id: string) => state.questionnaires.find(q => q.id === id);

    const getCustomerQuestionnaires = (customerId: string) =>
        state.questionnaires.filter(q => q.customerId === customerId);

    // Question helpers
    const updateQuestion = (questionnaireId: string, question: Question) => {
        const questionnaire = state.questionnaires.find(q => q.id === questionnaireId);
        if (questionnaire) {
            const updatedQuestions = questionnaire.questions.map(q =>
                q.id === question.id ? question : q
            );
            updateQuestionnaire({ ...questionnaire, questions: updatedQuestions });
        }
    };

    // Answer helpers
    const addAnswer = (data: Omit<Answer, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
        const answer: Answer = {
            ...data,
            id: nanoid(),
            usageCount: 1,
            createdAt: now(),
            updatedAt: now(),
        };
        dispatch({ type: 'ADD_ANSWER', payload: answer });
        return answer;
    };

    const updateAnswer = (answer: Answer) => {
        dispatch({ type: 'UPDATE_ANSWER', payload: { ...answer, updatedAt: now() } });
    };

    const deleteAnswer = (id: string) => {
        dispatch({ type: 'DELETE_ANSWER', payload: id });
    };

    const searchAnswers = (query: string) => {
        const lowerQuery = query.toLowerCase();
        return state.answers.filter(
            a =>
                a.questionText.toLowerCase().includes(lowerQuery) ||
                a.answerText.toLowerCase().includes(lowerQuery) ||
                a.keywords.some(k => k.toLowerCase().includes(lowerQuery))
        );
    };

    const getSuggestedAnswers = (questionText: string) => {
        const words = questionText.toLowerCase().split(/\s+/).filter(w => w.length > 3);

        return state.answers
            .map(answer => {
                const matchedKeywords = answer.keywords.filter(k =>
                    words.some(w => k.toLowerCase().includes(w) || w.includes(k.toLowerCase()))
                );
                const questionMatch = words.filter(w =>
                    answer.questionText.toLowerCase().includes(w)
                ).length;
                const score = matchedKeywords.length * 2 + questionMatch;
                return { answer, score };
            })
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(({ answer }) => answer);
    };

    // Task helpers
    const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const task: Task = {
            ...data,
            id: nanoid(),
            createdAt: now(),
            updatedAt: now(),
        };
        dispatch({ type: 'ADD_TASK', payload: task });
        return task;
    };

    const updateTask = (task: Task) => {
        dispatch({ type: 'UPDATE_TASK', payload: { ...task, updatedAt: now() } });
    };

    const deleteTask = (id: string) => {
        dispatch({ type: 'DELETE_TASK', payload: id });
    };

    const getCustomerTasks = (customerId: string) =>
        state.tasks.filter(t => t.customerId === customerId);

    // Obligation helpers
    const addObligation = (data: Omit<Obligation, 'id' | 'createdAt' | 'updatedAt'>) => {
        const obligation: Obligation = {
            ...data,
            id: nanoid(),
            createdAt: now(),
            updatedAt: now(),
        };
        dispatch({ type: 'ADD_OBLIGATION', payload: obligation });
        return obligation;
    };

    const updateObligation = (obligation: Obligation) => {
        dispatch({ type: 'UPDATE_OBLIGATION', payload: { ...obligation, updatedAt: now() } });
    };

    const deleteObligation = (id: string) => {
        dispatch({ type: 'DELETE_OBLIGATION', payload: id });
    };

    const getCustomerObligations = (customerId: string) =>
        state.obligations.filter(o => o.customerId === customerId);

    const getUpcomingObligations = (days: number) => {
        const now = new Date();
        const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        return state.obligations
            .filter(o => {
                if (o.status === 'completed') return false;
                const dueDate = new Date(o.dueDate);
                return dueDate >= now && dueDate <= future;
            })
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    };

    // Agreement helpers
    const addAgreement = (data: Omit<Agreement, 'id' | 'createdAt' | 'updatedAt'>) => {
        const agreement: Agreement = {
            ...data,
            id: nanoid(),
            createdAt: now(),
            updatedAt: now(),
        };
        dispatch({ type: 'ADD_AGREEMENT', payload: agreement });
        return agreement;
    };

    const updateAgreement = (agreement: Agreement) => {
        dispatch({ type: 'UPDATE_AGREEMENT', payload: { ...agreement, updatedAt: now() } });
    };

    const deleteAgreement = (id: string) => {
        dispatch({ type: 'DELETE_AGREEMENT', payload: id });
    };

    const getCustomerAgreements = (customerId: string) =>
        state.agreements.filter(a => a.customerId === customerId);

    const value: StoreContextValue = {
        state,
        dispatch,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomer,
        addQuestionnaire,
        updateQuestionnaire,
        deleteQuestionnaire,
        getQuestionnaire,
        getCustomerQuestionnaires,
        updateQuestion,
        addAnswer,
        updateAnswer,
        deleteAnswer,
        searchAnswers,
        getSuggestedAnswers,
        addTask,
        updateTask,
        deleteTask,
        getCustomerTasks,
        addObligation,
        updateObligation,
        deleteObligation,
        getCustomerObligations,
        getUpcomingObligations,
        addAgreement,
        updateAgreement,
        deleteAgreement,
        getCustomerAgreements,
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
