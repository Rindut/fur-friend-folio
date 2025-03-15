
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PawPrint, Heart, Calendar, Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetProfileCard, { PetData } from '@/components/ui/PetProfileCard';
import AddPetButton from '@/components/ui/AddPetButton';
import { useLanguage } from '@/context/LanguageContext';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

// Sample data
const samplePets: PetData[] = [
  {
    id: '1',
    name: 'Luna',
    species: 'dog',
    breed: 'Golden Retriever',
    age: '3 years',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    upcomingCare: {
      type: 'Vaccination',
      date: 'Tomorrow'
    }
  },
  {
    id: '2',
    name: 'Oliver',
    species: 'cat',
    breed: 'Siamese',
    age: '2 years',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    upcomingCare: {
      type: 'Grooming',
      date: 'In 3 days'
    }
  }
];

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const translations = {
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
      careCalendar: 'Care Calendar',
      careCalendarDesc: 'View all upcoming care tasks in a convenient calendar view for better planning.',
      petFamily: 'Your Pet Family',
      viewAll: 'View All',
      ctaHeading: 'Ready to give your pets the care they deserve?',
      ctaDesc: 'Join thousands of pet owners who have simplified pet care with ANABULKU.',
      ctaButton: 'Get Started Now',
      signIn: 'Sign In',
      signUp: 'Sign Up'
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
      careCalendar: 'Kalender Perawatan',
      careCalendarDesc: 'Lihat semua tugas perawatan mendatang dalam tampilan kalender yang nyaman untuk perencanaan yang lebih baik.',
      petFamily: 'Keluarga Hewan Peliharaan Anda',
      viewAll: 'Lihat Semua',
      ctaHeading: 'Siap memberikan hewan peliharaan Anda perawatan yang mereka layak?',
      ctaDesc: 'Bergabunglah dengan ribuan pemilik hewan peliharaan yang telah menyederhanakan perawatan hewan peliharaan dengan ANABULKU.',
      ctaButton: 'Mulai Sekarang',
      signIn: 'Masuk',
      signUp: 'Daftar'
    }
  };

  const t = translations[language];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-lavender/30 -z-10" />
        
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              className="max-w-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="chip chip-primary inline-flex items-center mb-6">
                <PawPrint className="w-4 h-4 mr-1" />
                <span>{t.tagline}</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {language === 'en' ? 'Keep your pets' : 'Jaga hewan peliharaan Anda agar'}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-coral to-sage ml-2">
                  {t.heading}
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                {t.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <SignedIn>
                  <Button size="lg" className="rounded-full bg-coral hover:bg-coral/90">
                    <Link to="/dashboard" className="flex items-center gap-2">
                      {t.getStarted} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </SignedIn>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button size="lg" className="rounded-full bg-coral hover:bg-coral/90">
                      {t.signUp}
                    </Button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <Button size="lg" variant="outline" className="rounded-full">
                      {t.signIn}
                    </Button>
                  </SignInButton>
                </SignedOut>
                
                <Button size="lg" variant="outline" className="rounded-full">
                  {t.learnMore}
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-lavender/30 rounded-full -z-10 animate-pulse-gentle" />
                <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-sage/30 rounded-full -z-10 animate-pulse-gentle [animation-delay:1s]" />
                <img 
                  src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGRvZyUyMGFuZCUyMGNhdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60" 
                  alt="Cat and dog together" 
                  className="rounded-2xl shadow-xl object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-heading text-3xl sm:text-4xl mb-4">{t.everythingYouNeed}</h2>
            <p className="text-muted-foreground">
              {t.comprehensiveTools}
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="glass-morphism rounded-2xl p-6 text-center">
              <div className="bg-lavender/20 text-lavender p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.healthRecords}</h3>
              <p className="text-muted-foreground">
                {t.healthRecordsDesc}
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass-morphism rounded-2xl p-6 text-center">
              <div className="bg-coral/20 text-coral p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.smartReminders}</h3>
              <p className="text-muted-foreground">
                {t.smartRemindersDesc}
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass-morphism rounded-2xl p-6 text-center">
              <div className="bg-sage/20 text-sage p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.careCalendar}</h3>
              <p className="text-muted-foreground">
                {t.careCalendarDesc}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pet Profiles Section */}
      <section className="py-16 bg-cream/30">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <h2 className="section-heading">{t.petFamily}</h2>
            <Link to="/dashboard" className="text-coral hover:text-coral/80 font-medium flex items-center gap-1">
              {t.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {samplePets.map(pet => (
              <PetProfileCard key={pet.id} pet={pet} />
            ))}
            <AddPetButton />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-coral/10 via-white to-lavender/20">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t.ctaHeading}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t.ctaDesc}
            </p>
            <SignedIn>
              <Button size="lg" className="rounded-full bg-coral hover:bg-coral/90">
                <Link to="/dashboard" className="flex items-center gap-2">
                  {t.ctaButton} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="rounded-full bg-coral hover:bg-coral/90">
                  {t.signUp} <ArrowRight className="w-4 h-4" />
                </Button>
              </SignUpButton>
            </SignedOut>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
