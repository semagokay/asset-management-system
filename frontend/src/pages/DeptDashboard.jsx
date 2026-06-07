import React from 'react';
import { useAppState } from '../context/AppState';
import { Box, Layers, History, HelpCircle } from 'lucide-react';

export default function DeptDashboard() {
  const { currentDept } = useAppState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {currentDept} - Departman Üye Paneli
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Kullanımınızda olan aktif ekipmanları izleyin ve atıl/hurda onay süreçlerini sol paneldeki menülerden yönetin.
        </p>
      </div>

      {/* Guide Cards in plain language */}
      <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <HelpCircle size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Ayniyat Paylaşım Sistemi Nasıl Çalışır?</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Box size={18} color="var(--primary)" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)' }}>Zimmetli Cihazlar</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              **Zimmetlerim** sayfasından üzerinizdeki cihazları görebilirsiniz. Kullanılmayan cihazları **Atıl Bildir**, hasarlı cihazları ise **Hurda Bildir** butonuyla bildirebilirsiniz.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Layers size={18} color="var(--primary)" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)' }}>Boştaki Cihazları Talep Etme</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              **Boştaki Varlık Havuzu** sayfasından diğer bölümlerin kullanmadığı cihazları listeleyebilirsiniz. İhtiyacınız olan bir ekipmanı kendi bölümünüze devretmek için transfer isteği gönderebilirsiniz.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <History size={18} color="var(--primary)" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)' }}>Taleplerimin Takibi</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Oluşturduğunuz tüm atıl, hurda ve transfer taleplerinin onay durumlarını **Taleplerim** sayfasından anlık olarak izleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
