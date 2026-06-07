import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { Check, X, Layers, Send, Trash2, Database } from 'lucide-react';

export default function RequestManagementPage() {
  const { 
    requests, 
    currentDept, 
    assets,
    approveIdleRequest, 
    approveTransferRequest, 
    approveScrapRequest, 
    rejectRequest 
  } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState('idle'); // 'idle' | 'transfer' | 'scrap' | 'completed'
  const [actingRequestId, setActingRequestId] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' | 'reject'

  // Filter requests that belong to this officer's department/faculty and are pending
  const deptIdleRequests = requests.filter(r => r.ownerDept === currentDept && r.type === 'IDLE' && r.status === 'Pending');
  const deptTransferRequests = requests.filter(r => r.ownerDept === currentDept && r.type === 'TRANSFER' && r.status === 'Pending');
  const deptScrapRequests = requests.filter(r => r.ownerDept === currentDept && r.type === 'SCRAP' && r.status === 'Pending');

  // Filter approved/rejected requests (past history logs of this department)
  const completedRequests = requests.filter(r => r.ownerDept === currentDept && r.status !== 'Pending');

  const handleAction = (requestId, type, action) => {
    setActingRequestId(requestId);
    setActionType(action);

    // Simulate smart contract mining latency
    setTimeout(() => {
      if (action === 'approve') {
        if (type === 'idle') {
          approveIdleRequest(requestId);
        } else if (type === 'transfer') {
          approveTransferRequest(requestId);
        } else if (type === 'scrap') {
          approveScrapRequest(requestId);
        }
      } else {
        rejectRequest(requestId);
      }
      setActingRequestId(null);
      setActionType('');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Talep Yönetimi & Onay Sırası
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Fakültenizdeki personellerin atıl/hurda taleplerini veya diğer birimlerin size ait atıl cihazlar için gönderdiği transfer isteklerini onaylayın.
        </p>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '16px', flexWrap: 'wrap' }}>
        <button 
          className={`sidebar-link ${activeSubTab === 'idle' ? 'active' : ''}`}
          style={{ width: 'auto', marginBottom: '0', borderRadius: '12px 12px 0 0', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setActiveSubTab('idle')}
        >
          <Layers size={16} />
          <span>Atıl Talepleri ({deptIdleRequests.length})</span>
        </button>
        <button 
          className={`sidebar-link ${activeSubTab === 'transfer' ? 'active' : ''}`}
          style={{ width: 'auto', marginBottom: '0', borderRadius: '12px 12px 0 0', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setActiveSubTab('transfer')}
        >
          <Send size={16} />
          <span>Transfer Talepleri ({deptTransferRequests.length})</span>
        </button>
        <button 
          className={`sidebar-link ${activeSubTab === 'scrap' ? 'active' : ''}`}
          style={{ width: 'auto', marginBottom: '0', borderRadius: '12px 12px 0 0', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setActiveSubTab('scrap')}
        >
          <Trash2 size={16} />
          <span>Hurda Talepleri ({deptScrapRequests.length})</span>
        </button>
        <button 
          className={`sidebar-link ${activeSubTab === 'completed' ? 'active' : ''}`}
          style={{ width: 'auto', marginBottom: '0', borderRadius: '12px 12px 0 0', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setActiveSubTab('completed')}
        >
          <Database size={16} />
          <span>İşlem Geçmişi ({completedRequests.length})</span>
        </button>
      </div>

      {/* Render Requests Lists */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        
        {activeSubTab === 'idle' && (
          <>
            <div style={{ padding: '20px var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Bekleyen Atıl Bildirim Onayları</h3>
            </div>
            {deptIdleRequests.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Onay bekleyen atıl talebi bulunmamaktadır.
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Talep ID</th>
                      <th>Cihaz Barkod / Detay</th>
                      <th>Talep Eden Çalışan</th>
                      <th>Talep Tarihi</th>
                      <th style={{ textAlign: 'right' }}>Durum Değiştir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptIdleRequests.map(req => {
                      const isProcessing = actingRequestId === req.id;
                      const asset = assets.find(a => a.assetId === req.assetId);
                      const isUnregistered = asset && !asset.onChainRegistered;
                      return (
                        <tr key={req.id} style={{ background: isUnregistered ? '#fffbeb' : 'inherit' }}>
                          <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>{req.id}</td>
                          <td>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 600 }}>{req.assetName}</span>
                                {isUnregistered && (
                                  <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '1px 6px', background: 'rgba(251, 191, 36, 0.15)', color: '#d97706', border: '1px solid rgba(251, 191, 36, 0.3)' }}>Tescil Bekliyor</span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Barkod ID: {req.assetId} | Gerekçe: "{req.notes}"
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{req.requestingEmployeeName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sicil No: {req.requestingEmployeeId}</div>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.requestDate}</td>
                          <td style={{ textAlign: 'right' }}>
                            {isProcessing ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                <div className="metamask-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', marginBottom: '0' }}></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {actionType === 'approve' ? 'Değişiklik Kaydediliyor...' : 'Reddediliyor...'}
                                </span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button 
                                  className="btn btn-success" 
                                  style={{ padding: '6px 12px', fontSize: '0.75rem' }} 
                                  onClick={() => handleAction(req.id, 'idle', 'approve')}
                                  disabled={isUnregistered}
                                  title={isUnregistered ? "Bu demirbaş henüz blokzincirde tescil edilmemiştir!" : ""}
                                >
                                  <Check size={14} /> Atıl Duruma Al
                                </button>
                                <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => handleAction(req.id, 'idle', 'reject')}>
                                  <X size={14} /> Reddet
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeSubTab === 'transfer' && (
          <>
            <div style={{ padding: '20px var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Bekleyen Cihaz Transfer Talepleri</h3>
            </div>
            {deptTransferRequests.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Bölümünüze ait cihazlar için gönderilmiş aktif bir transfer isteği bulunmamaktadır.
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Talep ID</th>
                      <th>Talep Edilen Cihaz</th>
                      <th>Talep Eden Birim / Çalışan</th>
                      <th>Talep Tarihi</th>
                      <th style={{ textAlign: 'right' }}>Transfer Onayla</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptTransferRequests.map(req => {
                      const isProcessing = actingRequestId === req.id;
                      const asset = assets.find(a => a.assetId === req.assetId);
                      const isUnregistered = asset && !asset.onChainRegistered;
                      return (
                        <tr key={req.id} style={{ background: isUnregistered ? '#fffbeb' : 'inherit' }}>
                          <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>{req.id}</td>
                          <td>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 600 }}>{req.assetName}</span>
                                {isUnregistered && (
                                  <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '1px 6px', background: 'rgba(251, 191, 36, 0.15)', color: '#d97706', border: '1px solid rgba(251, 191, 36, 0.3)' }}>Tescil Bekliyor</span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Barkod ID: {req.assetId} | Gerekçe: "{req.notes}"
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{req.requestingDept}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Talep Eden: {req.requestingEmployeeName} (Sicil: {req.requestingEmployeeId})</div>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.requestDate}</td>
                          <td style={{ textAlign: 'right' }}>
                            {isProcessing ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                <div className="metamask-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', marginBottom: '0' }}></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {actionType === 'approve' ? 'Transfer Ediliyor...' : 'Reddediliyor...'}
                                </span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button 
                                  className="btn btn-success" 
                                  style={{ padding: '6px 12px', fontSize: '0.75rem' }} 
                                  onClick={() => handleAction(req.id, 'transfer', 'approve')}
                                  disabled={isUnregistered}
                                  title={isUnregistered ? "Bu demirbaş henüz blokzincirde tescil edilmemiştir!" : ""}
                                >
                                  <Check size={14} /> Transferi Onayla
                                </button>
                                <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => handleAction(req.id, 'transfer', 'reject')}>
                                  <X size={14} /> Reddet
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeSubTab === 'scrap' && (
          <>
            <div style={{ padding: '20px var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Bekleyen Hurda Ayrımı Onayları</h3>
            </div>
            {deptScrapRequests.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Onay bekleyen hurda talebi bulunmamaktadır.
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Talep ID</th>
                      <th>Cihaz Barkod / Detay</th>
                      <th>Talep Eden Çalışan</th>
                      <th>Tarih</th>
                      <th style={{ textAlign: 'right' }}>Hurda Onayla</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptScrapRequests.map(req => {
                      const isProcessing = actingRequestId === req.id;
                      const asset = assets.find(a => a.assetId === req.assetId);
                      const isUnregistered = asset && !asset.onChainRegistered;
                      return (
                        <tr key={req.id} style={{ background: isUnregistered ? '#fffbeb' : 'inherit' }}>
                          <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>{req.id}</td>
                          <td>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 600 }}>{req.assetName}</span>
                                {isUnregistered && (
                                  <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '1px 6px', background: 'rgba(251, 191, 36, 0.15)', color: '#d97706', border: '1px solid rgba(251, 191, 36, 0.3)' }}>Tescil Bekliyor</span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Barkod ID: {req.assetId} | Gerekçe: "{req.notes}"
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{req.requestingEmployeeName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sicil No: {req.requestingEmployeeId}</div>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.requestDate}</td>
                          <td style={{ textAlign: 'right' }}>
                            {isProcessing ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                <div className="metamask-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', marginBottom: '0' }}></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {actionType === 'approve' ? 'Hurdaya Ayrılıyor...' : 'Reddediliyor...'}
                                </span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button 
                                  className="btn btn-success" 
                                  style={{ padding: '6px 12px', fontSize: '0.75rem' }} 
                                  onClick={() => handleAction(req.id, 'scrap', 'approve')}
                                  disabled={isUnregistered}
                                  title={isUnregistered ? "Bu demirbaş henüz blokzincirde tescil edilmemiştir!" : ""}
                                >
                                  <Check size={14} /> Hurdaya Ayır
                                </button>
                                <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => handleAction(req.id, 'scrap', 'reject')}>
                                  <X size={14} /> Reddet
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeSubTab === 'completed' && (
          <>
            <div style={{ padding: '20px var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Geçmiş Karar Kayıtları</h3>
            </div>
            {completedRequests.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Bölümünüze ait sonuçlanmış bir arşiv kaydı bulunmamaktadır.
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Talep ID</th>
                      <th>Tip</th>
                      <th>Cihaz Adı</th>
                      <th>Talep Eden</th>
                      <th>Tarih</th>
                      <th>Karar Durumu</th>
                      <th style={{ textAlign: 'right' }}>İşlem Referansı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedRequests.map(req => {
                      let typeBadge;
                      if (req.type === 'IDLE') typeBadge = <span className="badge badge-purple">Atıl</span>;
                      else if (req.type === 'TRANSFER') typeBadge = <span className="badge badge-info">Transfer</span>;
                      else typeBadge = <span className="badge badge-danger">Hurda</span>;

                      let statusBadge;
                      if (req.status === 'Approved') statusBadge = <span className="badge badge-success">Onaylandı</span>;
                      else statusBadge = <span className="badge badge-danger">Reddedildi</span>;

                      return (
                        <tr key={req.id}>
                          <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>{req.id}</td>
                          <td>{typeBadge}</td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 500 }}>{req.assetName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Barkod ID: {req.assetId}</div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{req.requestingEmployeeName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.requestingDept}</div>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.requestDate}</td>
                          <td>{statusBadge}</td>
                          <td style={{ textAlign: 'right' }}>
                            {req.txHash ? (
                              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {req.txHash.slice(0, 14)}...
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>---</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
