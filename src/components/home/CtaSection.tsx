
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface CtaSectionProps {
  t: Record<string, string>;
}

const CtaSection = ({ t }: CtaSectionProps) => {
  const { user } = useAuth();

  const renderFinalCta = () => {
    if (user) {
      return (
        <Button size="lg" className="rounded-full bg-coral hover:bg-coral/90">
          <Link to="/dashboard" className="flex items-center gap-2">
            {t.dashboard} <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      );
    }

    return (
      <Button size="lg" className="rounded-full bg-coral hover:bg-coral/90">
        <Link to="/auth" className="flex items-center gap-2">
          {t.joinAnabulku} <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    );
  };

  return (
    <section className="py-12 bg-gradient-to-br from-coral/10 via-white to-lavender/20">
      <div className="container px-4 mx-auto text-center">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.ctaHeading}</h2>
          <p className="text-base text-muted-foreground mb-6">
            {t.ctaDescAnabulku}
          </p>
          {renderFinalCta()}
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
