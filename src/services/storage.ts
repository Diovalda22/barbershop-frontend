// ============================================================
// IN-MEMORY STORE — Tidak ada localStorage sama sekali
// Data hanya ada selama sesi (page refresh = reset)
// ============================================================

export const SEED_CAPSTERS = [
  { id: '1', name: 'MUNYING', role: 'Senior Capster', noHp: '081234567890', foto: '/capster1.png', bio: 'Spesialis fade & modern styling', status: 'active', queue_prefix: 'A', is_active: true },
  { id: '2', name: 'SANI', role: 'Senior Capster', foto: '/capster2.png', bio: 'Ahli coloring & creative styling', status: 'active', queue_prefix: 'B', is_active: true }
];

export const SEED_SERVICES = [
  // HAIRCUT Category
  { id: 'hc-sr', name: 'Haircut Senior', price: 35000, description: 'Potong rambut oleh kapster senior', is_active: true },
  { id: 'hc-jr', name: 'Haircut Junior', price: 30000, description: 'Potong rambut oleh kapster junior', is_active: true },
  { id: 'hc-prm', name: 'Haircut', price: 50000, description: 'Paket potong rambut online', is_active: true },

  // COLORING Category
  { id: 'clr-bsc', name: 'Basic Coloring', price: 70000, description: 'Pewarnaan rambut dasar', is_active: true },
  { id: 'clr-blc', name: 'Highlight Bleaching', price: 120000, description: 'Highlight dengan bleaching', is_active: true },
  { id: 'clr-fsh', name: 'Highlight Fashion', price: 150000, description: 'Highlight fashion', is_active: true },
  { id: 'clr-ful', name: 'Fashion Coloring Full', price: 200000, description: 'Pewarnaan fashion penuh', is_active: true },

  // OTHER Category
  { id: 'prm-crl', name: 'Curly Perm', price: 200000, description: 'Pengeritingan rambut curly', is_active: true },
  { id: 'prm-wavy', name: 'Wavy Perm', price: 200000, description: 'Pengeritingan rambut wavy', is_active: true },
  { id: 'prm-dsg', name: 'Design Perm', price: 300000, description: 'Pengeritingan rambut desain', is_active: true },
  { id: 'rtl-lift', name: 'Root Lift', price: 65000, description: 'Root lift treatment', is_active: true },
  { id: 'dwn-prm', name: 'Down Perm', price: 100000, description: 'Down perm treatment', is_active: true },
  { id: 'har-tato', name: 'Hair Tato', price: 10000, description: 'Tato rambut / ukir rambut', is_active: true },
  { id: 'shv-bsc', name: 'Shaving', price: 20000, description: 'Cukur jenggot/kumis', is_active: true },
  { id: 'res-online', name: 'Reservasi', price: 50000, description: 'Biaya reservasi tempat', is_active: true }
];

// In-memory store — plain object, tidak ada persistensi
const memStore: Record<string, any> = {
  capsters: [...SEED_CAPSTERS],
  services: [...SEED_SERVICES],
  settings: { shopName: 'Pointcut Barbershop' },
  reservations: [],
  lockedSlots: [],
  expenses: [],
};

export const Storage = {
  get: <T>(key: string, defaultValue: T): T => {
    return key in memStore ? (memStore[key] as T) : defaultValue;
  },
  set: <T>(key: string, value: T): void => {
    memStore[key] = value;
  },
  remove: (key: string): void => {
    delete memStore[key];
  }
};

// Pengguna sesi aktif (mock — tidak ada localStorage)
export const currentUser = {
  name: 'Munying',
  email: 'munying@pointcut.com',
  role: 'kapster'
};
