import React from 'react';
import { useAppState } from '../context/AppState';
import { Shield, HelpCircle, Loader2, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export default function MetaMaskPopup() {
  const { 
    txStatus, 
    activeTxHash, 
    txError, 
    txDetails,
    clearTxState
  } = useAppState();

  if (txStatus === 'IDLE') return null;

  const { title, assetId, assetName } = txDetails;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '380px', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          padding: '0',
          background: '#ffffff',
          animation: 'modalSlideUp 0.3s ease-out'
        }}
      >
        {/* MetaMask Header */}
        <div style={{ 
          background: '#f8fafc', 
          padding: '16px 20px', 
          borderBottom: '1px solid #e2e8f0', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: '#f6851b', 
              display: 'flex', 
              alignItems: 'center', 
              justify: 'center',
              fontWeight: 'bold',
              color: '#ffffff',
              fontSize: '0.8rem'
            }}>
              M
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>MetaMask</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: '#6366f1', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }}></span>
                Sepolia Testnet
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#475569', background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
            İşlem Tescili
          </span>
        </div>

        {/* Origin Site Info */}
        <div style={{ padding: '12px 20px', background: '#fffbeb', borderBottom: '1px solid #fef3c7', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color="#d97706" />
          <div style={{ fontSize: '0.725rem', color: '#b45309', fontWeight: 500 }}>
            Bağlantı: <span style={{ fontWeight: 700 }}>Ayniyat Blokzincir Sistemi</span>
          </div>
        </div>

        {/* Dynamic Status Content */}
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          
          {txStatus === 'METAMASK_APPROVAL' && (
            <>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: '#ffedd5', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center',
                animation: 'pulse 1.5s infinite' 
              }}>
                <Loader2 size={32} color="#f97316" style={{ animation: 'spin 1.5s linear infinite' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>MetaMask Onayı Bekleniyor</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                  Lütfen MetaMask tarayıcı cüzdanınızdan işlemi onaylayarak blokzincir tescilini başlatın.
                </p>
              </div>
            </>
          )}

          {txStatus === 'MINING' && (
            <>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: '#e0e7ff', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center'
              }}>
                <Loader2 size={32} color="#4f46e5" style={{ animation: 'spin 1.2s linear infinite' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>İşlem Blokzincire Yazılıyor</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                  İşleminiz Sepolia ağında işlenmektedir. Lütfen tarayıcıyı kapatmayın veya sayfayı yenilemeyin.
                </p>
              </div>
            </>
          )}

          {txStatus === 'SUCCESS' && (
            <>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: '#dcfce7', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center'
              }}>
                <CheckCircle2 size={36} color="#16a34a" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>İşlem Başarıyla Tamamlandı</h4>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: '6px', lineHeight: '1.4' }}>
                  Demirbaş durum değişimi akıllı sözleşmeye kaydedilerek blokzincir mühürü vuruldu!
                </p>
              </div>
            </>
          )}

          {txStatus === 'ERROR' && (
            <>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: '#fee2e2', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center'
              }}>
                <AlertTriangle size={32} color="#dc2626" />
              </div>
              <div style={{ width: '100%' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#991b1b' }}>İşlem Başarısız</h4>
                <p style={{ fontSize: '0.8rem', color: '#991b1b', marginTop: '6px', lineHeight: '1.4' }}>
                  İşlem iptal edildi veya akıllı sözleşme çağrısı sırasında bir hata meydana geldi.
                </p>
                <div style={{ 
                  background: '#fef2f2', 
                  border: '1px solid #fecaca', 
                  borderRadius: '8px', 
                  padding: '10px', 
                  fontSize: '0.725rem', 
                  color: '#b91c1c', 
                  marginTop: '12px',
                  fontFamily: 'monospace',
                  textAlign: 'left',
                  wordBreak: 'break-all',
                  maxHeight: '100px',
                  overflowY: 'auto'
                }}>
                  {txError}
                </div>
              </div>
            </>
          )}

          {/* Details Card */}
          <div style={{ 
            width: '100%',
            background: '#f8fafc', 
            padding: '12px 14px', 
            borderRadius: '10px', 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Demirbaş & Tescil İşlemi</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{title}</div>
            <div style={{ fontSize: '0.775rem', fontWeight: 500, color: '#475569' }}>Cihaz: {assetName}</div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748b' }}>Barkod ID: {assetId}</div>
          </div>

          {/* Transaction Link (Mining & Success states) */}
          {activeTxHash && (
            <div style={{ width: '100%', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>İŞLEM FİŞİ HASH</div>
              <div style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.7rem', 
                background: '#f1f5f9', 
                padding: '6px 10px', 
                borderRadius: '6px', 
                marginTop: '4px',
                wordBreak: 'break-all',
                color: '#334155'
              }}>
                {activeTxHash}
              </div>
              <a 
                href={`https://sepolia.etherscan.io/tx/${activeTxHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '4px', 
                  fontSize: '0.75rem', 
                  color: '#4f46e5', 
                  fontWeight: 600, 
                  marginTop: '8px',
                  textDecoration: 'none'
                }}
              >
                <span>Sepolia Etherscan'de Görüntüle</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Footer (only show close button for ERROR state) */}
        {txStatus === 'ERROR' && (
          <div style={{ 
            background: '#f8fafc', 
            padding: '12px 20px', 
            borderTop: '1px solid #e2e8f0', 
            display: 'flex', 
            justifyContent: 'flex-end' 
          }}>
            <button 
              type="button" 
              onClick={clearTxState}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700, borderRadius: '8px' }}
            >
              Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
