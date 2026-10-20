import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  TextInput,
  Alert
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView
} from 'react-native-safe-area-context';

// 1. ÖRNEK TALEP VERİLERİ
const baslangicTalepleri = [
  {
    id: 'TLP-1001',
    baslik: 'Bilgisayar açılmıyor',
    aciklama: 'Sabah power tuşuna basmama rağmen hiçbir ışık yanmıyor ve fanlar çalışmıyor.',
    kategori: 'Bilgisayar',
    birim: 'Öğrenci İşleri',
    oncelik: 'Yüksek',
    durum: 'Bekliyor'
  },
  {
    id: 'TLP-1002',
    baslik: 'Yazıcı bağlantı sorunu',
    aciklama: 'Ağ üzerindeki yazıcıya çıktı gönderemiyorum, hata veriyor.',
    kategori: 'Yazıcı',
    birim: 'Personel Daire Başkanlığı',
    oncelik: 'Orta',
    durum: 'İşlemde'
  },
  {
    id: 'TLP-1003',
    baslik: 'İnternet bağlantısı kesildi',
    aciklama: 'Kütüphane katında kablosuz ağ bağlantısı tamamen koptu.',
    kategori: 'İnternet',
    birim: 'Kütüphane',
    oncelik: 'Yüksek',
    durum: 'Bekliyor'
  },
  {
    id: 'TLP-1004',
    baslik: 'Ofis yazılımı hata veriyor',
    aciklama: 'Lisans anahtarı uyarısı alıyorum ve program kapanıyor.',
    kategori: 'Yazılım',
    birim: 'Muhasebe',
    oncelik: 'Düşük',
    durum: 'Tamamlandı'
  }
];

// KATEGORİ İKON VE RENK HARİTASI
const kategoriAyarlari = {
  Bilgisayar: { ikon: '💻', arkaPlan: '#e0e7ff', yaziRengi: '#3730a3' },
  Yazıcı: { ikon: '🖨️', arkaPlan: '#e2e8f0', yaziRengi: '#334155' },
  İnternet: { ikon: '🌐', arkaPlan: '#e0f2fe', yaziRengi: '#0369a1' },
  Yazılım: { ikon: '⌨️', arkaPlan: '#fef3c7', yaziRengi: '#b45309' },
  Varsayilan: { ikon: '📌', arkaPlan: '#f1f5f9', yaziRengi: '#64748b' }
};

// 2. SABİT SEÇENEKLER (Durum ve Öncelik Filtreleri)
const durumFiltreleri = ['Tümü', 'Bekliyor', 'İşlemde', 'Tamamlandı'];
const oncelikFiltreleri = ['Tümü', 'Düşük', 'Orta', 'Yüksek'];

// 3. RENK YARDIMCI FONKSİYONLARI
const oncelikRengi = (oncelik) => {
  if (oncelik === 'Yüksek') return '#dc2626';
  if (oncelik === 'Orta') return '#d97706';
  return '#16a34a';
};

const durumRengi = (durum) => {
  if (durum === 'Bekliyor') return '#dc2626';
  if (durum === 'İşlemde') return '#2563eb';
  return '#16a34a';
};

// 4. ÖZET KARTI BİLEŞENİ
function OzetKarti({ baslik, sayi, renk, genislik }) {
  return (
    <View style={[styles.summaryCard, { width: genislik }]}>
      <View style={[styles.summaryIndicator, { backgroundColor: renk }]} />
      <Text style={[styles.summaryNumber, { color: renk }]}>{sayi}</Text>
      <Text style={styles.summaryLabel}>{baslik}</Text>
    </View>
  );
}

// 5. TALEP KARTI VE DETAY BİLEŞENİ (G5, G6, G7, G8 Entegrasyonu)
function TalepKarti({ talep, onDurumDegistir, onTalepSil }) {
  const [detayAcik, setDetayAcik] = useState(false);
  const tamamlandi = talep.durum === 'Tamamlandı';

  const katBilgi = kategoriAyarlari[talep.kategori] || kategoriAyarlari.Varsayilan;

  return (
    <Pressable
      style={styles.ticketCard}
      onPress={() => setDetayAcik(!detayAcik)}
      onLongPress={() => onTalepSil(talep.id)}
    >
      <View style={styles.ticketTop}>
        <Text style={styles.ticketId}>{talep.id}</Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: oncelikRengi(talep.oncelik) + '18' }
          ]}
        >
          <Text style={[styles.priorityText, { color: oncelikRengi(talep.oncelik) }]}>
            {talep.oncelik}
          </Text>
        </View>
      </View>

      <View style={styles.cardMainRow}>
        <View style={[styles.iconContainer, { backgroundColor: katBilgi.arkaPlan }]}>
          <Text style={styles.iconStyle}>{katBilgi.ikon}</Text>
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.ticketTitle}>{talep.baslik}</Text>
          <Text style={styles.ticketDetail}>{talep.birim}</Text>
        </View>
      </View>

      {detayAcik && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Talep Detayları:</Text>
          <Text style={styles.detailsText}>Talep Numarası: {talep.id}</Text>
          <Text style={styles.detailsText}>Arıza Başlığı: {talep.baslik}</Text>
          <Text style={styles.detailsText}>Açıklama: {talep.aciklama || 'Açıklama girilmemiş.'}</Text>
          <Text style={styles.detailsText}>Kategori: {talep.kategori}</Text>
          <Text style={styles.detailsText}>Birim: {talep.birim}</Text>
          <Text style={styles.detailsText}>Öncelik: {talep.oncelik}</Text>
          <Text style={styles.detailsText}>Durum: {talep.durum}</Text>
          <Text style={styles.hintText}>💡 İpucu: Kaydı silmek için uzun basabilirsiniz.</Text>
        </View>
      )}

      <View style={styles.ticketBottom}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: durumRengi(talep.durum) + '18' }
          ]}
        >
          <Text style={[styles.statusText, { color: durumRengi(talep.durum) }]}>
            {talep.durum}
          </Text>
        </View>

        {!tamamlandi && (
          <Pressable
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onDurumDegistir(talep.id);
            }}
          >
            <Text style={styles.actionText}>
              {talep.durum === 'Bekliyor' ? 'İşleme Al →' : 'Tamamla ✓'}
            </Text>
          </Pressable>
        )}

        {tamamlandi && (
          <Text style={styles.completedText}>İşlem tamamlandı</Text>
        )}
      </View>
    </Pressable>
  );
}

// 6. ANA YÖNETİM PANELİ
function TeknikDestekPaneli() {
  const [talepler, setTalepler] = useState(baslangicTalepleri);
  const [aktifDurumFiltresi, setAktifDurumFiltresi] = useState('Tümü');
  const [aktifOncelikFiltresi, setAktifOncelikFiltresi] = useState('Tümü');
  
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kategori, setKategori] = useState('Bilgisayar');

  const { width } = useWindowDimensions();
  const sutunSayisi = width >= 600 ? 4 : 2;
  const kartGenisligi = (width - 40 - (sutunSayisi - 1) * 10) / sutunSayisi;

  const toplam = talepler.length;
  const bekliyor = talepler.filter(item => item.durum === 'Bekliyor').length;
  const islemde = talepler.filter(item => item.durum === 'İşlemde').length;
  const tamamlanan = talepler.filter(item => item.durum === 'Tamamlandı').length;

  const filtreliTalepler = talepler.filter((item) => {
    const durumUyumu = aktifDurumFiltresi === 'Tümü' || item.durum === aktifDurumFiltresi;
    const oncelikUyumu = aktifOncelikFiltresi === 'Tümü' || item.oncelik === aktifOncelikFiltresi;
    return durumUyumu && oncelikUyumu;
  });

  const durumDegistir = (id) => {
    setTalepler((oncekiTalepler) =>
      oncekiTalepler.map((item) => {
        if (item.id !== id) return item;
        let yeniDurum = item.durum;
        if (item.durum === 'Bekliyor') {
          yeniDurum = 'İşlemde';
        } else if (item.durum === 'İşlemde') {
          yeniDurum = 'Tamamlandı';
        }
        return { ...item, durum: yeniDurum };
      })
    );
    Alert.alert('Bilgi', 'Talep durumu güncellendi.');
  };

  const talepSilOnayi = (id) => {
    Alert.alert(
      'Silme Onayı',
      'Bu destek talebini silmek istediğinize emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            setTalepler((oncekiTalepler) => oncekiTalepler.filter(item => item.id !== id));
            Alert.alert('Başarılı', 'Talep sistemden silindi.');
          }
        }
      ]
    );
  };

  const talepEkle = () => {
    if (baslik.trim() === '' || aciklama.trim() === '') {
      Alert.alert(
        'Eksik Bilgi',
        'Lütfen başlık ve açıklama alanlarını boş bırakmayın.'
      );
      return;
    }

    const yeniTalep = {
      id: `TLP-${Date.now()}`,
      baslik: baslik.trim(),
      aciklama: aciklama.trim(),
      kategori: kategori,
      birim: 'Genel Birim',
      oncelik: 'Orta',
      durum: 'Bekliyor'
    };

    setTalepler((oncekiTalepler) => [yeniTalep, ...oncekiTalepler]);
    setBaslik('');
    setAciklama('');

    Alert.alert('Başarılı', 'Yeni destek talebi oluşturuldu.');
  };

  const listeBasligi = (
    <View>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Yeni Destek Talebi</Text>

        <TextInput
          style={styles.input}
          placeholder="Arıza başlığı"
          value={baslik}
          onChangeText={setBaslik}
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Arıza açıklaması"
          value={aciklama}
          onChangeText={setAciklama}
          multiline
        />

        <Text style={styles.filterLabel}>Arıza Kategorisi:</Text>
        <View style={styles.filterContainer}>
          {['Bilgisayar', 'Yazıcı', 'İnternet', 'Yazılım'].map((secenek) => (
            <Pressable
              key={secenek}
              onPress={() => setKategori(secenek)}
              style={[
                styles.filterButton,
                kategori === secenek && styles.activeFilter
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  kategori === secenek && styles.activeFilterText
                ]}
              >
                {secenek}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.addButton} onPress={talepEkle}>
          <Text style={styles.addButtonText}>+ Talep Oluştur</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerLabel}>BİLGİ İŞLEM DAİRE BAŞKANLIĞI</Text>
        <Text style={styles.title}>Teknik Destek Paneli</Text>
        <Text style={styles.subtitle}>Destek taleplerini buradan yönetin.</Text>
      </View>

      <View style={styles.summaryGrid}>
        <OzetKarti baslik="Toplam" sayi={toplam} renk="#2563eb" genislik={kartGenisligi} />
        <OzetKarti baslik="Bekliyor" sayi={bekliyor} renk="#dc2626" genislik={kartGenisligi} />
        <OzetKarti baslik="İşlemde" sayi={islemde} renk="#d97706" genislik={kartGenisligi} />
        <OzetKarti baslik="Tamamlanan" sayi={tamamlanan} renk="#16a34a" genislik={kartGenisligi} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Destek Talepleri</Text>
        <Text style={styles.sectionCount}>{filtreliTalepler.length} kayıt</Text>
      </View>

      <Text style={styles.filterLabel}>Durum Filtresi:</Text>
      <View style={styles.filterContainer}>
        {durumFiltreleri.map((filtre) => (
          <Pressable
            key={filtre}
            onPress={() => setAktifDurumFiltresi(filtre)}
            style={[
              styles.filterButton,
              aktifDurumFiltresi === filtre && styles.activeFilter
            ]}
          >
            <Text
              style={[
                styles.filterText,
                aktifDurumFiltresi === filtre && styles.activeFilterText
              ]}
            >
              {filtre}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.filterLabel}>Öncelik Filtresi:</Text>
      <View style={styles.filterContainer}>
        {oncelikFiltreleri.map((filtre) => (
          <Pressable
            key={filtre}
            onPress={() => setAktifOncelikFiltresi(filtre)}
            style={[
              styles.filterButton,
              aktifOncelikFiltresi === filtre && styles.activeFilter
            ]}
          >
            <Text
              style={[
                styles.filterText,
                aktifOncelikFiltresi === filtre && styles.activeFilterText
              ]}
            >
              {filtre}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
      <FlatList
        data={filtreliTalepler}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TalepKarti
            talep={item}
            onDurumDegistir={durumDegistir}
            onTalepSil={talepSilOnayi}
          />
        )}
        ListHeaderComponent={listeBasligi}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Kayıt bulunamadı</Text>
            <Text style={styles.emptyText}>Seçilen filtre kriterlerine ait destek talebi yok.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TeknikDestekPaneli />
    </SafeAreaProvider>
  );
}

// 7. STİLLER
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9'
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 45,
    flexGrow: 1
  },
  header: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    marginBottom: 18
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1d4ed8',
    letterSpacing: 0.8
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 9
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 13,
    padding: 16,
    minHeight: 108,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  summaryIndicator: {
    width: 28,
    height: 4,
    borderRadius: 2,
    marginBottom: 9
  },
  summaryNumber: {
    fontSize: 29,
    fontWeight: 'bold'
  },
  summaryLabel: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 5
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    flexShrink: 1
  },
  sectionCount: {
    fontSize: 13,
    color: '#64748b'
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 10,
    marginBottom: 4
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8
  },
  filterButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  activeFilter: {
    backgroundColor: 'rgb(37, 99, 235)'
  },
  filterText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600'
  },
  activeFilterText: {
    color: '#ffffff'
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 13,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  ticketTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  ticketId: {
    color: '#64748b',
    fontSize: 12
  },
  priorityBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    fontSize: 20
  },
  cardTextContainer: {
    flex: 1
  },
  ticketTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: 'bold'
  },
  ticketDetail: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2
  },
  detailsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  detailsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6
  },
  detailsText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 3
  },
  hintText: {
    fontSize: 11,
    color: '#2563eb',
    marginTop: 8,
    fontStyle: 'italic'
  },
  ticketBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    gap: 10
  },
  statusBadge: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  actionButton: {
    backgroundColor: '#dbeafe',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  actionText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: 'bold'
  },
  completedText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600'
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
    marginTop: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#334155'
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 9,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
    color: '#0f172a'
  },
  descriptionInput: {
    minHeight: 90,
    textAlignVertical: 'top'
  },
  addButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 8
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center'
  }
});