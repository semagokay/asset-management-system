import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { Shield, Key, UserCheck } from 'lucide-react';

export default function Login() {
  const { 
    loginUser, 
    mockUsers,
    resetPassword
  } = useAppState();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!employeeId.trim() || !password.trim()) return;

    if (employeeId.length !== 8 || isNaN(employeeId)) {
      alert('Sicil Numarası 8 haneli bir sayı olmalıdır!');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const success = loginUser(employeeId, password);
      if (!success) {
        setLoading(false);
      }
    }, 800);
  };

  const handleQuickLogin = (id, pwd) => {
    setEmployeeId(id);
    setPassword(pwd);
    setLoading(true);

    setTimeout(() => {
      const success = loginUser(id, pwd);
      if (!success) {
        setLoading(false);
      }
    }, 500);
  };

  const handleRecovery = (e) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;

    setRecoveryLoading(true);

    setTimeout(() => {
      const success = resetPassword(recoveryEmail.trim());
      setRecoveryLoading(false);
      if (success) {
        setIsRecoveryMode(false);
        setRecoveryEmail('');
      }
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-centered-container">
        <div className="login-card" style={{ maxWidth: '440px' }}>
          
          <div className="login-card-header">
            <div className="university-emblem-placeholder">
              <Shield size={32} color="var(--primary)" />
            </div>
            <h1 className="university-title">T.C. İSTANBUL ÜNİVERSİTESİ</h1>
            <h2 className="platform-title">Ayniyat Paylaşım ve Yönetim Portalı</h2>
            <p className="login-card-subtitle">
              Akademik ve idari demirbaş takip sistemine erişmek için 8 haneli personel sicil numaranız ve şifrenizle giriş yapınız.
            </p>
          </div>

          {isRecoveryMode ? (
            <form onSubmit={handleRecovery} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="login-card-header" style={{ padding: 0, textAlign: 'left', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>Şifre Sıfırlama & Hesap Kurtarma</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                  Şifre sıfırlama talimatları kayıtlı kurumsal e-posta adresinize gönderilecektir.
                </p>
              </div>

              <div className="login-form-group">
                <label className="login-label">Kurumsal E-Posta Adresi</label>
                <input 
                  type="email" 
                  required
                  disabled={recoveryLoading}
                  placeholder="örn: ali.yilmaz@istanbul.edu.tr"
                  className="login-select"
                  style={{ paddingLeft: '12px' }}
                  value={recoveryEmail} 
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary login-wallet-button" 
                disabled={recoveryLoading}
                style={{ marginTop: '4px', width: '100%' }}
              >
                {recoveryLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div className="metamask-spinner" style={{ width: '16px', height: '16px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                    <span>Bağlantı Gönderiliyor...</span>
                  </div>
                ) : (
                  <span>Sıfırlama Bağlantısı Gönder</span>
                )}
              </button>

              <button 
                type="button" 
                className="btn btn-secondary" 
                disabled={recoveryLoading}
                onClick={() => {
                  setIsRecoveryMode(false);
                  setRecoveryEmail('');
                }}
                style={{ width: '100%' }}
              >
                Giriş Ekranına Dön
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="login-form-group">
                <label className="login-label">Personel Sicil No (8 Haneli)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    maxLength={8}
                    required
                    disabled={loading}
                    placeholder="Örn: 11111111"
                    className="login-select"
                    style={{ paddingLeft: '12px' }}
                    value={employeeId} 
                    onChange={(e) => setEmployeeId(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="login-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="login-label">Şifre</label>
                  <button 
                    type="button" 
                    onClick={() => setIsRecoveryMode(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Şifremi Unuttum?
                  </button>
                </div>
                <input 
                  type="password"
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="login-select"
                  style={{ paddingLeft: '12px' }}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary login-wallet-button" 
                disabled={loading}
                style={{ marginTop: '12px', width: '100%' }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div className="metamask-spinner" style={{ width: '16px', height: '16px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                    <span>Oturum Doğrulanıyor...</span>
                  </div>
                ) : (
                  <>
                    <Key size={16} style={{ marginRight: '8px' }} />
                    Sisteme Giriş Yap
                  </>
                )}
              </button>

              {/* Mock Accounts Helper */}
              <div style={{ 
                marginTop: '16px', 
                background: '#f8fafc', 
                border: '1px solid var(--border)', 
                borderRadius: '10px', 
                padding: '14px',
                opacity: loading ? 0.6 : 1,
                pointerEvents: loading ? 'none' : 'auto'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  <UserCheck size={16} color="var(--primary)" />
                  <span>HIZLI TEST HESAPLARI (Tıklayarak Anında Giriş Yapın)</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {mockUsers.map(user => (
                    <div 
                      key={user.id}
                      onClick={() => !loading && handleQuickLogin(user.id, user.password)}
                      style={{ 
                        fontSize: '0.725rem', 
                        padding: '6px 8px', 
                        background: '#ffffff', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '6px', 
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '62px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.borderColor = 'var(--primary)';
                          e.currentTarget.style.background = 'var(--primary-light)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.background = '#ffffff';
                        }
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{user.name.split(' ')[0]} {user.name.split(' ')[1] || ''}</span>
                          <span style={{ fontSize: '0.55rem', fontWeight: 700, color: user.role === 'amo' ? '#ef4444' : 'var(--primary)', background: user.role === 'amo' ? '#fef2f2' : 'var(--primary-light)', padding: '1px 4px', borderRadius: '4px' }}>
                            {user.role === 'amo' ? 'AYN' : 'PERS'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.faculty}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '1px dashed #e2e8f0', paddingTop: '2px' }}>
                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Sicil No:</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.65rem' }}>{user.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
