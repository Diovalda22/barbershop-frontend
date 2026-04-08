export const PREFIX = 'barber_';

export const SEED_CAPSTERS = [
  { id: '1', nama: 'MUNYING', role: 'Senior Capster', noHp: '081234567890', foto: '/capster1.png', bio: 'Spesialis fade & modern styling', status: 'active', qPrefix: 'A' },
  { id: '2', nama: 'SANI', role: 'Senior Capster', foto: '/capster2.png', bio: 'Ahli coloring & creative styling', status: 'active', qPrefix: 'B' }
];

export const SEED_SERVICES = [
  // HAIRCUT Category
  { id: 'hc-sr', name: 'Haircut Senior', price: 35000, description: 'Potong rambut oleh kapster senior' },
  { id: 'hc-jr', name: 'Haircut Junior', price: 30000, description: 'Potong rambut oleh kapster junior' },
  { id: 'hc-prm', name: 'Haircut', price: 50000, description: 'Paket potong rambut online' },
  
  // COLORING Category
  { id: 'clr-bsc', name: 'Basic Coloring', price: 70000, description: 'Pewarnaan rambut dasar' },
  { id: 'clr-blc', name: 'Highlight Bleaching', price: 120000, description: 'Highlight dengan bleaching' },
  { id: 'clr-fsh', name: 'Highlight Fashion', price: 150000, description: 'Highlight fashion' },
  { id: 'clr-ful', name: 'Fashion Coloring Full', price: 200000, description: 'Pewarnaan fashion penuh' },
  
  // OTHER Category
  { id: 'prm-crl', name: 'Curly Perm', price: 200000, description: 'Pengeritingan rambut curly' },
  { id: 'prm-wavy', name: 'Wavy Perm', price: 200000, description: 'Pengeritingan rambut wavy' },
  { id: 'prm-dsg', name: 'Design Perm', price: 300000, description: 'Pengeritingan rambut desain' },
  { id: 'rtl-lift', name: 'Root Lift', price: 65000, description: 'Root lift treatment' },
  
  // OTHERS Category
  { id: 'dwn-prm', name: 'Down Perm', price: 100000, description: 'Down perm treatment' },
  { id: 'har-tato', name: 'Hair Tato', price: 10000, description: 'Tato rambut / ukir rambut' },
  { id: 'shv-bsc', name: 'Shaving', price: 20000, description: 'Cukur jenggot/kumis' },
  { id: 'res-online', name: 'Reservasi', price: 50000, description: 'Biaya reservasi tempat' }
];

export const Storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to storage', e);
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(PREFIX + key);
  }
};

export const initAdminStorage = () => {
  // Always force-update services to match the new pricelist during this transition
  Storage.set('services', SEED_SERVICES);

  // Force update capsters to new names (MUNYING & SANI)
  Storage.set('capsters', SEED_CAPSTERS);
  if (!localStorage.getItem(PREFIX + 'settings')) {
    Storage.set('settings', { shopName: 'Pointcut Barbershop' });
  }
  if (!localStorage.getItem(PREFIX + 'reservations')) {
    Storage.set('reservations', []);
  }
  if (!localStorage.getItem(PREFIX + 'lockedSlots')) {
    Storage.set('lockedSlots', []);
  }
};

// Auto-initialize to ensure names are synced (MUNYING & SANI)
initAdminStorage();
