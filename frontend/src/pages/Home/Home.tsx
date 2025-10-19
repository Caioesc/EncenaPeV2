import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { EventService } from '../../services/api';
import EventCarousel, { Event } from '../../components/EventCarousel/EventCarousel';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  // Buscar eventos em destaque
  const { data: featuredData, isLoading: featuredLoading } = useQuery(
    'featured-events',
    () => EventService.getAvailableEvents(),
    {
      onSuccess: (data) => {
        // Pegar os primeiros 6 eventos disponíveis como destaque
        setFeaturedEvents(data.slice(0, 6));
      }
    }
  );

  // Buscar próximos eventos
  const { data: upcomingData, isLoading: upcomingLoading } = useQuery(
    'upcoming-events',
    () => EventService.getUpcomingEvents(),
    {
      onSuccess: (data) => {
        setUpcomingEvents(data.slice(0, 8));
      }
    }
  );

  const handleBuyClick = (event: Event) => {
    // Redirecionar para página de checkout
    window.location.href = `/checkout/${event.id}`;
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Descubra o melhor do
              <span className={styles.heroHighlight}> teatro</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Encontre e compre ingressos para os melhores espetáculos, 
              musicais e eventos culturais da sua cidade.
            </p>
            <div className={styles.heroActions}>
              <Link to="/eventos" className={styles.primaryButton}>
                Ver Todos os Eventos
              </Link>
              <Link to="/faq" className={styles.secondaryButton}>
                Como Funciona
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroPlaceholder}>
              <span className={styles.heroIcon}>🎭</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className={styles.section}>
        <div className={styles.container}>
          <EventCarousel
            events={featuredEvents}
            title="Eventos em Destaque"
            subtitle="Os espetáculos mais aguardados da temporada"
            showBuyButton={true}
            onBuyClick={handleBuyClick}
            autoplay={true}
            slidesPerView={3}
          />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className={styles.section}>
        <div className={styles.container}>
          <EventCarousel
            events={upcomingEvents}
            title="Próximos Eventos"
            subtitle="Não perca os próximos espetáculos"
            showBuyButton={true}
            onBuyClick={handleBuyClick}
            autoplay={false}
            slidesPerView={4}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>
              Por que escolher o EncenaPe?
            </h2>
            <p className={styles.featuresSubtitle}>
              A plataforma mais completa para sua experiência teatral
            </p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <span>🎫</span>
              </div>
              <h3 className={styles.featureTitle}>Ingressos Seguros</h3>
              <p className={styles.featureDescription}>
                Compre seus ingressos com segurança e receba confirmação por email
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <span>📱</span>
              </div>
              <h3 className={styles.featureTitle}>QR Code Digital</h3>
              <p className={styles.featureDescription}>
                Seus ingressos ficam no celular, sem necessidade de impressão
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <span>🔄</span>
              </div>
              <h3 className={styles.featureTitle}>Cancelamento Fácil</h3>
              <p className={styles.featureDescription}>
                Cancele sua compra até 24h antes do evento com reembolso automático
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <span>🎭</span>
              </div>
              <h3 className={styles.featureTitle}>Variedade de Eventos</h3>
              <p className={styles.featureDescription}>
                Teatro, musical, dança e muito mais em um só lugar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Pronto para sua próxima experiência teatral?
            </h2>
            <p className={styles.ctaSubtitle}>
              Explore nossa programação e garante já seu ingresso
            </p>
            <div className={styles.ctaActions}>
              <Link to="/eventos" className={styles.ctaButton}>
                Explorar Eventos
              </Link>
              <Link to="/register" className={styles.ctaButtonSecondary}>
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
