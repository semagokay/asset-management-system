import React from 'react';
import { useAppState } from '../context/AppState';
import { 
  LayoutDashboard, 
  Layers, 
  CheckSquare, 
  Link2,
  Database,
  Box,
  History,
  User,
  LogOut
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { role, userProfile, disconnectWallet } = useAppState();

  return (
    <aside className="sidebar-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Link2 size={18} />
        </div>
        <div>
          <h1>Ayniyat Share</h1>
          <span style={{ fontSize: '0.65rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
            Demirbaş Yönetim Portalı
          </span>
        </div>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
        {role === 'dept' && (
          <>
            <div className="sidebar-section-header">
              DEPARTMAN KULLANICISI
            </div>
            
            <button 
              className={`sidebar-link ${activeTab === 'dept-dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dept-dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Bölüm Paneli</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'my-assets' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-assets')}
            >
              <Box size={18} />
              <span>Zimmetlerim</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'my-requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-requests')}
            >
              <History size={18} />
              <span>Taleplerim</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'idle-pool' ? 'active' : ''}`}
              onClick={() => setActiveTab('idle-pool')}
            >
              <Layers size={18} />
              <span>Boştaki Varlık Havuzu</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>Hesabım</span>
            </button>
          </>
        )}

        {role === 'amo' && (
          <>
            <div className="sidebar-section-header">
              AYNİYAT SORUMLUSU
            </div>
            
            <button 
              className={`sidebar-link ${activeTab === 'amo-dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('amo-dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Bölüm Envanteri</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'amo-requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('amo-requests')}
            >
              <CheckSquare size={18} />
              <span>Talep Yönetimi</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'transfer-ledger' ? 'active' : ''}`}
              onClick={() => setActiveTab('transfer-ledger')}
            >
              <Database size={18} />
              <span>Transfer Defteri</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>Hesabım</span>
            </button>
          </>
        )}

        {!role && (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Lütfen giriş yapın.
          </div>
        )}
      </nav>

      {/* Alt Bölüm: Kullanıcı Profili, Zimmetlerim (Ayniyat Yetkilisi için) ve Çıkış */}
      {userProfile && (
        <div style={{ 
          padding: '16px 14px', 
          borderTop: '1px solid var(--border)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
          background: '#f8fafc',
          borderRadius: '0 0 0 16px'
        }}>
          {/* Kullanıcı Kartı */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 6px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'var(--primary-light)', 
              color: 'var(--primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justify: 'center',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              flexShrink: 0
            }}>
              {userProfile.fullName[0]}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userProfile.fullName}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {role === 'amo' ? 'Ayniyat Yetkilisi' : 'Personel'}
              </div>
            </div>
          </div>

          {/* Ayniyat Yetkilisinin Zimmetlerim Butonu (Sol altta, diğerleriyle karışmaması için) */}
          {role === 'amo' && (
            <button 
              className={`sidebar-link ${activeTab === 'my-assets' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-assets')}
              style={{ margin: 0, padding: '8px 12px', background: activeTab === 'my-assets' ? 'var(--primary-light)' : 'transparent' }}
            >
              <Box size={18} />
              <span>Kişisel Zimmetlerim</span>
            </button>
          )}

          {/* Çıkış Yap Butonu */}
          <button 
            className="sidebar-link" 
            onClick={disconnectWallet}
            style={{ 
              margin: 0, 
              padding: '8px 12px', 
              color: '#ef4444', 
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fef2f2';
              e.currentTarget.style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ef4444';
            }}
          >
            <LogOut size={18} />
            <span style={{ fontWeight: 600 }}>Çıkış Yap</span>
          </button>
        </div>
      )}
    </aside>
  );
}
