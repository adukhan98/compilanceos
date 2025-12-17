import { useState } from 'react';
import { X, FileSignature } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface AddAgreementModalProps {
    customerId: string;
    onClose: () => void;
}

export function AddAgreementModal({ customerId, onClose }: AddAgreementModalProps) {
    const { addAgreement } = useStore();
    const [name, setName] = useState('');
    const [type, setType] = useState<'dpa' | 'nda' | 'msa' | 'sla' | 'other'>('dpa');
    const [status, setStatus] = useState<'draft' | 'pending' | 'active' | 'expired'>('draft');
    const [signedDate, setSignedDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [documentUrl, setDocumentUrl] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        addAgreement({
            customerId,
            name: name.trim(),
            type,
            status,
            signedDate: signedDate || undefined,
            expiryDate: expiryDate || undefined,
            documentUrl: documentUrl.trim() || undefined,
            notes: notes.trim() || undefined,
        });

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="flex items-center gap-sm">
                        <FileSignature size={20} className="text-accent" />
                        <h2 className="modal-title">Add Agreement</h2>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label">Agreement Name *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Data Processing Agreement"
                                value={name}
                                onChange={e => setName(e.target.value)}
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
                                    <option value="dpa">DPA</option>
                                    <option value="nda">NDA</option>
                                    <option value="msa">MSA</option>
                                    <option value="sla">SLA</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group flex-1">
                                <label className="label">Status</label>
                                <select
                                    className="select"
                                    value={status}
                                    onChange={e => setStatus(e.target.value as any)}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row mt-md">
                            <div className="form-group flex-1">
                                <label className="label">Signed Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={signedDate}
                                    onChange={e => setSignedDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group flex-1">
                                <label className="label">Expiry Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={expiryDate}
                                    onChange={e => setExpiryDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group mt-md">
                            <label className="label">Document URL</label>
                            <input
                                type="url"
                                className="input"
                                placeholder="https://docs.google.com/..."
                                value={documentUrl}
                                onChange={e => setDocumentUrl(e.target.value)}
                            />
                        </div>

                        <div className="form-group mt-md">
                            <label className="label">Notes</label>
                            <textarea
                                className="input textarea"
                                placeholder="Any additional notes..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
                            Add Agreement
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
