
import { motion } from 'framer-motion';
import { Calendar, Heart, Bell, Map } from 'lucide-react';

interface FeaturesSectionProps {
  t: Record<string, string>;
  mounted: boolean;
}

const FeaturesSection = ({ t, mounted }: FeaturesSectionProps) => {
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
    <section className="py-10 bg-white">
      <div className="container px-4 mx-auto">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading text-2xl sm:text-3xl mb-3">{t.everythingYouNeed}</h2>
          <p className="text-sm text-muted-foreground">
            {t.comprehensiveTools}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="glass-morphism rounded-2xl p-5 text-center">
            <div className="bg-sage/20 text-sage p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t.dashboardFeature}</h3>
            <p className="text-sm text-muted-foreground">
              {t.dashboardDesc}
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-morphism rounded-2xl p-5 text-center">
            <div className="bg-lavender/20 text-lavender p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t.healthRecords}</h3>
            <p className="text-sm text-muted-foreground">
              {t.healthRecordsDesc}
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-morphism rounded-2xl p-5 text-center">
            <div className="bg-coral/20 text-coral p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t.smartReminders}</h3>
            <p className="text-sm text-muted-foreground">
              {t.smartRemindersDesc}
            </p>
          </motion.div>
          
          {/* Local Services feature hidden
          <motion.div variants={itemVariants} className="glass-morphism rounded-2xl p-6 text-center">
            <div className="bg-lavender/20 text-lavender p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t.localServices}</h3>
            <p className="text-muted-foreground">
              {t.localServicesDesc}
            </p>
          </motion.div>
          */}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
