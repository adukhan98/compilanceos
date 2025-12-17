import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface AddObligationModalProps {
    customerId: string;
    onClose: () => void;
}

export function AddObligationModal({ customerId, onClose }: AddObligationModalProps) {
    const { addObligation } = useStore();
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'soc2_renewal' | 'dpa_renewal' | 'pen_test' | 'security_review' | 'contract_renewal' | 'other'>('other');
    const [dueDate, setDueDate] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !dueDate) return;

        addObligation({
            customerId,
            title: title.trim(),
            type,
            dueDate,
            reminderDays: [30, 7, 1], // Default reminders
            status: 'upcoming',
            notes: notes.trim() || undefined,
        });

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="flex items-center gap-sm">
                        <Calendar size={20} className="text-accent" />
                        <h2 className="modal-title">Add Obligation</h2>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label">Title *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="SOC 2 Report Renewal"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>

                        <div className="form-row mt-md">
                            <div className="form-group flex-1">
                                <label className="label">Type</label>
                                <select
                                    className="select"
                                    value={type}
                                    onChange={e => setType(e.target.value as any)}
                                >
                                    <option value="soc2_renewal">SOC 2 Renewal</option>
                                    <option value="dpa_renewal">DPA Renewal</option>
                                    <option value="pen_test">Penetration Test</option>
                                    <option value="security_review">Security Review</option>
                                    <option value="contract_renewal">Contract Renewal</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group flex-1">
                                <label className="label">Due Date *</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group mt-md">
                            <label className="label">Notes</label>
                            <textarea
                                className="input textarea"
                                placeholder="Any additional notes..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={!title.trim() || !dueDate}>
                            Add Obligation
                        </button>
                    </div>
                </form>

                <style>{`
          .form-row {
            display: flex;
            gap: var(--space-md);
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }
        `}</style>
            </div>
        </div>
    );
}
