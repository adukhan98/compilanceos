import { NavLink, useLocation } from 'react-router-dom';
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
    const location = useLocation();

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
          border-right: 1px solid var(--color-glass-border);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-base);
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }

        .sidebar-collapsed {
          width: 72px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-lg);
          border-bottom: 1px solid var(--color-glass-border);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .sidebar-logo-icon {
          width: 28px;
          height: 28px;
          color: var(--color-accent);
        }

        .sidebar-logo-text {
          font-size: var(--text-lg);
          font-weight: var(--font-bold);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: transparent;
          border: 1px solid var(--color-glass-border);
          border-radius: var(--radius-md);
          color: var(--color-text-tertiary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .sidebar-toggle:hover {
          background: var(--color-glass);
          color: var(--color-text-primary);
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          color: var(--color-text-secondary);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .sidebar-link:hover {
          background: var(--color-glass);
          color: var(--color-text-primary);
        }

        .sidebar-link.active {
          background: var(--color-accent-muted);
          color: var(--color-accent);
        }

        .sidebar-collapsed .sidebar-link {
          justify-content: center;
          padding: var(--space-sm);
        }

        .sidebar-footer {
          padding: var(--space-md);
          border-top: 1px solid var(--color-glass-border);
        }

        .sidebar-add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          width: 100%;
          padding: var(--space-sm) var(--space-md);
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .sidebar-add-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-glow);
        }

        .sidebar-collapsed .sidebar-add-btn span {
          display: none;
        }
      `}</style>
        </aside>
    );
}
