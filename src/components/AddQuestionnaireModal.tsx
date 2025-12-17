import { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useStore } from '../context/StoreContext.tsx';
import type { Question } from '../types/index.ts';

interface AddQuestionnaireModalProps {
    customerId: string;
    onClose: () => void;
}

export function AddQuestionnaireModal({ customerId, onClose }: AddQuestionnaireModalProps) {
    const { addQuestionnaire } = useStore();
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [questionsText, setQuestionsText] = useState('');

    const parseQuestions = (text: string): Question[] => {
        if (!text.trim()) return [];

        const lines = text.split('\n').filter(line => line.trim());

        return lines.map(line => {
            // Remove common numbering patterns like "1.", "1)", "Q1:", etc.
            const cleanedLine = line.trim().replace(/^(\d+[\.\)\:]|\s*Q\d+[\.\:]\s*)/i, '').trim();

            return {
                id: nanoid(),
                text: cleanedLine,
                status: 'not_started' as const,
                isFinal: false,
            };
        }).filter(q => q.text.length > 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const questions = parseQuestions(questionsText);

        addQuestionnaire({
            customerId,
            name: name.trim(),
            dueDate: dueDate || undefined,
            status: 'not_started',
            questions,
        });

        onClose();
    };

    const previewQuestions = parseQuestions(questionsText);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="flex items-center gap-sm">
                        <FileText size={20} className="text-accent" />
                        <h2 className="modal-title">Add Questionnaire</h2>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label className="label">Questionnaire Name *</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Security Assessment Q4 2024"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Due Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group mt-md">
                            <label className="label">Paste Questions (one per line)</label>
                            <textarea
                                className="input textarea"
                                placeholder="1. Do you have a security policy?
2. Is MFA enabled for all admin accounts?
3. How often do you conduct security training?
..."
                                value={questionsText}
                                onChange={e => setQuestionsText(e.target.value)}
                                rows={8}
                            />
                            <p className="text-xs text-tertiary mt-xs">
                                Paste your questions, each on a new line. Numbering will be automatically removed.
                            </p>
                        </div>

                        {previewQuestions.length > 0 && (
                            <div className="preview-section mt-md">
                                <h4 className="text-sm font-medium mb-sm">
                                    Preview ({previewQuestions.length} questions)
                                </h4>
                                <div className="preview-list">
                                    {previewQuestions.slice(0, 5).map((q, i) => (
                                        <div key={i} className="preview-item">
                                            <span className="preview-num">{i + 1}</span>
                                            <span className="preview-text">{q.text}</span>
                                        </div>
                                    ))}
                                    {previewQuestions.length > 5 && (
                                        <p className="text-xs text-tertiary">
                                            ...and {previewQuestions.length - 5} more questions
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
                            Add Questionnaire
                        </button>
                    </div>
                </form>

                <style>{`
          .modal-lg {
            max-width: 600px;
          }

          .form-row {
            display: flex;
            gap: var(--space-md);
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .preview-section {
            background: var(--color-bg-tertiary);
            border-radius: var(--radius-md);
            padding: var(--space-md);
          }

          .preview-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-xs);
          }

          .preview-item {
            display: flex;
            align-items: flex-start;
            gap: var(--space-sm);
            font-size: var(--text-sm);
          }

          .preview-num {
            min-width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-accent-muted);
            color: var(--color-accent);
            border-radius: var(--radius-full);
            font-size: var(--text-xs);
            font-weight: var(--font-medium);
          }

          .preview-text {
            color: var(--color-text-secondary);
            line-height: 24px;
          }
        `}</style>
            </div>
        </div>
    );
}
