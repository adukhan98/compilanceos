import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

type FilterType = 'all' | 'upcoming' | 'due_soon' | 'overdue' | 'completed';

export function Timeline() {
  const { state, getCustomer, updateObligation } = useStore();
  const { obligations } = state;
  const [filter, setFilter] = useState<FilterType>('all');

  // Calculate status for each obligation based on date
  const obligationsWithStatus = obligations.map(o => {
    const daysUntil = Math.ceil(
      (new Date(o.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    let calculatedStatus = o.status;
    if (o.status !== 'completed') {
      if (daysUntil < 0) calculatedStatus = 'overdue';
      else if (daysUntil <= 7) calculatedStatus = 'due_soon';
      else calculatedStatus = 'upcoming';
    }

    return { ...o, daysUntil, calculatedStatus };
  });

  const filteredObligations = obligationsWithStatus
    .filter(o => filter === 'all' || o.calculatedStatus === filter)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const stats = {
    total: obligations.length,
    overdue: obligationsWithStatus.filter(o => o.calculatedStatus === 'overdue').length,
    dueSoon: obligationsWithStatus.filter(o => o.calculatedStatus === 'due_soon').length,
    upcoming: obligationsWithStatus.filter(o => o.calculatedStatus === 'upcoming').length,
    completed: obligationsWithStatus.filter(o => o.calculatedStatus === 'completed').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertTriangle size={16} className="text-error" />;
      case 'due_soon':
        return <Clock size={16} className="text-warning" />;
      case 'completed':
        return <CheckCircle2 size={16} className="text-success" />;
      default:
        return <Calendar size={16} className="text-info" />;
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="timeline-page">
      <header className="page-header">
        <div>
          <h1>Timeline</h1>
          <p className="text-secondary mt-sm">Track all your compliance deadlines</p>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-row">
        <button
          className={`stat-card ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </button>
        <button
          className={`stat-card stat-error ${filter === 'overdue' ? 'active' : ''}`}
          onClick={() => setFilter('overdue')}
        >
          <span className="stat-value">{stats.overdue}</span>
          <span className="stat-label">Overdue</span>
        </button>
        <button
          className={`stat-card stat-warning ${filter === 'due_soon' ? 'active' : ''}`}
          onClick={() => setFilter('due_soon')}
        >
          <span className="stat-value">{stats.dueSoon}</span>
          <span className="stat-label">Due Soon</span>
        </button>
        <button
          className={`stat-card stat-info ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          <span className="stat-value">{stats.upcoming}</span>
          <span className="stat-label">Upcoming</span>
        </button>
        <button
          className={`stat-card stat-success ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </button>
      </div>

      {/* Timeline */}
      {filteredObligations.length === 0 ? (
        <div className="empty-state">
          <Calendar className="empty-state-icon" />
          <h3 className="empty-state-title">No obligations found</h3>
          <p className="empty-state-description">
            {filter !== 'all'
              ? 'No obligations match this filter'
              : 'Add obligations to customers to track deadlines'}
          </p>
        </div>
      ) : (
        <div className="timeline-list">
          {filteredObligations.map(obligation => {
            const customer = getCustomer(obligation.customerId);
            return (
              <div
                key={obligation.id}
                className={`timeline-item status-${obligation.calculatedStatus}`}
              >
                <div className="timeline-marker">
                  {getStatusIcon(obligation.calculatedStatus)}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3>{obligation.title}</h3>
                    <span className={`badge status-${obligation.calculatedStatus}`}>
                      {obligation.daysUntil < 0
                        ? `${Math.abs(obligation.daysUntil)} days overdue`
                        : obligation.daysUntil === 0
                          ? 'Due today'
                          : `${obligation.daysUntil} days`}
                    </span>
                  </div>
                  <div className="timeline-meta">
                    <span className="meta-date">
                      <Calendar size={12} />
                      {formatDate(obligation.dueDate)}
                    </span>
                    <span className={`badge badge-${obligation.type}`}>
                      {obligation.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {customer && (
                    <Link to={`/customers/${customer.id}`} className="timeline-customer">
                      <Building2 size={14} />
                      <span>{customer.name}</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}
                  {obligation.notes && (
                    <p className="timeline-notes">{obligation.notes}</p>
                  )}
                  <div className="timeline-actions">
                    {obligation.status !== 'completed' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          updateObligation({ ...obligation, status: 'completed' })
                        }
                      >
                        <CheckCircle2 size={14} />
                        Mark Complete
                      </button>
                    )}
                    {obligation.status === 'completed' && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() =>
                          updateObligation({ ...obligation, status: 'upcoming' })
                        }
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .timeline-page {
          max-width: 800px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: var(--space-xl);
        }

        .stats-row {
          display: flex;
          gap: var(--space-sm);
          margin-bottom: var(--space-xl);
          overflow-x: auto;
          padding-bottom: var(--space-sm);
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-glass-border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
          min-width: 90px;
        }

        .stat-card:hover {
          background: var(--color-bg-tertiary);
        }

        .stat-card.active {
          border-color: var(--color-accent);
          background: var(--color-accent-muted);
        }

        .stat-value {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--color-text-primary);
        }

        .stat-label {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
        }

        .stat-error .stat-value { color: var(--color-error); }
        .stat-warning .stat-value { color: var(--color-warning); }
        .stat-info .stat-value { color: var(--color-info); }
        .stat-success .stat-value { color: var(--color-success); }

        .timeline-list {
          display: flex;
          flex-direction: column;
        }

        .timeline-item {
          display: flex;
          gap: var(--space-md);
          padding: var(--space-lg) 0;
          border-bottom: 1px solid var(--color-glass-border);
        }

        .timeline-item:last-child {
          border-bottom: none;
        }

        .timeline-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: var(--color-bg-secondary);
          border: 2px solid var(--color-glass-border);
          border-radius: var(--radius-full);
          flex-shrink: 0;
        }

        .timeline-item.status-overdue .timeline-marker {
          border-color: var(--color-error);
          background: var(--color-error-muted);
        }

        .timeline-item.status-due_soon .timeline-marker {
          border-color: var(--color-warning);
          background: var(--color-warning-muted);
        }

        .timeline-item.status-upcoming .timeline-marker {
          border-color: var(--color-info);
          background: var(--color-info-muted);
        }

        .timeline-item.status-completed .timeline-marker {
          border-color: var(--color-success);
          background: var(--color-success-muted);
        }

        .timeline-content {
          flex: 1;
          min-width: 0;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-sm);
          margin-bottom: var(--space-xs);
        }

        .timeline-header h3 {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          margin: 0;
        }

        .timeline-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .meta-date {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
        }

        .timeline-customer {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-xs) var(--space-sm);
          background: var(--color-glass);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: var(--text-xs);
          transition: all var(--transition-fast);
          margin-bottom: var(--space-sm);
        }

        .timeline-customer:hover {
          background: var(--color-glass-hover);
          color: var(--color-text-primary);
        }

        .timeline-notes {
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
          margin: 0 0 var(--space-sm) 0;
        }

        .timeline-actions {
          display: flex;
          gap: var(--space-sm);
        }

        @media (max-width: 640px) {
          .stats-row {
            gap: var(--space-xs);
          }

          .stat-card {
            padding: var(--space-sm);
            min-width: 70px;
          }

          .timeline-header {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
