import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { Search, Layers, Compass, HelpCircle } from 'lucide-react';

export default function AssetPoolPage() {
  const { assets, currentDept, userProfile, categories, submitTransferRequest } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [requestModalAsset, setRequestModalAsset] = useState(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!userProfile) return null;

  // Filter all idle assets across the university
  const idleAssets = assets.filter(a => a.status === 'IDLE');

  // Apply filters
  const filteredAssets = idleAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.assetId.includes(searchTerm) ||
                          asset.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Hepsi' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenRequest = (asset) => {
    setRequestModalAsset(asset);
    setRequestNotes('');
  };

  const handleConfirmRequest = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      submitTransferRequest(requestModalAsset.assetId, requestNotes);
      setLoading(false);
      setRequestModalAsset(null);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Üniversite Geneli Atıl Varlık Havuzu
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Tüm fakültelerin ve idari birimlerin paylaşıma açtığı kullanılmayan (atıl) ekipman havuzu. İhtiyacınız olan cihazı kendi bölümünüze talep edebilirsiniz.
        </p>
      </div>

      {/* Filters */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cihaz adı, barkod no veya sahibi olan fakülte ile ara..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="Hepsi">Tüm Kategoriler</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px var(--spacing-lg)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Havuzda Paylaşıma Açık Varlıklar</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bulunan: {filteredAssets.length} Cihaz</span>
        </div>

        {filteredAssets.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <Layers size={48} style={{ strokeWidth: 1.5, margin: '0 auto 12px', color: '#94a3b8' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Atıl varlık havuzunda henüz uygun bir ekipman bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Varlık Barkod ID</th>
                  <th>Varlık Adı</th>
                  <th>Kategori</th>
                  <th>Sahibi Olan Birim (Ayniyat Yetkilisi)</th>
                  <th>Mevcut Depo Konumu</th>
                  <th style={{ textAlign: 'right' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map(asset => {
                  const isOwnDeptAsset = asset.faculty === currentDept;
                  return (
                    <tr key={asset.assetId}>
                      <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>{asset.assetId}</td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{asset.name}</span>
                        {asset.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {asset.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-info">{asset.category}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{asset.faculty}</span>
                        {isOwnDeptAsset && (
                          <span className="badge badge-warning" style={{ fontSize: '0.55rem', marginLeft: '6px', padding: '1px 4px' }}>Fakültenize Ait</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{asset.location}</td>
                      <td style={{ textAlign: 'right' }}>
                        {isOwnDeptAsset ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Kendi Varlığınız</span>
                        ) : (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                            onClick={() => handleOpenRequest(asset)}
                          >
                            Birimimize Talep Et
                          </button>
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

      {/* Transfer Request Modal */}
      {requestModalAsset && (
        <div className="modal-overlay" onClick={() => !loading && setRequestModalAsset(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', padding: '24px' }}>
                <div className="metamask-spinner"></div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '16px', color: 'var(--secondary)' }}>
                  Transfer Talebi Gönderiliyor...
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
                  Talebiniz, cihaz sahibi olan {requestModalAsset.faculty} Ayniyat Yetkilisi paneline iletiliyor...
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmRequest}>
                <div className="modal-header">
                  <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Compass size={18} color="var(--primary)" />
                    Demirbaş Transfer Talebi
                  </span>
                  <button type="button" className="modal-close" onClick={() => setRequestModalAsset(null)}>✕</button>
                </div>
                
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700 }}>Talep Edilen Cihaz</div>
                    <div style={{ fontWeight: 600, color: 'var(--secondary)', marginTop: '2px', fontSize: '0.9rem' }}>
                      [{requestModalAsset.assetId}] {requestModalAsset.name}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="login-label">Mal Sahibi Birim</label>
                      <input type="text" readOnly className="login-select" value={requestModalAsset.faculty} style={{ background: '#f1f5f9', cursor: 'not-allowed', fontSize: '0.8rem' }} />
                    </div>
                    <div>
                      <label className="login-label">Alıcı Birim (Sizin Fakülte)</label>
                      <input type="text" readOnly className="login-select" value={currentDept} style={{ background: '#f1f5f9', cursor: 'not-allowed', fontSize: '0.8rem' }} />
                    </div>
                  </div>

                  <div>
                    <label className="login-label">Talep Gerekçesi</label>
                    <textarea 
                      required
                      placeholder="Cihazın biriminizdeki araştırma, eğitim veya idari kullanım amacını detaylandırın..." 
                      className="login-select"
                      style={{ height: '80px', resize: 'none', fontSize: '0.85rem' }}
                      value={requestNotes}
                      onChange={(e) => setRequestNotes(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-main)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <HelpCircle size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Bu talep onaylandığında, cihazın mülkiyeti ve yönetim sorumluluğu doğrudan fakültenizin Ayniyat Yetkilisine devredilecektir.
                    </span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Talebi Gönder
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setRequestModalAsset(null)}>
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
