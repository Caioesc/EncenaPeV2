import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './EventCard.module.css';

export interface Event {
  id: number;
  titulo: string;
  descricao?: string;
  categoria?: string;
  cidade?: string;
  local?: string;
  endereco?: string;
  dataHora: string;
  duracaoMin?: number;
  preco: number;
  totalTickets: number;
  ticketsAvailable: number;
  imagemUrl?: string;
  ativo: boolean;
  espaco?: {
    id: number;
    nome: string;
    descricao?: string;
    endereco?: string;
    cidade?: string;
    capacidade: number;
    disponivel: boolean;
  };
}

interface EventCardProps {
  event: Event;
  showBuyButton?: boolean;
  onBuyClick?: (event: Event) => void;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  showBuyButton = true,
  onBuyClick,
  className = '',
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm", { locale: ptBR });
  };

  const isAvailable = event.ticketsAvailable > 0 && event.ativo;
  const isSoldOut = event.ticketsAvailable === 0;
  const isUpcoming = new Date(event.dataHora) > new Date();

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuyClick && isAvailable && isUpcoming) {
      onBuyClick(event);
    }
  };

  return (
    <div className={`${styles.card} ${className}`}>
      <Link to={`/eventos/${event.id}`} className={styles.cardLink}>
        {/* Event Image */}
        <div className={styles.imageContainer}>
          {event.imagemUrl ? (
            <img
              src={event.imagemUrl}
              alt={event.titulo}
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span className={styles.placeholderIcon}>🎭</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className={styles.statusBadge}>
            {!isUpcoming && (
              <span className={`${styles.badge} ${styles.badgePast}`}>
                Passado
              </span>
            )}
            {isSoldOut && isUpcoming && (
              <span className={`${styles.badge} ${styles.badgeSoldOut}`}>
                Esgotado
              </span>
            )}
            {isAvailable && isUpcoming && (
              <span className={`${styles.badge} ${styles.badgeAvailable}`}>
                Disponível
              </span>
            )}
          </div>

          {/* Category Badge */}
          {event.categoria && (
            <div className={styles.categoryBadge}>
              <span className={styles.categoryText}>{event.categoria}</span>
            </div>
          )}
        </div>

        {/* Event Content */}
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>{event.titulo}</h3>
            <div className={styles.price}>{formatPrice(event.preco)}</div>
          </div>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={styles.detailIcon}
              >
                <path
                  d="M8 0C3.58 0 0 3.58 0 8C0 14 8 16 8 16S16 14 16 8C16 3.58 12.42 0 8 0ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10Z"
                  fill="currentColor"
                />
              </svg>
              <span className={styles.detailText}>
                {event.local || event.espaco?.nome || 'Local a definir'}
              </span>
            </div>

            <div className={styles.detailItem}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={styles.detailIcon}
              >
                <path
                  d="M8 0C3.58 0 0 3.58 0 8C0 14 8 16 8 16S16 14 16 8C16 3.58 12.42 0 8 0ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10Z"
                  fill="currentColor"
                />
              </svg>
              <span className={styles.detailText}>
                {event.cidade || event.espaco?.cidade || 'Cidade'}
              </span>
            </div>

            <div className={styles.detailItem}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={styles.detailIcon}
              >
                <path
                  d="M8 0C3.58 0 0 3.58 0 8C0 14 8 16 8 16S16 14 16 8C16 3.58 12.42 0 8 0ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10Z"
                  fill="currentColor"
                />
              </svg>
              <span className={styles.detailText}>
                {formatDate(event.dataHora)} às {formatTime(event.dataHora)}
              </span>
            </div>

            {event.duracaoMin && (
              <div className={styles.detailItem}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={styles.detailIcon}
                >
                  <path
                    d="M8 0C3.58 0 0 3.58 0 8C0 14 8 16 8 16S16 14 16 8C16 3.58 12.42 0 8 0ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10Z"
                    fill="currentColor"
                  />
                </svg>
                <span className={styles.detailText}>
                  {event.duracaoMin} minutos
                </span>
              </div>
            )}
          </div>

          {/* Tickets Info */}
          <div className={styles.ticketsInfo}>
            <span className={styles.ticketsText}>
              {event.ticketsAvailable} de {event.totalTickets} ingressos disponíveis
            </span>
          </div>

          {/* Description */}
          {event.descricao && (
            <p className={styles.description}>
              {event.descricao.length > 100
                ? `${event.descricao.substring(0, 100)}...`
                : event.descricao}
            </p>
          )}
        </div>
      </Link>

      {/* Buy Button */}
      {showBuyButton && (
        <div className={styles.footer}>
          <button
            className={`${styles.buyButton} ${
              !isAvailable || !isUpcoming
                ? styles.buyButtonDisabled
                : styles.buyButtonEnabled
            }`}
            onClick={handleBuyClick}
            disabled={!isAvailable || !isUpcoming}
          >
            {!isUpcoming
              ? 'Evento passado'
              : isSoldOut
              ? 'Esgotado'
              : 'Comprar ingresso'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
