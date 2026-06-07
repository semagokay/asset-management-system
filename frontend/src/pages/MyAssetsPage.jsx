import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { Box, HelpCircle, FileText } from 'lucide-react';

export default function MyAssetsPage() {
  const { currentDept, userProfile, assets, requests, submitIdleRequest, submitScrapRequest } = useAppState();

  const [modalAsset, setModalAsset] = useState(null);
  const [modalType, setModalType] = useState(''); // 'idle' | 'scrap'
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!userProfile) return null;

  // Filter assets directly assigned to this employee's ID and that are currently ACTIVE
  const myAssets = assets.filter(
    a => a.ownerId === userProfile.employeeId && a.status === 'ACTIVE'
  );

  const handleOpenModal = (asset, type) => {
    setModalAsset(asset);
    setModalType(type);
    setNotes('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (modalType === 'idle') {
        submitIdleRequest(modalAsset.assetId, notes);
      } else {
        submitScrapRequest(modalAsset.assetId, notes);
      }
      setLoading(false);
      setModalAsset(null);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Zimmetli Cihazlarım
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Kullanımınızda olan aktif ekipmanlar ve demirbaşlar. Atıl veya kullanılamaz durumdaki cihazlar için bildirim yapabilirsiniz.
        </p>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Aktif Zimmet Listesi ({myAssets.length} Adet)</h3>
        </div>

        {myAssets.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Üzerinize kayıtlı aktif ve zimmetli cihaz bulunmamaktadır.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Varlık Barkod ID</th>
                  <th>Ekipman Adı</th>
                  <th>Kategori</th>
                  <th>Kayıt Tarihi</th>
                  <th>Konum</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>İşlem Bildir</th>
                </tr>
              </thead>
              <tbody>
                {myAssets.map(asset => {
                  const hasPendingRequest = requests.some(r => r.assetId === asset.assetId && r.status === 'Pending');

                  return (
                    <tr key={asset.assetId}>
                      <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>{asset.assetId}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{asset.name}</div>
                        {asset.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {asset.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-info">{asset.category}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{asset.registeredAt}</td>
                      <td style={{ fontSize: '0.85rem', fontWeight: 500 }}>{asset.location}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className="badge badge-success">Aktif</span>
                          {!asset.onChainRegistered && (
                            <span 
                              className="badge badge-warning" 
                              style={{ 
                                fontSize: '0.65rem', 
                                padding: '1px 4px', 
                                background: 'rgba(251, 191, 36, 0.15)', 
                                color: '#d97706', 
                                border: '1px solid rgba(251, 191, 36, 0.3)' 
                              }}
                            >
                              Tescil Bekliyor
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--warning)', color: 'var(--gold)' }}
                            onClick={() => handleOpenModal(asset, 'idle')}
                            disabled={hasPendingRequest}
                            title="Cihaz artık kullanılmıyorsa atıl durumuna alınması için Ayniyat Sorumlusuna bildirin."
                          >
                            Atıl Bildir
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--error)', color: 'var(--error)' }}
                            onClick={() => handleOpenModal(asset, 'scrap')}
                            disabled={hasPendingRequest}
                            title="Kullanılamaz durumdaki cihazı hurdaya ayırmak için bildirin."
                          >
                            Hurda Bildir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {modalAsset && (
        <div className="modal-overlay" onClick={() => !loading && setModalAsset(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', padding: '24px' }}>
                <div className="metamask-spinner"></div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '16px', color: 'var(--secondary)' }}>
                  Talep İletiliyor...
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
                  Bildiriminiz {currentDept} Ayniyat Yetkilisi onay sırasına gönderiliyor.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                  <span className="modal-title">
                    {modalType === 'idle' ? 'Cihazı Atıl Havuzuna Alma Talebi' : 'Demirbaş Hurda Ayrımı Talebi'}
                  </span>
                  <button type="button" className="modal-close" onClick={() => setModalAsset(null)}>✕</button>
                </div>
                
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700 }}>Seçilen Varlık</div>
                    <div style={{ fontWeight: 600, color: 'var(--secondary)', marginTop: '2px', fontSize: '0.9rem' }}>
                      [{modalAsset.assetId}] {modalAsset.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Kategori: {modalAsset.category} | Konum: {modalAsset.location}
                    </div>
                  </div>

                  <div>
                    <label className="login-label">Talep Gerekçesi ve Açıklama</label>
                    <textarea 
                      required
                      placeholder={modalType === 'idle' ? 'Cihazın neden artık kullanılmadığını ve atıl durumda olduğunu belirtin...' : 'Cihazdaki teknik arıza ve hurdaya ayrılma sebebini açıklayın...'}
                      className="login-select"
                      style={{ height: '90px', resize: 'none', fontSize: '0.85rem' }}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-main)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <HelpCircle size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Bu bildirim onaylandığında, cihazın mülkiyeti fakülte Ayniyat Yetkilisine devredilecek ve cihaz durumu IDLE (Atıl) olarak güncellenecektir.
                    </span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Talebi İlet
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setModalAsset(null)}>
                    İptal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
