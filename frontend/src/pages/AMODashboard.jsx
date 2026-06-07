import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { 
  FilePlus2, 
  Search, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export default function AMODashboard() {
  const { 
    currentDept, 
    assets, 
    categories, 
    mockUsers,
    registerAsset,
    assignAsset,
    registerExistingAsset,
    registerAllOffChainAssets
  } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  
  // Modals state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [assignModalAsset, setAssignModalAsset] = useState(null);
  
  const [loading, setLoading] = useState(false);

  // Form states for new asset tescili
  const [newAssetId, setNewAssetId] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]);
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newOwnerId, setNewOwnerId] = useState('');

  // Form states for assignment
  const [assignEmployeeId, setAssignEmployeeId] = useState('');

  // Local faculty inventory (exclude SCRAPPED)
  const deptAssets = assets.filter(a => a.faculty === currentDept && a.status !== 'SCRAPPED');

  // Filter unregistered assets for warning banner
  const unregisteredAssets = deptAssets.filter(a => !a.onChainRegistered);
  const hasUnregistered = unregisteredAssets.length > 0;

  // Filter faculty inventory
  const filteredAssets = deptAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.assetId.includes(searchTerm) ||
                          asset.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (asset.ownerId && asset.ownerId.includes(searchTerm));
    const matchesCategory = selectedCategory === 'Hepsi' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenRegister = () => {
    // Generate a random 11-digit barcode for mock ease
    const randomBarcode = '100000' + Math.floor(10000 + Math.random() * 90000);
    setNewAssetId(randomBarcode);
    setNewName('');
    setNewCategory(categories[0]);
    setNewDescription('');
    setNewLocation('');
    setNewOwnerId('');
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || newAssetId.length !== 11) return;
    
    // Validate initial owner if specified
    let targetOwnerName = `${currentDept} Ayniyat Yetkilisi`;
    let targetOwnerId = `amo-${currentDept}`;

    if (newOwnerId.trim()) {
      const employee = mockUsers.find(u => u.id === newOwnerId && u.role === 'dept');
      if (!employee) {
        alert('Hata: Girilen Sicil No sahibi bir çalışan bulunamadı!');
        return;
      }
      if (employee.faculty !== currentDept) {
        alert('Hata: Çalışan sizin fakültenizde bulunmalıdır!');
        return;
      }
      targetOwnerName = employee.name;
      targetOwnerId = employee.id;
    }

    setLoading(true);

    setTimeout(() => {
      registerAsset({
        assetId: newAssetId,
        name: newName,
        category: newCategory,
        description: newDescription,
        location: newLocation || `${currentDept} Ayniyat Deposu`,
        ownerId: targetOwnerId,
        ownerName: targetOwnerName
      });
      setLoading(false);
      setRegisterModalOpen(false);
    }, 1200);
  };

  const handleOpenAssignModal = (asset) => {
    setAssignModalAsset(asset);
    setAssignEmployeeId('');
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignEmployeeId.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const success = assignAsset(assignModalAsset.assetId, assignEmployeeId);
      setLoading(false);
      if (success) {
        setAssignModalAsset(null);
      }
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Fakülte Envanter Defteri ({currentDept})
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Fakültenize kayıtlı aktif ve atıl demirbaşları izleyin, yeni envanter tescili yapın ve atıl cihazları personellere zimmetleyin.
          </p>
        </div>
        <button 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={handleOpenRegister}
        >
          <FilePlus2 size={16} />
          <span>Yeni Varlık Tescili</span>
        </button>
      </div>

      {hasUnregistered && (
        <div style={{ 
          background: 'rgba(254, 243, 199, 0.4)', 
          border: '1px solid #fde68a', 
          borderRadius: '12px', 
          padding: '16px 20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: '#fef3c7', 
              display: 'flex', 
              alignItems: 'center', 
              justify: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={20} color="#d97706" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400e', margin: 0 }}>
                Blokzincir Tescili Bekleyen Demirbaşlar Tespit Edildi
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '4px', marginBottom: 0, lineHeight: '1.4' }}>
                Fakültenize ait envanterde {unregisteredAssets.length} adet demirbaş henüz blokzincir üzerinde tescil edilmemiştir. Akıllı sözleşme güvenliği gereği, tescil edilmeyen demirbaşlar üzerinde zimmet ataması, transfer, atıl durum veya hurda onayları gerçekleştirilemez.
              </p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            style={{ 
              background: '#d97706', 
              borderColor: '#d97706', 
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              padding: '8px 16px',
              fontWeight: 600
            }}
            onClick={async () => {
              setLoading(true);
              try {
                await registerAllOffChainAssets();
              } catch (e) {
                console.error(e);
              } finally {
                setLoading(false);
              }
            }}
          >
            <ShieldCheck size={16} />
            <span>Tümünü Sırayla Tescil Et</span>
          </button>
        </div>
      )}

      {/* Inventory Monitor Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Fakülte Demirbaş Envanter Listesi</h3>
        </div>

        {/* Filters */}
        <div style={{ padding: '16px var(--spacing-lg)', borderBottom: '1px solid var(--border)', background: '#f8fafc', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ flex: '1', minWidth: '200px' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Varlık adı, barkod no, veya zimmetli personel ara..." 
              className="search-input"
              style={{ padding: '8px 12px 8px 36px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="filter-select"
            style={{ padding: '8px 12px', minWidth: '150px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Hepsi">Tüm Kategoriler</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {filteredAssets.length === 0 ? (
          <div style={{ padding: '40px var(--spacing-lg)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Fakülte envanterinde kriterlere uygun kayıt bulunamadı.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Varlık Barkod ID</th>
                  <th>Ekipman Adı</th>
                  <th>Kategori</th>
                  <th>Mevcut Sorumlu (Zimmet)</th>
                  <th>Konum</th>
                  <th>Tescil Tarihi</th>
                  <th>Durum</th>
                  <th style={{ textAlign: 'right' }}>Zimmet İşlemi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map(asset => {
                  let statusBadge;
                  if (!asset.onChainRegistered) {
                    statusBadge = (
                      <span 
                        className="badge badge-warning" 
                        style={{ 
                          background: 'rgba(251, 191, 36, 0.15)', 
                          color: '#d97706', 
                          border: '1px solid rgba(251, 191, 36, 0.3)' 
                        }}
                      >
                        Tescil Bekliyor
                      </span>
                    );
                  } else if (asset.status === 'IDLE') {
                    statusBadge = <span className="badge badge-warning">Atıl</span>;
                  } else {
                    statusBadge = <span className="badge badge-success">Aktif</span>;
                  }

                  const isIdle = asset.status === 'IDLE';

                  return (
                    <tr key={asset.assetId} style={{ background: !asset.onChainRegistered ? '#fffbeb' : 'inherit' }}>
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
                        <div style={{ fontWeight: 500 }}>{asset.ownerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sicil No: {asset.ownerId}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{asset.location}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{asset.registeredAt}</td>
                      <td>{statusBadge}</td>
                      <td style={{ textAlign: 'right' }}>
                        {!asset.onChainRegistered ? (
                          <button 
                            className="btn btn-primary"
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '0.75rem', 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              background: '#d97706',
                              borderColor: '#d97706',
                              color: '#ffffff'
                            }}
                            onClick={async () => {
                              setLoading(true);
                              try {
                                await registerExistingAsset(asset.assetId);
                              } catch (e) {
                                console.error(e);
                              } finally {
                                setLoading(false);
                              }
                            }}
                          >
                            <ShieldCheck size={12} />
                            <span>Tescil Et</span>
                          </button>
                        ) : isIdle ? (
                          <button 
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => handleOpenAssignModal(asset)}
                          >
                            <UserCheck size={12} />
                            <span>Ekipman Zimmetle</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Çalışana Zimmetli</span>
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

      {/* Asset Registration Modal */}
      {registerModalOpen && (
        <div className="modal-overlay" onClick={() => !loading && setRegisterModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', padding: '24px' }}>
                <div className="metamask-spinner"></div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '16px', color: 'var(--secondary)' }}>
                  Kayıt Oluşturuluyor...
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
                  Yeni demirbaş tescili resmi ayniyat kayıt defterine yazılıyor...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit}>
                <div className="modal-header">
                  <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FilePlus2 size={18} color="var(--primary)" />
                    Yeni Demirbaş Kayıt Tescili
                  </span>
                  <button type="button" className="modal-close" onClick={() => setRegisterModalOpen(false)}>✕</button>
                </div>
                
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label className="login-label">Barkod ID (11 Haneli)</label>
                      <input 
                        type="text" 
                        maxLength={11}
                        required 
                        className="login-select" 
                        value={newAssetId} 
                        onChange={(e) => setNewAssetId(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <div>
                      <label className="login-label">Kategori</label>
                      <select 
                        className="login-select" 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)}
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="login-label">Demirbaş Varlık Adı</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Örn: Agilent Kromatografi Gaz Spektrometresi" 
                      className="login-select" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="login-label">Açıklama / Teknik Özellikler</label>
                    <textarea 
                      placeholder="Demirbaşın marka, model veya kullanım amacı açıklaması..." 
                      className="login-select"
                      style={{ height: '60px', resize: 'none', fontSize: '0.85rem' }}
                      value={newDescription} 
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label className="login-label">Fiziksel Konum / Oda</label>
                      <input 
                        type="text" 
                        placeholder="Örn: Laboratuvar 302" 
                        className="login-select" 
                        value={newLocation} 
                        onChange={(e) => setNewLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="login-label">Zimmetlenecek Personel ID (İsteğe Bağlı)</label>
                      <input 
                        type="text" 
                        maxLength={8}
                        placeholder="Boş bırakılırsa yetkiliye kaydedilir" 
                        className="login-select" 
                        value={newOwnerId} 
                        onChange={(e) => setNewOwnerId(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-main)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Tescil işlemi tamamlandığında, demirbaş varlığı fakülteniz adına resmi mutabakat defterine eklenecektir.
                    </span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Kaydet ve Tescil Et
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setRegisterModalOpen(false)}>
                    İptal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Custodian Assignment Modal */}
      {assignModalAsset && (
        <div className="modal-overlay" onClick={() => !loading && setAssignModalAsset(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', padding: '24px' }}>
                <div className="metamask-spinner"></div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '16px', color: 'var(--secondary)' }}>
                  Zimmet Ataması Yapılıyor...
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
                  Demirbaşın zilyetlik transfer kaydı resmi mutabakat defterine işleniyor...
                </p>
              </div>
            ) : (
              <form onSubmit={handleAssignSubmit}>
                <div className="modal-header">
                  <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={18} color="var(--primary)" />
                    Demirbaş Zimmet Ataması
                  </span>
                  <button type="button" className="modal-close" onClick={() => setAssignModalAsset(null)}>✕</button>
                </div>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700 }}>Zimmetlenecek Cihaz</div>
                    <div style={{ fontWeight: 600, color: 'var(--secondary)', marginTop: '2px', fontSize: '0.9rem' }}>
                      [{assignModalAsset.assetId}] {assignModalAsset.name}
                    </div>
                  </div>

                  <div>
                    <label className="login-label">Zimmetlenecek Personel Sicil No (8 Haneli)</label>
                    <input 
                      type="text" 
                      maxLength={8}
                      required 
                      placeholder="Zimmetlenecek akademisyen/çalışan sicil no..." 
                      className="login-select" 
                      value={assignEmployeeId} 
                      onChange={(e) => setAssignEmployeeId(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-main)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <HelpCircle size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Bu atama sonucunda, cihazın mülkiyeti fakülteniz Ayniyat Yetkilisinden çalışana geçecek ve durumu ACTIVE (Aktif) olacaktır.
                    </span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Zimmet Atamasını Tamamla
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setAssignModalAsset(null)}>
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
