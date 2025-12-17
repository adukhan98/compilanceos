import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Building2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface AddCustomerModalProps {
    onClose: () => void;
}

export function AddCustomerModal({ onClose }: AddCustomerModalProps) {
    const { addCustomer } = useStore();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const customer = addCustomer({
            name: name.trim(),
            industry: industry.trim() || undefined,
            notes: notes.trim() || undefined,
        });

        navigate(`/customers/${customer.id}`);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="flex items-center gap-sm">
                        <Building2 size={20} className="text-accent" />
                        <h2 className="modal-title">Add Customer</h2>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label">Company Name *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Acme Corp"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>

                        <div className="form-group mt-md">
                            <label className="label">Industry</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="SaaS, Healthcare, Finance..."
                                value={industry}
                                onChange={e => setIndustry(e.target.value)}
                            />
                        </div>

                        <div className="form-group mt-md">
                            <label className="label">Notes</label>
                            <textarea
                                className="input textarea"
                                placeholder="Any relevant notes about this customer..."
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
                        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
                            Add Customer
                        </button>
                    </div>
                </form>

                <style>{`
          .form-group {
            display: flex;
            flex-direction: column;
          }
        `}</style>
            </div>
        </div>
    );
}
