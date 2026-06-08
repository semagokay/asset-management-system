import React, { useState, useEffect } from 'react';
import { AppStateProvider, useAppState } from './context/AppState';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import DeptDashboard from './pages/DeptDashboard';
import MyAssetsPage from './pages/MyAssetsPage';
import RequestsPage from './pages/RequestsPage';
import AssetPoolPage from './pages/AssetPoolPage';
import AMODashboard from './pages/AMODashboard';
import RequestManagementPage from './pages/RequestManagementPage';
import TransferHistoryLedger from './pages/TransferHistoryLedger';
import ProfilePage from './pages/ProfilePage';
import MetaMaskPopup from './components/MetaMaskPopup';
import { AlertCircle, CheckCircle, Info, Wallet } from 'lucide-react';

function DashboardContent() {
  const { 
    walletConnected, 
    role, 
    notification, 
    userProfile,
    connectMetaMask,
    disconnectWallet
  } = useAppState();
  const [activeTab, setActiveTab] = useState('my-assets');

  // Sync active tab to role defaults on login
  useEffect(() => {
    if (role === 'dept') {
      setActiveTab('my-assets');
    } else if (role === 'amo') {
      setActiveTab('amo-dashboard');
    }
  }, [role]);

  if (!userProfile) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      // Dept pages
      case 'dept-dashboard':
        return <DeptDashboard />;
      case 'my-assets':
        return <MyAssetsPage />;
      case 'my-requests':
        return <RequestsPage />;
      case 'idle-pool':
        return <AssetPoolPage />;
      
      // AMO pages
      case 'amo-dashboard':
        return <AMODashboard />;
      case 'amo-requests':
        return <RequestManagementPage />;
      case 'transfer-ledger':
        return <TransferHistoryLedger />;
      case 'profile':
        return <ProfilePage />;

      default:
        return role === 'dept' ? <MyAssetsPage /> : <AMODashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <main className="main-content" style={{ paddingTop: '32px' }}>
          {renderContent()}
        </main>
      </div>

      <MetaMaskPopup />



      {/* Global Toast Notifications */}
      {notification && (
        <div className={`notification-toast notification-${notification.type}`}>
          {notification.type === 'success' && <CheckCircle size={18} color="var(--success)" />}
          {notification.type === 'warning' && <AlertCircle size={18} color="var(--warning)" />}
          {notification.type === 'info' && <Info size={18} color="var(--primary)" />}
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--secondary)' }}>
            {notification.message}
          </span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <DashboardContent />
    </AppStateProvider>
  );
}
