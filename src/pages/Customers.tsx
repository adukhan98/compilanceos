import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Plus, FileText, Calendar, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { AddCustomerModal } from '../components/AddCustomerModal.tsx';

export function Customers() {
  const { state, getCustomerQuestionnaires, getCustomerObligations, getCustomerTasks } = useStore();
  const { customers } = state;
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customers-page">
      <header className="page-header">
        <div>
          <h1>Customers</h1>
          <p className="text-secondary mt-sm">Manage your customer compliance data</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Customer
        </button>
      </header>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="input search-input"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Customer Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <Building2 className="empty-state-icon" />
          <h3 className="empty-state-title">
            {search ? 'No customers found' : 'No customers yet'}
          </h3>
          <p className="empty-state-description">
            {search
              ? 'Try a different search term'
              : 'Add your first customer to start tracking compliance'}
          </p>
          {!search && (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={18} />
              Add Customer
            </button>
          )}
        </div>
      ) : (
        <div className="customer-grid">
          {filteredCustomers.map(customer => {
            const questionnaires = getCustomerQuestionnaires(customer.id);
            const obligations = getCustomerObligations(customer.id);
            const tasks = getCustomerTasks(customer.id);
            const completedTasks = tasks.filter(t => t.status === 'done').length;
            const overdueObligations = obligations.filter(
              o => o.status !== 'completed' && new Date(o.dueDate) < new Date()
            ).length;

            return (
              <Link
                key={customer.id}
                to={`/customers/${customer.id}`}
                className="customer-card card-hover"
              >
                <div className="customer-header">
                  <div className="customer-avatar">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="customer-info">
                    <h3 className="customer-name">{customer.name}</h3>
                    {customer.industry && (
                      <span className="customer-industry">{customer.industry}</span>
                    )}
                  </div>
                </div>

                <div className="customer-stats">
                  <div className="customer-stat">
                    <FileText size={14} />
                    <span>{questionnaires.length} questionnaires</span>
                  </div>
                  <div className="customer-stat">
                    <CheckCircle2 size={14} />
                    <span>
                      {completedTasks}/{tasks.length} tasks
                    </span>
                  </div>
                  {overdueObligations > 0 && (
                    <div className="customer-stat customer-stat-warning">
                      <Calendar size={14} />
                      <span>{overdueObligations} overdue</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showAddModal && <AddCustomerModal onClose={() => setShowAddModal(false)} />}

      <style>{`
        .customers-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-xl);
        }

        .search-bar {
          position: relative;
          margin-bottom: var(--space-xl);
        }

        .search-icon {
          position: absolute;
          left: var(--space-md);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .search-input {
          padding-left: 44px;
        }

        .customer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-md);
        }

        .customer-card {
          text-decoration: none;
          padding: var(--space-lg);
        }

        .customer-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .customer-avatar {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: white;
        }

        .customer-info {
          flex: 1;
          min-width: 0;
        }

        .customer-name {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .customer-industry {
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
        }

        .customer-stats {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .customer-stat {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
        }

        .customer-stat-warning {
          color: var(--color-error);
        }
      `}</style>
    </div>
  );
}
