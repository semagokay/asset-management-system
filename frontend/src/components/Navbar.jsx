import React from 'react';
import { useAppState } from '../context/AppState';
import { User, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const {
    walletConnected,
    role,
    currentDept,
    userProfile,
    loginUser,
    disconnectWallet
  } = useAppState();

  const handleQuickLogin = (id, pwd) => {
    loginUser(id, pwd);
  };

  return (
    <header className="header-bar">
      <div>
        {userProfile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              Oturum Aktif
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {role === 'amo' 
                ? `${currentDept} Ayniyat Yetkilisi` 
                : `${currentDept} Temsilcisi (Çalışan)`}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Personel Girişi Bekleniyor
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {userProfile ? (
          <>
            <button className="btn btn-secondary" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <User size={16} />
              {userProfile.fullName} (Sicil: {userProfile.employeeId})
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={disconnectWallet}
              title="Oturumu Kapat"
              style={{ padding: '8px 12px' }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Hızlı Giriş:</span>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px' }}
                onClick={() => handleQuickLogin('11111111', 'password')}
              >
                İletişim Çalışan
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px' }}
                onClick={() => handleQuickLogin('44444444', 'password')}
              >
                İletişim Yetkili
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '6px' }}
                onClick={() => handleQuickLogin('55555555', 'password')}
              >
                Mühendislik Yetkili
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
