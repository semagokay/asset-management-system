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
  const [activeTab, setActiveTab] = useState('dept-dashboard');

  // Sync active tab to role defaults on login
  useEffect(() => {
    if (role === 'dept') {
      setActiveTab('dept-dashboard');
    } else if (role === 'amo') {
      setActiveTab('amo-dashboard');
    }
  }, [role]);

  if (!userProfile) {
    return <Login />;
  }

  // First Login Experience - Wallet Onboarding
  if (!walletConnected) {
    return (
      <div className="login-page" style={{ background: '#f1f5f9' }}>
        <div className="login-centered-container">
          <div className="login-card" style={{ maxWidth: '460px', padding: '32px', textAlign: 'center' }}>
            <div className="university-emblem-placeholder" style={{ margin: '0 auto 16px auto', background: '#fff7ed' }}>
              <Wallet size={32} color="#f6851b" />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '12px' }}>
              Blokzincir Cüzdan Kurulumu
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
              Bu hesapta şu anda bir blokzincir cüzdanı tanımlı değildir. Blokzincir işlemlerini onaylamak ve yetkili varlık yönetimi işlemlerini gerçekleştirmek için bir cüzdan bağlantısı gereklidir.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                type="button"
                onClick={connectMetaMask}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  background: '#f6851b', 
                  borderColor: '#f6851b', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justify: 'center', 
                  gap: '8px',
                  padding: '12px',
                  fontWeight: 700,
                  boxShadow: '0 4px 6px rgba(246, 133, 27, 0.2)'
                }}
              >
                MetaMask Cüzdanı Bağla
              </button>

              <button 
                type="button"
                onClick={disconnectWallet}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '10px' }}
              >
                Oturumu Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
        return role === 'dept' ? <DeptDashboard /> : <AMODashboard />;
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
