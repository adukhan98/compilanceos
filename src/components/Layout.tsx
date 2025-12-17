import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { AddCustomerModal } from './AddCustomerModal.tsx';

export function Layout() {
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar onAddClick={() => setShowAddCustomer(true)} />
      <main className="main-content">
        <Outlet />
      </main>

      {showAddCustomer && (
        <AddCustomerModal onClose={() => setShowAddCustomer(false)} />
      )}

      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          padding: var(--space-xl);
          min-height: 100vh;
          transition: margin-left var(--transition-base);
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 72px;
          }
        }
      `}</style>
    </div>
  );
}
