
interface TranslationType {
  [key: string]: {
    [key: string]: string;
  };
}

export const getHomeTranslations = (): TranslationType => {
  return {
    en: {
      tagline: 'Pet Care Made Simple',
      heading: 'happy & healthy',
      description: 'ANABULKU helps you manage all aspects of your pet\'s care in one place. Track health records, set reminders, and cherish your time together.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      everythingYouNeed: 'Everything you need in one place',
      comprehensiveTools: 'Keep track of all your pet\'s needs with our comprehensive care tools.',
      healthRecords: 'Health Records',
      healthRecordsDesc: 'Store all health information in one place. Track vaccinations, medications, and vet visits.',
      smartReminders: 'Smart Reminders',
      smartRemindersDesc: 'Never miss important pet care tasks with customizable reminders for medications, vet visits, and more.',
      dashboard: 'Dashboard',
      dashboardDesc: 'Keep track of your pet\'s needs and activities in a convenient dashboard view for better planning.',
      localServices: 'Local Pet Services',
      localServicesDesc: 'Find and review local pet services - vets, groomers, pet shops, and more in your area.',
      petFamily: 'Your Pet Family',
      petParent: 'Pet Parent',
      yourPets: 'Your Pets',
      viewAll: 'View All',
      ctaHeading: 'Ready to give your pets the care they deserve?',
      ctaDesc: 'Join thousands of pet owners who have simplified pet care with ANABULKU.',
      ctaButton: 'Get Started Now',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      findServices: 'Find Local Services'
    },
    id: {
      tagline: 'Perawatan Hewan Peliharaan Jadi Mudah',
      heading: 'bahagia & sehat',
      description: 'ANABULKU membantu Anda mengelola semua aspek perawatan hewan peliharaan dalam satu tempat. Lacak catatan kesehatan, atur pengingat, dan hargai waktu Anda bersama.',
      getStarted: 'Mulai',
      learnMore: 'Pelajari Lebih Lanjut',
      everythingYouNeed: 'Semua yang Anda butuhkan dalam satu tempat',
      comprehensiveTools: 'Pantau semua kebutuhan hewan peliharaan Anda dengan alat perawatan komprehensif kami.',
      healthRecords: 'Catatan Kesehatan',
      healthRecordsDesc: 'Simpan semua informasi kesehatan dalam satu tempat. Lacak vaksinasi, pengobatan, dan kunjungan dokter hewan.',
      smartReminders: 'Pengingat Pintar',
      smartRemindersDesc: 'Jangan lewatkan tugas perawatan hewan peliharaan penting dengan pengingat yang dapat disesuaikan untuk pengobatan, kunjungan dokter hewan, dan lainnya.',
      dashboard: 'Dasbor',
      dashboardDesc: 'Pantau kebutuhan dan aktivitas hewan peliharaan Anda dalam tampilan dasbor yang nyaman untuk perencanaan yang lebih baik.',
      localServices: 'Layanan Hewan Lokal',
      localServicesDesc: 'Temukan dan ulas layanan hewan peliharaan lokal - dokter hewan, salon, toko hewan, dan lainnya di area Anda.',
      petFamily: 'Keluarga Hewan Peliharaan Anda',
      petParent: 'Pemilik Hewan',
      yourPets: 'Hewan Peliharaan Anda',
      viewAll: 'Lihat Semua',
      ctaHeading: 'Siap memberikan hewan peliharaan Anda perawatan yang mereka layak?',
      ctaDesc: 'Bergabunglah dengan ribuan pemilik hewan peliharaan yang telah menyederhanakan perawatan hewan peliharaan dengan ANABULKU.',
      ctaButton: 'Mulai Sekarang',
      signIn: 'Masuk',
      signUp: 'Daftar',
      findServices: 'Temukan Layanan Lokal'
    }
  };
};
