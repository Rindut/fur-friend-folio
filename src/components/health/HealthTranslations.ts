
interface TranslationType {
  [key: string]: {
    [key: string]: string;
  };
}

export const getHealthTranslations = (): TranslationType => {
  return {
    en: {
      pageTitle: 'Health',
      greeting: 'Hello, Pet Parent!',
      petCareHistory: 'Pet Care History',
      petCareHistoryDesc: 'Track your pet\'s complete medical history in one place. Store past veterinary visits, vaccinations, medications, surgeries, and health conditions.',
      upcomingPetCare: 'Upcoming Pet Care',
      upcomingPetCareDesc: 'Never miss important pet care schedules with smart reminders for upcoming appointments.',
      all: 'All',
      vaccinations: 'Vaccinations',
      medications: 'Medications',
      visits: 'Vet Visits',
      addRecord: 'Add Record',
      addReminder: 'Add Reminder',
      noRecords: 'No health records found. Add a new record to get started.',
      noUpcoming: 'No upcoming health tasks.',
      details: 'Details',
      viewCalendar: 'View Calendar',
      selectPet: 'Select Pet',
      noPets: 'No pets found. Add a pet first to track health records.',
      loading: 'Loading...',
      addPet: 'Add Pet'
    },
    id: {
      pageTitle: 'Kesehatan',
      greeting: 'Halo, Pemilik Hewan!',
      petCareHistory: 'Riwayat Perawatan Hewan',
      petCareHistoryDesc: 'Lacak riwayat medis lengkap hewan peliharaan Anda dalam satu tempat. Simpan kunjungan dokter hewan, vaksinasi, pengobatan, operasi, dan kondisi kesehatan.',
      upcomingPetCare: 'Perawatan Hewan Mendatang',
      upcomingPetCareDesc: 'Jangan pernah melewatkan jadwal perawatan hewan peliharaan penting dengan pengingat pintar untuk janji temu mendatang.',
      all: 'Semua',
      vaccinations: 'Vaksinasi',
      medications: 'Pengobatan',
      visits: 'Kunjungan Dokter',
      addRecord: 'Tambah Catatan',
      addReminder: 'Tambah Pengingat',
      noRecords: 'Tidak ada catatan kesehatan. Tambahkan catatan baru untuk memulai.',
      noUpcoming: 'Tidak ada tugas kesehatan mendatang.',
      details: 'Detail',
      viewCalendar: 'Lihat Kalender',
      selectPet: 'Pilih Hewan',
      noPets: 'Tidak ada hewan ditemukan. Tambahkan hewan terlebih dahulu untuk melacak catatan kesehatan.',
      loading: 'Memuat...',
      addPet: 'Tambah Hewan'
    }
  };
};
