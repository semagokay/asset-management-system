import React from 'react';
import { useAppState } from '../context/AppState';
import { ShieldCheck, Layers, FileSpreadsheet } from 'lucide-react';

export default function TransferHistoryLedger() {
  const { blocks } = useAppState();

  const blocksList = [...blocks].reverse();

  const getTypeName = (type) => {
    switch (type) {
      case 'REGISTRATION':
        return 'İlk Demirbaş Tescili';
      case 'IDLE_APPROVAL':
        return 'Atıl Havuz Tescili';
      case 'TRANSFER':
        return 'Mülkiyet Transferi';
      case 'SCRAP':
        return 'Hurdaya Ayırma Tescili';
      case 'ASSIGNMENT':
        return 'Zimmet Ataması Tescili';
      default:
        return 'Sistem Defter İşlemi';
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'REGISTRATION':
        return <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Tescil</span>;
      case 'IDLE_APPROVAL':
        return <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Atıl Onay</span>;
      case 'TRANSFER':
        return <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Transfer</span>;
      case 'SCRAP':
        return <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>Hurda</span>;
      case 'ASSIGNMENT':
        return <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Zimmet</span>;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Resmi Envanter ve Transfer Geçmişi
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Akıllı kayıt defteri üzerinde mühürlenmiş, değiştirilemez kurumsal envanter tescili ve sahiplik değişim kayıtları.
        </p>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px var(--spacing-lg)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Resmi Ayniyat Mutabakat Defteri</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>BİLGİLER DOĞRULANDI</span>
          </div>
        </div>

        {blocksList.length === 0 ? (
          <div style={{ padding: '60px var(--spacing-lg)', textAlign: 'center' }}>
            <Layers size={48} style={{ strokeWidth: 1.5, margin: '0 auto 12px', color: '#94a3b8' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Defterde henüz kayıtlı bir işlem bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Kayıt No</th>
                  <th>İşlem Tipi</th>
                  <th>Cihaz Detayları</th>
                  <th>Barkod Varlık ID</th>
                  <th>Önceki Sorumlu / Zimmet</th>
                  <th>Yeni Sorumlu / Durum</th>
                  <th>Tarih</th>
                  <th>İşlem Referansı</th>
                  <th style={{ textAlign: 'right' }}>Onay Ref No</th>
                </tr>
              </thead>
              <tbody>
                {blocksList.map(block => (
                  <tr key={block.blockNumber}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      #{block.blockNumber}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{getTypeName(block.type)}</span>
                        <div>{getTypeBadge(block.type)}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>{block.assetName}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{block.assetId}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 500 }}>{block.prevOwnerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{block.prevDept}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{block.newOwnerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{block.newDept}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{block.transferDate}</td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {block.txHash.slice(0, 10)}...{block.txHash.slice(-8)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>
                      {block.approvalRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
