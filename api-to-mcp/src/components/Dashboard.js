import React, { useState } from 'react';
import './Dashboard.css';

// Simple icon components to replace lucide-react
const BarChart3 = () => <span>📊</span>;
const FileText = () => <span>📄</span>;
const Wrench = () => <span>🔧</span>;
const TrendingUp = () => <span>📈</span>;
const Key = () => <span>🔑</span>;
const CreditCard = () => <span>💳</span>;
const Settings = () => <span>⚙️</span>;
const BookOpen = () => <span>📖</span>;
const LogOut = () => <span>🚪</span>;
const Menu = () => <span>☰</span>;
const X = () => <span>✕</span>;
const User = () => <span>👤</span>;

const Sidebar = ({ activeTab, onTabChange, user, onLogout, isCollapsed, onToggle }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'api-specs', label: 'API Specs', icon: FileText },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'usage', label: 'Usage', icon: TrendingUp },
    { id: 'api-key', label: 'API Key', icon: Key },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'docs', label: 'Docs', icon: BookOpen },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <h2>API to MCP</h2>
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {isCollapsed ? <Menu /> : <X />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="nav-icon" />
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <User />
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-plan">{user.plan} Plan</div>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <LogOut />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'api-specs':
        return <ApiSpecsTab />;
      case 'tools':
        return <ToolsTab />;
      case 'usage':
        return <UsageTab />;
      case 'api-key':
        return <ApiKeyTab />;
      case 'billing':
        return <BillingTab />;
      case 'settings':
        return <SettingsTab />;
      case 'docs':
        return <DocsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        onLogout={onLogout}
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
      />
      <main className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
        <div className="content-header">
          <h1 className="page-title">
            {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
        </div>
        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Placeholder components for each tab
const OverviewTab = () => (
  <div className="overview-dashboard">
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-icon">📊</div>
        <div className="metric-content">
          <h3>API Calls</h3>
          <div className="metric-value">12,847</div>
          <div className="metric-change positive">+12.5%</div>
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-icon">🔧</div>
        <div className="metric-content">
          <h3>Active Tools</h3>
          <div className="metric-value">8</div>
          <div className="metric-change positive">+2</div>
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-icon">✅</div>
        <div className="metric-content">
          <h3>Success Rate</h3>
          <div className="metric-value">98.7%</div>
          <div className="metric-change positive">+0.3%</div>
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-icon">⚡</div>
        <div className="metric-content">
          <h3>Avg Response</h3>
          <div className="metric-value">245ms</div>
          <div className="metric-change negative">-15ms</div>
        </div>
      </div>
    </div>
  </div>
);

const ApiSpecsTab = () => (
  <div className="api-specs">
    <div className="section-header">
      <h2>API Specifications</h2>
      <button className="btn-primary">Upload New Spec</button>
    </div>
    <div className="specs-list">
      <div className="spec-item">
        <div className="spec-info">
          <h3>User Management API</h3>
          <p>Last updated: 2 days ago</p>
        </div>
        <div className="spec-actions">
          <button className="btn-secondary">View</button>
          <button className="btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
);

const ToolsTab = () => (
  <div className="tools-view">
    <h2>Generated Tools</h2>
    <div className="tools-grid">
      <div className="tool-card">
        <h3>get_users</h3>
        <p>Retrieve list of users</p>
        <div className="tool-status active">Active</div>
      </div>
    </div>
  </div>
);

const UsageTab = () => (
  <div className="usage-analytics">
    <h2>Usage Analytics</h2>
    <div className="analytics-content">
      <div className="chart-placeholder">
        <p>📈 Charts will be implemented here</p>
      </div>
    </div>
  </div>
);

const ApiKeyTab = () => (
  <div className="api-key-management">
    <h2>API Key Management</h2>
    <div className="api-key-display">
      <code>ak_live_1234567890abcdef</code>
      <button className="btn-secondary">Regenerate</button>
    </div>
  </div>
);

const BillingTab = () => (
  <div className="billing-section">
    <h2>Billing & Plans</h2>
    <div className="plans-grid">
      <div className="plan-card">
        <h3>Free Plan</h3>
        <div className="plan-price">$0/month</div>
        <ul>
          <li>1,000 API calls</li>
          <li>5 active tools</li>
          <li>Basic support</li>
        </ul>
      </div>
      <div className="plan-card featured">
        <h3>Pro Plan</h3>
        <div className="plan-price">$29/month</div>
        <ul>
          <li>Unlimited API calls</li>
          <li>Unlimited tools</li>
          <li>Priority support</li>
        </ul>
      </div>
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="settings-page">
    <h2>Settings</h2>
    <div className="settings-sections">
      <div className="setting-group">
        <h3>Appearance</h3>
        <div className="theme-toggle">
          <label>
            <input type="checkbox" />
            Dark Mode
          </label>
        </div>
      </div>
      <div className="setting-group">
        <h3>Security</h3>
        <button className="btn-secondary">Change Password</button>
      </div>
    </div>
  </div>
);

const DocsTab = () => (
  <div className="docs-page">
    <h2>Documentation</h2>
    <div className="docs-content">
      <p>Documentation will be uploaded here</p>
    </div>
  </div>
);

const menuItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'api-specs', label: 'API Specs' },
  { id: 'tools', label: 'Tools' },
  { id: 'usage', label: 'Usage' },
  { id: 'api-key', label: 'API Key' },
  { id: 'billing', label: 'Billing' },
  { id: 'settings', label: 'Settings' },
  { id: 'docs', label: 'Docs' },
];

export default Dashboard;
