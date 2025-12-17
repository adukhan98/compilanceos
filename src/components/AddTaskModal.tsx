import { useState } from 'react';
import { X, CheckSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface AddTaskModalProps {
    customerId: string;
    onClose: () => void;
}

const TASK_TEMPLATES = {
    soc2: [
        { title: 'Enable MFA for all admin accounts', description: 'Ensure multi-factor authentication is enabled for all administrative access.' },
        { title: 'Implement access logging', description: 'Set up comprehensive logging for system access and changes.' },
        { title: 'Create security policy document', description: 'Document your organization\'s security policies and procedures.' },
        { title: 'Configure encryption at rest', description: 'Enable encryption for data stored in databases and file systems.' },
        { title: 'Set up endpoint protection', description: 'Deploy endpoint security software on all company devices.' },
        { title: 'Implement backup procedures', description: 'Configure regular automated backups with off-site storage.' },
        { title: 'Document incident response plan', description: 'Create a plan for responding to security incidents.' },
        { title: 'Conduct security awareness training', description: 'Train employees on security best practices.' },
    ],
    iso27001: [
        { title: 'Define information security policy', description: 'Create a high-level policy approved by management.' },
        { title: 'Conduct risk assessment', description: 'Identify and assess information security risks.' },
        { title: 'Create asset inventory', description: 'Document all information assets and their owners.' },
        { title: 'Implement access control policy', description: 'Define who has access to what information.' },
        { title: 'Set up change management process', description: 'Document procedures for managing system changes.' },
        { title: 'Create business continuity plan', description: 'Plan for maintaining operations during disruptions.' },
    ],
};

export function AddTaskModal({ customerId, onClose }: AddTaskModalProps) {
    const { addTask } = useStore();
    const [mode, setMode] = useState<'custom' | 'template'>('custom');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'soc2' | 'iso27001' | 'general'>('general');
    const [dueDate, setDueDate] = useState('');
    const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

    const handleSubmitCustom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTask({
            customerId,
            title: title.trim(),
            description: description.trim(),
            category,
            status: 'not_started',
            evidence: [],
            dueDate: dueDate || undefined,
        });

        onClose();
    };

    const handleAddTemplates = () => {
        const templates = [
            ...TASK_TEMPLATES.soc2.filter(t => selectedTemplates.includes(`soc2-${t.title}`))
                .map(t => ({ ...t, category: 'soc2' as const })),
            ...TASK_TEMPLATES.iso27001.filter(t => selectedTemplates.includes(`iso-${t.title}`))
                .map(t => ({ ...t, category: 'iso27001' as const })),
        ];

        templates.forEach(t => {
            addTask({
                customerId,
                title: t.title,
                description: t.description,
                category: t.category,
                status: 'not_started',
                evidence: [],
            });
        });

        onClose();
    };

    const toggleTemplate = (id: string) => {
        setSelectedTemplates(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="flex items-center gap-sm">
                        <CheckSquare size={20} className="text-accent" />
                        <h2 className="modal-title">Add Task</h2>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="tab-switch">
                    <button
                        className={`tab-btn ${mode === 'custom' ? 'active' : ''}`}
                        onClick={() => setMode('custom')}
                    >
                        Custom Task
                    </button>
                    <button
                        className={`tab-btn ${mode === 'template' ? 'active' : ''}`}
                        onClick={() => setMode('template')}
                    >
                        From Templates
                    </button>
                </div>

                {mode === 'custom' ? (
                    <form onSubmit={handleSubmitCustom}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="label">Task Title *</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Enable MFA for admin accounts"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="form-group mt-md">
                                <label className="label">Description</label>
                                <textarea
                                    className="input textarea"
                                    placeholder="Describe what needs to be done..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="form-row mt-md">
                                <div className="form-group flex-1">
                                    <label className="label">Category</label>
                                    <select
                                        className="select"
                                        value={category}
                                        onChange={e => setCategory(e.target.value as any)}
                                    >
                                        <option value="general">General</option>
                                        <option value="soc2">SOC 2</option>
                                        <option value="iso27001">ISO 27001</option>
                                    </select>
                                </div>
                                <div className="form-group flex-1">
                                    <label className="label">Due Date</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
                                Add Task
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="modal-body template-body">
                            <div className="template-section">
                                <h4 className="template-title">SOC 2 Tasks</h4>
                                <div className="template-list">
                                    {TASK_TEMPLATES.soc2.map(t => (
                                        <label key={t.title} className="template-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedTemplates.includes(`soc2-${t.title}`)}
                                                onChange={() => toggleTemplate(`soc2-${t.title}`)}
                                            />
                                            <div className="template-content">
                                                <span className="template-name">{t.title}</span>
                                                <span className="template-desc">{t.description}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="template-section mt-lg">
                                <h4 className="template-title">ISO 27001 Tasks</h4>
                                <div className="template-list">
                                    {TASK_TEMPLATES.iso27001.map(t => (
                                        <label key={t.title} className="template-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedTemplates.includes(`iso-${t.title}`)}
                                                onChange={() => toggleTemplate(`iso-${t.title}`)}
                                            />
                                            <div className="template-content">
                                                <span className="template-name">{t.title}</span>
                                                <span className="template-desc">{t.description}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleAddTemplates}
                                disabled={selectedTemplates.length === 0}
                            >
                                Add {selectedTemplates.length} Task{selectedTemplates.length !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                )}

                <style>{`
          .modal-lg {
            max-width: 600px;
          }

          .tab-switch {
            display: flex;
            gap: var(--space-xs);
            padding: 0 var(--space-lg);
            border-bottom: 1px solid var(--color-glass-border);
          }

          .tab-btn {
            padding: var(--space-sm) var(--space-md);
            background: transparent;
            border: none;
            color: var(--color-text-tertiary);
            font-size: var(--text-sm);
            font-weight: var(--font-medium);
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
            transition: all var(--transition-fast);
          }

          .tab-btn:hover {
            color: var(--color-text-secondary);
          }

          .tab-btn.active {
            color: var(--color-accent);
            border-bottom-color: var(--color-accent);
          }

          .form-row {
            display: flex;
            gap: var(--space-md);
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .template-body {
            max-height: 400px;
            overflow-y: auto;
          }

          .template-section {
            margin-bottom: var(--space-md);
          }

          .template-title {
            font-size: var(--text-sm);
            font-weight: var(--font-semibold);
            color: var(--color-text-primary);
            margin-bottom: var(--space-sm);
          }

          .template-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-xs);
          }

          .template-item {
            display: flex;
            align-items: flex-start;
            gap: var(--space-sm);
            padding: var(--space-sm);
            background: var(--color-glass);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: background var(--transition-fast);
          }

          .template-item:hover {
            background: var(--color-glass-hover);
          }

          .template-item input {
            margin-top: 4px;
            cursor: pointer;
          }

          .template-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .template-name {
            font-size: var(--text-sm);
            font-weight: var(--font-medium);
            color: var(--color-text-primary);
          }

          .template-desc {
            font-size: var(--text-xs);
            color: var(--color-text-tertiary);
          }
        `}</style>
            </div>
        </div>
    );
}
