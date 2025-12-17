import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  onAddClick?: () => void;
}

export function Sidebar({ onAddClick }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  // const location = useLocation();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/answers', icon: BookOpen, label: 'Answer Library' },
    { to: '/timeline', icon: Calendar, label: 'Timeline' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Shield className="sidebar-logo-icon" />
          {!collapsed && <span className="sidebar-logo-text">ComplianceOS</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-add-btn"
          onClick={onAddClick}
          title="Quick Add"
        >
          <Plus size={20} />
          {!collapsed && <span>Add Customer</span>}
        </button>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--color-bg-secondary);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-base);
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow-sm);
        }

        .sidebar-collapsed {
          width: 80px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-xl) var(--space-lg);
          margin-bottom: var(--space-md);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .sidebar-logo-icon {
          width: 32px;
          height: 32px;
          color: var(--color-accent);
          filter: drop-shadow(0 4px 6px var(--color-accent-muted));
        }

        .sidebar-logo-text {
          font-size: var(--text-lg);
          font-weight: var(--font-bold);
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
        }

        .sidebar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--color-bg-tertiary);
          border: none;
          border-radius: var(--radius-full);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .sidebar-toggle:hover {
          background: var(--color-accent-muted);
          color: var(--color-accent);
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: 1rem;
          color: var(--color-text-secondary);
          border-radius: var(--radius-full);
          transition: all var(--transition-base);
          text-decoration: none;
          font-weight: var(--font-medium);
        }

        .sidebar-link:hover {
          background: var(--color-bg-hover);
          color: var(--color-text-primary);
          transform: translateX(4px);
        }

        .sidebar-link.active {
          background: var(--color-accent);
          color: white;
          box-shadow: var(--shadow-glow);
        }

        .sidebar-link.active:hover {
            transform: none;
        }

        .sidebar-collapsed .sidebar-link {
          justify-content: center;
          padding: 1rem;
        }

        .sidebar-footer {
          padding: var(--space-xl) var(--space-lg);
        }

        .sidebar-add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          width: 100%;
          padding: 1rem;
          background: var(--color-text-primary); /* Dark button for contrast */
          color: white;
          border: none;
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-lg);
        }

        .sidebar-add-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
          background: black;
        }

        .sidebar-collapsed .sidebar-add-btn span {
          display: none;
        }
      `}</style>
    </aside>
  );
}
