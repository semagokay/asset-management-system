import React from 'react';
import { useAppState } from '../context/AppState';
import { 
  User, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Trash2, 
  Send, 
  Box, 
  BadgeCheck,
  Wallet
} from 'lucide-react';

export default function ProfilePage() {
  const { 
    role, 
    currentDept, 
    assets, 
    requests, 
    blocks,
    userProfile,
    walletConnected,
    walletAddress,
    networkStatus,
    connectMetaMask,
    disconnectMetaMask
  } = useAppState();

  if (!userProfile) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Oturum açmış kullanıcı profili bulunamadı.
      </div>
    );
  }

  const isAmo = role === 'amo';

  // Compute last transaction date dynamically from blocks
  const userBlocks = blocks.filter(b => 
    b.newOwnerName === userProfile.fullName || 
    b.prevOwnerName === userProfile.fullName ||
    b.newDept === userProfile.dept ||
    b.prevDept === userProfile.dept
  );
  
  const lastTxDate = userBlocks.length > 0 
    ? userBlocks[userBlocks.length - 1].transferDate 
    : 'İşlem Yok';

  // Stats for Faculty Employee
  const userActiveAssetsCount = assets.filter(
    a => a.ownerId === userProfile.employeeId && a.status === 'ACTIVE'
  ).length;
  const userIdleRequestsCount = requests.filter(
    r => r.requestingEmployeeId === userProfile.employeeId && r.type === 'IDLE'
  ).length;
  const userTransferRequestsCount = requests.filter(
    r => r.requestingEmployeeId === userProfile.employeeId && r.type === 'TRANSFER'
  ).length;
  const userScrapRequestsCount = requests.filter(
    r => r.requestingEmployeeId === userProfile.employeeId && r.type === 'SCRAP'
  ).length;

  // Stats for Faculty Asset Officer
  const amoTotalManagedCount = assets.filter(
    a => a.faculty === currentDept && a.status !== 'SCRAPPED'
  ).length;
  const amoIdleCount = assets.filter(
    a => a.faculty === currentDept && a.status === 'IDLE'
  ).length;
  const amoApprovedIdleCount = requests.filter(
    r => r.ownerDept === currentDept && r.type === 'IDLE' && r.status === 'Approved'
  ).length;
  const amoApprovedTransfersCount = requests.filter(
    r => r.ownerDept === currentDept && r.type === 'TRANSFER' && r.status === 'Approved'
  ).length;
  const amoApprovedScrapCount = requests.filter(
    r => r.ownerDept === currentDept && r.type === 'SCRAP' && r.status === 'Approved'
  ).length;
  const amoPendingRequestsCount = requests.filter(
    r => r.ownerDept === currentDept && r.status === 'Pending'
  ).length;

  // Recent activity logs
  const recentActivities = isAmo 
    ? requests.filter(r => r.ownerDept === currentDept).slice(0, 5)
    : requests.filter(r => r.requestingEmployeeId === userProfile.employeeId).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Kullanıcı Profili & Bilgileri</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Kurumsal ayniyat sistemi üzerindeki kimlik detaylarınız ve gerçekleştirdiğiniz işlemlerin özeti.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Profile Info & Wallet Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Profile Card */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'var(--primary-light)', 
                color: 'var(--primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center' 
              }}>
                <User size={40} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)' }}>{userProfile.fullName}</h3>
                <span className="badge badge-info" style={{ marginTop: '4px', display: 'inline-block' }}>
                  {isAmo ? 'Ayniyat Yetkilisi' : 'Fakülte Çalışanı / Akademisyen'}
                </span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sicil Numarası:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{userProfile.employeeId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fakülte / Birim:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right' }}>{userProfile.dept}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hesap Yetki Seviyesi:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  {isAmo ? 'Yönetici (Ayniyat)' : 'Standart (Çalışan)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hesap Durumu:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--success)' }}>
                  <BadgeCheck size={16} /> {userProfile.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Kurumsal E-Posta:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  <a href={`mailto:${userProfile.institutionalEmail}`} style={{ color: 'var(--primary)', textDecoration: 'none', wordBreak: 'break-all' }}>
                    {userProfile.institutionalEmail}
                  </a>
                </span>
                <div style={{ 
                  fontSize: '0.725rem', 
                  color: '#b45309', 
                  background: '#fffbeb', 
                  border: '1px solid #fde68a', 
                  padding: '8px 10px', 
                  borderRadius: '6px', 
                  marginTop: '6px', 
                  fontWeight: 500,
                  lineHeight: '1.25' 
                }}>
                  Şifre kurtarma işlemleri ve önemli sistem bildirimleri bu kurumsal e-posta adresine gönderilmektedir.
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Wallet Card */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: walletConnected ? '#f0fdf4' : '#fff7ed', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center' 
              }}>
                <Wallet size={18} color={walletConnected ? '#22c55e' : '#f6851b'} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>
                Blokzincir Cüzdan Ayarları
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cüzdan Bağlantısı:</span>
                {walletConnected ? (
                  <span style={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                    Bağlı (MetaMask)
                  </span>
                ) : (
                  <span style={{ color: '#e11d48', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                    Bağlı Değil
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Aktif Ağ:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{networkStatus}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Son Blokzincir Tescili:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} style={{ opacity: 0.7 }} />
                  {lastTxDate}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>İlişkilendirilmiş Cüzdan Adresi:</span>
                {userProfile.walletAddress ? (
                  <span style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.725rem', 
                    background: '#f8fafc', 
                    padding: '8px 10px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    wordBreak: 'break-all',
                    color: 'var(--secondary)',
                    fontWeight: 600
                  }}>
                    {userProfile.walletAddress}
                  </span>
                ) : (
                  <span style={{ 
                    fontSize: '0.775rem', 
                    color: '#e11d48', 
                    background: '#fff1f2', 
                    padding: '8px 10px', 
                    borderRadius: '8px', 
                    border: '1px solid #ffe4e6',
                    textAlign: 'center',
                    fontWeight: 500
                  }}>
                    Cüzdan ilişkilendirilmemiş. Blokzincir tescil onayı yapamazsınız.
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginTop: '4px' }}>
              {walletConnected && userProfile.walletAddress ? (
                <button 
                  type="button" 
                  onClick={disconnectMetaMask}
                  className="btn btn-secondary" 
                  style={{ width: '100%', color: '#ef4444', borderColor: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  Cüzdan Bağlantısını Kes
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={connectMetaMask}
                  className="btn btn-primary" 
                  style={{ width: '100%', background: '#f6851b', borderColor: '#f6851b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  MetaMask Cüzdanı Bağla
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics & Activity Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Stats Box */}
          <div className="card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--secondary)' }}>
              {isAmo ? 'Ayniyat Yönetim İstatistikleri' : 'Bireysel Zimmet & Talep İstatistikleri'}
            </h4>
            
            {isAmo ? (
              // Ayniyat Officer statistics
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                    <Box size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Yönetilen Demirbaş</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', color: 'var(--secondary)' }}>
                    {amoTotalManagedCount}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warning)' }}>
                    <Layers size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Atıl Demirbaş</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', color: 'var(--secondary)' }}>
                    {amoIdleCount}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                    <Send size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Onaylanan Transfer</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', color: 'var(--secondary)' }}>
                    {amoApprovedTransfersCount}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)' }}>
                    <CheckCircle2 size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Onaylanan Atıl Bildirimi</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', color: 'var(--secondary)' }}>
                    {amoApprovedIdleCount}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)' }}>
                    <Trash2 size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Onaylanan Hurda</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', color: 'var(--secondary)' }}>
                    {amoApprovedScrapCount}
                  </div>
                </div>

                <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309' }}>
                    <Clock size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Bekleyen Onaylar</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', color: '#78350f' }}>
                    {amoPendingRequestsCount}
                  </div>
                </div>
              </div>
            ) : (
              // Faculty Employee statistics
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                    <Box size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Zimmetli Cihazlarım</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', color: 'var(--secondary)' }}>
                    {userActiveAssetsCount}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warning)' }}>
                    <Layers size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Atıl Taleplerim</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', color: 'var(--secondary)' }}>
                    {userIdleRequestsCount}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                    <Send size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Transfer İsteklerim</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', color: 'var(--secondary)' }}>
                    {userTransferRequestsCount}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)' }}>
                    <Trash2 size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Hurda Taleplerim</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '8px', color: 'var(--secondary)' }}>
                    {userScrapRequestsCount}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--secondary)' }}>
              {isAmo ? 'Son Onay & İnceleme Faaliyetleri' : 'Son Ayniyat Bildirim Taleplerim'}
            </h4>
            
            {recentActivities.length === 0 ? (
              <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Henüz kayda geçmiş bir işlem geçmişi bulunmamaktadır.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentActivities.map(activity => {
                  let statusBadge;
                  if (activity.status === 'Approved') {
                    statusBadge = <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Onaylandı</span>;
                  } else if (activity.status === 'Rejected') {
                    statusBadge = <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>Reddedildi</span>;
                  } else {
                    statusBadge = <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>İncelemede</span>;
                  }

                  let typeLabel;
                  if (activity.type === 'IDLE') typeLabel = 'Atıl Bildirimi';
                  else if (activity.type === 'TRANSFER') typeLabel = 'Transfer Talebi';
                  else typeLabel = 'Hurda Bildirimi';

                  return (
                    <div 
                      key={activity.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: '#f8fafc',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid var(--border)',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{activity.id}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{typeLabel}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Ekipman: {activity.assetName} ({activity.assetId})
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        {statusBadge}
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{activity.requestDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
