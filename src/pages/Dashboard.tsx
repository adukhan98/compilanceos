import { Link } from 'react-router-dom';
import {
  Clock,
  FileText,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export function Dashboard() {
  const { state, getUpcomingObligations, getCustomer } = useStore();
  const { customers, questionnaires, tasks, obligations } = state;

  // Calculate stats
  const totalQuestions = questionnaires.reduce((sum, q) => sum + q.questions.length, 0);
  const answeredQuestions = questionnaires.reduce(
    (sum, q) => sum + q.questions.filter(q => q.status === 'done').length,
    0
  );
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  const overdueObligations = obligations.filter(o => {
    if (o.status === 'completed') return false;
    return new Date(o.dueDate) < new Date();
  }).length;

  const upcomingObligations = getUpcomingObligations(60);

  const stats = [
    {
      label: 'Customers',
      value: customers.length,
      icon: Users,
      color: 'var(--color-accent)',
      bg: 'var(--color-accent-muted)',
    },
    {
      label: 'Questions Answered',
      value: `${answeredQuestions}/${totalQuestions}`,
      icon: FileText,
      color: 'var(--color-success)',
      bg: 'var(--color-success-muted)',
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      icon: CheckCircle2,
      color: 'var(--color-warning)',
      bg: 'var(--color-warning-muted)',
    },
    {
      label: 'Overdue Items',
      value: overdueObligations,
      icon: AlertTriangle,
      color: overdueObligations > 0 ? 'var(--color-error)' : 'var(--color-success)',
      bg: overdueObligations > 0 ? 'var(--color-error-muted)' : 'var(--color-success-muted)',
    },
  ];

  const recentQuestionnaires = questionnaires
    .filter(q => q.status !== 'completed')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary mt-sm">Your compliance overview at a glance</p>
        </div>
        <div className="flex items-center gap-sm text-secondary">
          <Clock size={16} />
          <span className="text-sm">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card glass-card">
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={24} style={{ color }} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Upcoming Deadlines */}
        <section className="dashboard-section">
          <div className="section-header">
            <div className="flex items-center gap-sm">
              <Calendar size={20} className="text-accent" />
              <h2>Upcoming Deadlines</h2>
            </div>
            <Link to="/timeline" className="btn btn-ghost btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="section-content">
            {upcomingObligations.length === 0 ? (
              <div className="empty-state-small">
                <CheckCircle2 size={32} className="text-success" />
                <p>No upcoming deadlines in the next 60 days</p>
              </div>
            ) : (
              <ul className="deadline-list">
                {upcomingObligations.slice(0, 5).map(obligation => {
                  const customer = getCustomer(obligation.customerId);
                  const daysUntil = Math.ceil(
                    (new Date(obligation.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <li key={obligation.id} className="deadline-item">
                      <div className="deadline-info">
                        <span className="deadline-title">{obligation.title}</span>
                        <span className="deadline-customer">{customer?.name}</span>
                      </div>
                      <span
                        className={`badge ${daysUntil <= 7 ? 'badge-error' : daysUntil <= 30 ? 'badge-warning' : 'badge-info'
                          }`}
                      >
                        {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* Active Questionnaires */}
        <section className="dashboard-section">
          <div className="section-header">
            <div className="flex items-center gap-sm">
              <TrendingUp size={20} className="text-accent" />
              <h2>Active Questionnaires</h2>
            </div>
            <Link to="/customers" className="btn btn-ghost btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="section-content">
            {recentQuestionnaires.length === 0 ? (
              <div className="empty-state-small">
                <FileText size={32} className="text-muted" />
                <p>No active questionnaires</p>
                <Link to="/customers" className="btn btn-primary btn-sm mt-md">
                  Add Questionnaire
                </Link>
              </div>
            ) : (
              <ul className="questionnaire-list">
                {recentQuestionnaires.map(q => {
                  const customer = getCustomer(q.customerId);
                  const progress = q.questions.length
                    ? Math.round(
                      (q.questions.filter(q => q.status === 'done').length / q.questions.length) *
                      100
                    )
                    : 0;
                  return (
                    <li key={q.id} className="questionnaire-item">
                      <Link to={`/customers/${q.customerId}/questionnaires/${q.id}`}>
                        <div className="q-info">
                          <span className="q-name">{q.name}</span>
                          <span className="q-customer">{customer?.name}</span>
                        </div>
                        <div className="q-progress">
                          <div className="progress-bar">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="q-progress-text">{progress}%</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--space-2xl);
        }

        .header-left h1 {
            font-size: var(--text-4xl);
            font-weight: var(--font-bold);
            margin-bottom: var(--space-xs);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-lg);
          margin-bottom: var(--space-2xl);
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-card {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: var(--space-lg);
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-base);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--color-text-primary);
          line-height: 1.2;
        }

        .stat-label {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          margin-top: 4px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--space-xl);
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-section {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          padding: var(--space-lg);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .section-header h2 {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
        }

        .section-content {
          min-height: 200px;
        }

        .empty-state-small {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-2xl);
          text-align: center;
          color: var(--color-text-tertiary);
          background: var(--color-bg-primary);
          border-radius: var(--radius-lg);
        }

        .deadline-list,
        .questionnaire-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .deadline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          background: var(--color-bg-primary);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .deadline-item:hover {
            transform: scale(1.01);
        }

        .deadline-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .deadline-title {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
        }

        .deadline-customer {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
        }

        .questionnaire-item a {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          background: var(--color-bg-primary);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .questionnaire-item a:hover {
          background: var(--color-bg-hover);
          transform: scale(1.01);
        }

        .q-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .q-name {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
        }

        .q-customer {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
        }

        .q-progress {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          width: 140px;
        }

        .q-progress .progress-bar {
          height: 8px;
          background: #e5e5e5;
        }
      `}</style>
    </div>
  );
}
