import React from 'react';
import { useAppState } from '../context/AppState';

export default function RequestsPage() {
  const { currentDept, requests } = useAppState();

  // My requests
  const myRequests = requests.filter(r => r.requestingDept === currentDept);

  // Stats
  const pendingIdleCount = myRequests.filter(r => r.type === 'IDLE' && r.status === 'Pending').length;
  const pendingTransferCount = myRequests.filter(r => r.type === 'TRANSFER' && r.status === 'Pending').length;
  const pendingScrapCount = myRequests.filter(r => r.type === 'SCRAP' && r.status === 'Pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Taleplerim ve İşlem Takibi
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Oluşturduğunuz atıl, transfer ve hurda taleplerinin Ayniyat Sorumluları onay durumları.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tüm Taleplerimin Geçmişi ve Durumu</h3>
        </div>

        {myRequests.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Henüz oluşturulmuş bir atıl, transfer veya hurda talebiniz bulunmamaktadır.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Talep ID</th>
                  <th>Talep Tipi</th>
                  <th>Cihaz Detayı</th>
                  <th>Talep Tarihi</th>
                  <th>İlişkili Departman</th>
                  <th>İnceleme Durumu</th>
                  <th style={{ textAlign: 'right' }}>İşlem Kaydı</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map(req => {
                  let typeBadge;
                  if (req.type === 'IDLE') {
                    typeBadge = <span className="badge badge-purple">Atıl İstek</span>;
                  } else if (req.type === 'TRANSFER') {
                    typeBadge = <span className="badge badge-info">Transfer İstek</span>;
                  } else {
                    typeBadge = <span className="badge badge-danger" style={{ background: '#fef2f2', color: '#ef4444' }}>Hurda İstek</span>;
                  }

                  let statusBadge;
                  if (req.status === 'Approved') {
                    statusBadge = <span className="badge badge-success">Onaylandı</span>;
                  } else if (req.status === 'Rejected') {
                    statusBadge = <span className="badge badge-danger">Reddedildi</span>;
                  } else {
                    statusBadge = <span className="badge badge-warning">Onay Bekliyor</span>;
                  }

                  return (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>{req.id}</td>
                      <td>{typeBadge}</td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 500 }}>{req.assetName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Varlık ID: {req.assetId} | Açıklama: "{req.notes}"
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.requestDate}</td>
                      <td style={{ fontSize: '0.85rem' }}>{req.ownerDept}</td>
                      <td>{statusBadge}</td>
                      <td style={{ textAlign: 'right' }}>
                        {req.txHash ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              {req.txHash.slice(0, 10)}...{req.txHash.slice(-8)}
                            </span>
                            <span className="badge badge-success" style={{ fontSize: '0.55rem', marginTop: '2px', padding: '1px 4px' }}>Sisteme Kaydedildi</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yok (Karar Bekliyor)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
