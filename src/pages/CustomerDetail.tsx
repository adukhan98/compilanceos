import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    FileText,
    FileSignature,
    CheckSquare,
    Calendar,
    Plus,
    Trash2,
    Clock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { AddQuestionnaireModal } from '../components/AddQuestionnaireModal.tsx';
import { AddTaskModal } from '../components/AddTaskModal.tsx';
import { AddObligationModal } from '../components/AddObligationModal.tsx';
import { AddAgreementModal } from '../components/AddAgreementModal.tsx';

type TabType = 'questionnaires' | 'agreements' | 'tasks' | 'obligations';

export function CustomerDetail() {
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();
    const {
        getCustomer,
        getCustomerQuestionnaires,
        getCustomerAgreements,
        getCustomerTasks,
        getCustomerObligations,
        deleteCustomer,
        deleteQuestionnaire,
        deleteTask,
        deleteObligation,
        deleteAgreement,
        updateTask,
        updateObligation,
    } = useStore();

    const [activeTab, setActiveTab] = useState<TabType>('questionnaires');
    const [showAddQuestionnaire, setShowAddQuestionnaire] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddObligation, setShowAddObligation] = useState(false);
    const [showAddAgreement, setShowAddAgreement] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const customer = getCustomer(customerId!);

    if (!customer) {
        return (
            <div className="empty-state">
                <h2>Customer not found</h2>
                <Link to="/customers" className="btn btn-primary mt-lg">
                    Back to Customers
                </Link>
            </div>
        );
    }

    const questionnaires = getCustomerQuestionnaires(customer.id);
    const agreements = getCustomerAgreements(customer.id);
    const tasks = getCustomerTasks(customer.id);
    const obligations = getCustomerObligations(customer.id);

    const tabs = [
        { id: 'questionnaires' as TabType, label: 'Questionnaires', icon: FileText, count: questionnaires.length },
        { id: 'agreements' as TabType, label: 'Agreements', icon: FileSignature, count: agreements.length },
        { id: 'tasks' as TabType, label: 'Tasks', icon: CheckSquare, count: tasks.length },
        { id: 'obligations' as TabType, label: 'Obligations', icon: Calendar, count: obligations.length },
    ];

    const handleDeleteCustomer = () => {
        deleteCustomer(customer.id);
        navigate('/customers');
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    const getStatusBadge = (status: string) => {
        const statusClasses: Record<string, string> = {
            not_started: 'badge-default',
            in_progress: 'badge-info',
            done: 'badge-success',
            completed: 'badge-success',
            draft: 'badge-default',
            pending: 'badge-warning',
            active: 'badge-success',
            expired: 'badge-error',
            upcoming: 'badge-info',
            due_soon: 'badge-warning',
            overdue: 'badge-error',
        };
        return statusClasses[status] || 'badge-default';
    };

    return (
        <div className="customer-detail">
            {/* Header */}
            <header className="detail-header">
                <div className="header-left">
                    <Link to="/customers" className="back-link">
                        <ArrowLeft size={18} />
                        <span>Customers</span>
                    </Link>
                    <div className="customer-title">
                        <div className="customer-avatar-lg">
                            {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1>{customer.name}</h1>
                            {customer.industry && (
                                <span className="text-secondary text-sm">{customer.industry}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="tabs-container">
                <div className="tabs">
                    {tabs.map(({ id, label, icon: Icon, count }) => (
                        <button
                            key={id}
                            className={`tab ${activeTab === id ? 'active' : ''}`}
                            onClick={() => setActiveTab(id)}
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                            {count > 0 && <span className="tab-count">{count}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'questionnaires' && (
                    <div className="tab-section">
                        <div className="section-actions">
                            <button className="btn btn-primary btn-sm" onClick={() => setShowAddQuestionnaire(true)}>
                                <Plus size={16} />
                                Add Questionnaire
                            </button>
                        </div>
                        {questionnaires.length === 0 ? (
                            <div className="empty-state-small">
                                <FileText size={40} className="text-muted" />
                                <p>No questionnaires yet</p>
                                <button
                                    className="btn btn-primary btn-sm mt-md"
                                    onClick={() => setShowAddQuestionnaire(true)}
                                >
                                    Add First Questionnaire
                                </button>
                            </div>
                        ) : (
                            <div className="items-list">
                                {questionnaires.map(q => {
                                    const progress = q.questions.length
                                        ? Math.round(
                                            (q.questions.filter(q => q.status === 'done').length / q.questions.length) *
                                            100
                                        )
                                        : 0;
                                    return (
                                        <div key={q.id} className="item-card-wrapper">
                                            <Link
                                                to={`/customers/${customer.id}/questionnaires/${q.id}`}
                                                className="item-card"
                                            >
                                                <div className="item-main">
                                                    <h4>{q.name}</h4>
                                                    <div className="item-meta">
                                                        <span>{q.questions.length} questions</span>
                                                        {q.dueDate && <span>Due: {formatDate(q.dueDate)}</span>}
                                                    </div>
                                                </div>
                                                <div className="item-progress">
                                                    <div className="progress-bar" style={{ width: '100px' }}>
                                                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                                                    </div>
                                                    <span className="text-sm text-secondary">{progress}%</span>
                                                </div>
                                            </Link>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteQuestionnaire(q.id);
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'agreements' && (
                    <div className="tab-section">
                        <div className="section-actions">
                            <button className="btn btn-primary btn-sm" onClick={() => setShowAddAgreement(true)}>
                                <Plus size={16} />
                                Add Agreement
                            </button>
                        </div>
                        {agreements.length === 0 ? (
                            <div className="empty-state-small">
                                <FileSignature size={40} className="text-muted" />
                                <p>No agreements yet</p>
                            </div>
                        ) : (
                            <div className="items-list">
                                {agreements.map(a => (
                                    <div key={a.id} className="item-card">
                                        <div className="item-main">
                                            <h4>{a.name}</h4>
                                            <div className="item-meta">
                                                <span className={`badge ${getStatusBadge(a.status)}`}>{a.status.replace('_', ' ')}</span>
                                                <span className="badge badge-default">{a.type.toUpperCase()}</span>
                                                {a.expiryDate && <span>Expires: {formatDate(a.expiryDate)}</span>}
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => deleteAgreement(a.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="tab-section">
                        <div className="section-actions">
                            <button className="btn btn-primary btn-sm" onClick={() => setShowAddTask(true)}>
                                <Plus size={16} />
                                Add Task
                            </button>
                        </div>
                        {tasks.length === 0 ? (
                            <div className="empty-state-small">
                                <CheckSquare size={40} className="text-muted" />
                                <p>No tasks yet</p>
                            </div>
                        ) : (
                            <div className="items-list">
                                {tasks.map(t => (
                                    <div key={t.id} className="item-card">
                                        <div className="item-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={t.status === 'done'}
                                                onChange={() =>
                                                    updateTask({
                                                        ...t,
                                                        status: t.status === 'done' ? 'not_started' : 'done',
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="item-main">
                                            <h4 className={t.status === 'done' ? 'text-line-through' : ''}>
                                                {t.title}
                                            </h4>
                                            <div className="item-meta">
                                                <span className={`badge ${getStatusBadge(t.category)}`}>{t.category}</span>
                                                {t.evidence.length > 0 && (
                                                    <span>{t.evidence.length} evidence</span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => deleteTask(t.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'obligations' && (
                    <div className="tab-section">
                        <div className="section-actions">
                            <button className="btn btn-primary btn-sm" onClick={() => setShowAddObligation(true)}>
                                <Plus size={16} />
                                Add Obligation
                            </button>
                        </div>
                        {obligations.length === 0 ? (
                            <div className="empty-state-small">
                                <Calendar size={40} className="text-muted" />
                                <p>No obligations yet</p>
                            </div>
                        ) : (
                            <div className="items-list">
                                {obligations.map(o => {
                                    const daysUntil = Math.ceil(
                                        (new Date(o.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                                    );
                                    return (
                                        <div key={o.id} className="item-card">
                                            <div className="item-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={o.status === 'completed'}
                                                    onChange={() =>
                                                        updateObligation({
                                                            ...o,
                                                            status: o.status === 'completed' ? 'upcoming' : 'completed',
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="item-main">
                                                <h4>{o.title}</h4>
                                                <div className="item-meta">
                                                    <span className={`badge ${getStatusBadge(o.type)}`}>
                                                        {o.type.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className="flex items-center gap-xs">
                                                        <Clock size={12} />
                                                        {formatDate(o.dueDate)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="item-due">
                                                <span
                                                    className={`badge ${daysUntil < 0
                                                        ? 'badge-error'
                                                        : daysUntil <= 7
                                                            ? 'badge-warning'
                                                            : 'badge-info'
                                                        }`}
                                                >
                                                    {daysUntil < 0
                                                        ? `${Math.abs(daysUntil)} days overdue`
                                                        : `${daysUntil} days`}
                                                </span>
                                            </div>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => deleteObligation(o.id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAddQuestionnaire && (
                <AddQuestionnaireModal
                    customerId={customer.id}
                    onClose={() => setShowAddQuestionnaire(false)}
                />
            )}
            {showAddTask && (
                <AddTaskModal customerId={customer.id} onClose={() => setShowAddTask(false)} />
            )}
            {showAddObligation && (
                <AddObligationModal customerId={customer.id} onClose={() => setShowAddObligation(false)} />
            )}
            {showAddAgreement && (
                <AddAgreementModal customerId={customer.id} onClose={() => setShowAddAgreement(false)} />
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Customer</h2>
                        </div>
                        <div className="modal-body">
                            <p>
                                Are you sure you want to delete <strong>{customer.name}</strong>? This will also
                                delete all questionnaires, tasks, and obligations associated with this customer.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={handleDeleteCustomer}>
                                Delete Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .customer-detail {
          max-width: 1000px;
          margin: 0 auto;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-xl);
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--color-text-tertiary);
          text-decoration: none;
          font-size: var(--text-sm);
          transition: color var(--transition-fast);
        }

        .back-link:hover {
          color: var(--color-text-primary);
        }

        .customer-title {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .customer-avatar-lg {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-xl);
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: white;
        }

        .customer-title h1 {
          font-size: var(--text-2xl);
          margin: 0;
        }

        .tabs-container {
          margin-bottom: var(--space-lg);
        }

        .tab-count {
          background: var(--color-bg-elevated);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
        }

        .tab.active .tab-count {
          background: rgba(99, 102, 241, 0.3);
        }

        .tab-content {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-glass-border);
          border-radius: var(--radius-xl);
          padding: var(--space-lg);
        }

        .tab-section {
          min-height: 300px;
        }

        .section-actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: var(--space-md);
        }

        .empty-state-small {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-3xl);
          text-align: center;
        }

        .empty-state-small p {
          margin-top: var(--space-sm);
          color: var(--color-text-tertiary);
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .item-card-wrapper {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .item-card-wrapper .item-card {
          flex: 1;
        }

        .item-card {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--color-glass);
          border: 1px solid var(--color-glass-border);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .item-card:hover {
          background: var(--color-glass-hover);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .item-checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .item-main {
          flex: 1;
          min-width: 0;
        }

        .item-main h4 {
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--color-text-primary);
          margin: 0 0 4px 0;
        }

        .text-line-through {
          text-decoration: line-through;
          color: var(--color-text-tertiary);
        }

        .item-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
        }

        .item-progress {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .item-due {
          margin-left: auto;
        }
      `}</style>
        </div>
    );
}
