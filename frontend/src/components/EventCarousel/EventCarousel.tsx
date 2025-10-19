import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import EventCard, { Event } from '../EventCard/EventCard';
import styles from './EventCarousel.module.css';

interface EventCarouselProps {
  events: Event[];
  title?: string;
  subtitle?: string;
  showBuyButton?: boolean;
  onBuyClick?: (event: Event) => void;
  autoplay?: boolean;
  slidesPerView?: number;
  spaceBetween?: number;
  className?: string;
}

const EventCarousel: React.FC<EventCarouselProps> = ({
  events,
  title = 'Próximos Eventos',
  subtitle,
  showBuyButton = true,
  onBuyClick,
  autoplay = true,
  slidesPerView = 3,
  spaceBetween = 24,
  className = '',
}) => {
  const swiperRef = useRef<any>(null);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update();
    }
  }, [events]);

  if (!events || events.length === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎭</div>
          <p className={styles.emptyText}>Nenhum evento encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        
        {events.length > slidesPerView && (
          <div className={styles.controls}>
            <button
              className={styles.controlButton}
              onClick={handlePrev}
              aria-label="Eventos anteriores"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={styles.controlButton}
              onClick={handleNext}
              aria-label="Próximos eventos"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className={styles.carousel}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          navigation={false}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={autoplay ? {
            delay: 5000,
            disableOnInteraction: false,
          } : false}
          loop={events.length > slidesPerView}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className={styles.swiper}
        >
          {events.map((event) => (
            <SwiperSlide key={event.id} className={styles.slide}>
              <EventCard
                event={event}
                showBuyButton={showBuyButton}
                onBuyClick={onBuyClick}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationDots}>
          {/* Dots serão renderizados automaticamente pelo Swiper */}
        </div>
      </div>
    </div>
  );
};

export default EventCarousel;
