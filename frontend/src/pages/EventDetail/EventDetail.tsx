import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { EventService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import styles from './EventDetail.module.css';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const { data: event, isLoading, error } = useQuery(
    ['event', id],
    () => EventService.getEventById(Number(id)),
    {
      enabled: !!id,
    }
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/eventos/${id}` } });
      return;
    }

    navigate(`/checkout/${id}?quantity=${quantity}`);
  };

  const isAvailable = event?.ticketsAvailable > 0 && event?.ativo;
  const isSoldOut = event?.ticketsAvailable === 0;
  const isUpcoming = event ? new Date(event.dataHora) > new Date() : false;

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
        <p>Carregando evento...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className={styles.error}>
        <h2>Evento não encontrado</h2>
        <p>O evento que você está procurando não existe ou foi removido.</p>
        <button onClick={() => navigate('/eventos')} className={styles.backButton}>
          Voltar aos eventos
        </button>
      </div>
    );
  }

  return (
    <div className={styles.eventDetail}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <button onClick={() => navigate('/eventos')} className={styles.breadcrumbLink}>
            Eventos
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{event.titulo}</span>
        </nav>

        <div className={styles.content}>
          {/* Event Image */}
          <div className={styles.imageSection}>
            {event.imagemUrl ? (
              <img
                src={event.imagemUrl}
                alt={event.titulo}
                className={styles.eventImage}
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
                  Evento passado
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
          </div>

          {/* Event Info */}
          <div className={styles.infoSection}>
            <div className={styles.header}>
              <div className={styles.category}>
                {event.categoria && (
                  <span className={styles.categoryTag}>{event.categoria}</span>
                )}
              </div>
              <h1 className={styles.title}>{event.titulo}</h1>
              <div className={styles.priceSection}>
                <span className={styles.price}>{formatPrice(Number(event.preco))}</span>
                <span className={styles.priceLabel}>por pessoa</span>
              </div>
            </div>

            <div className={styles.details}>
              <div className={styles.detailItem}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.detailIcon}>
                  <path
                    d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 5C9.45 5 9 5.45 9 6V10C9 10.55 9.45 11 10 11C10.55 11 11 10.55 11 10V6C11 5.45 10.55 5 10 5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 13C9.45 13 9 13.45 9 14C9 14.55 9.45 15 10 15C10.55 15 11 14.55 11 14C11 13.45 10.55 13 10 13Z"
                    fill="currentColor"
                  />
                </svg>
                <div className={styles.detailContent}>
                  <span className={styles.detailLabel}>Data e hora</span>
                  <span className={styles.detailValue}>
                    {formatDate(event.dataHora)} às {formatTime(event.dataHora)}
                  </span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.detailIcon}>
                  <path
                    d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 5C9.45 5 9 5.45 9 6V10C9 10.55 9.45 11 10 11C10.55 11 11 10.55 11 10V6C11 5.45 10.55 5 10 5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 13C9.45 13 9 13.45 9 14C9 14.55 9.45 15 10 15C10.55 15 11 14.55 11 14C11 13.45 10.55 13 10 13Z"
                    fill="currentColor"
                  />
                </svg>
                <div className={styles.detailContent}>
                  <span className={styles.detailLabel}>Local</span>
                  <span className={styles.detailValue}>
                    {event.local || event.espaco?.nome || 'Local a definir'}
                  </span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.detailIcon}>
                  <path
                    d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 5C9.45 5 9 5.45 9 6V10C9 10.55 9.45 11 10 11C10.55 11 11 10.55 11 10V6C11 5.45 10.55 5 10 5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 13C9.45 13 9 13.45 9 14C9 14.55 9.45 15 10 15C10.55 15 11 14.55 11 14C11 13.45 10.55 13 10 13Z"
                    fill="currentColor"
                  />
                </svg>
                <div className={styles.detailContent}>
                  <span className={styles.detailLabel}>Cidade</span>
                  <span className={styles.detailValue}>
                    {event.cidade || event.espaco?.cidade || 'Cidade'}
                  </span>
                </div>
              </div>

              {event.duracaoMin && (
                <div className={styles.detailItem}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.detailIcon}>
                    <path
                      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                      fill="currentColor"
                    />
                    <path
                      d="M10 5C9.45 5 9 5.45 9 6V10C9 10.55 9.45 11 10 11C10.55 11 11 10.55 11 10V6C11 5.45 10.55 5 10 5Z"
                      fill="currentColor"
                    />
                    <path
                      d="M10 13C9.45 13 9 13.45 9 14C9 14.55 9.45 15 10 15C10.55 15 11 14.55 11 14C11 13.45 10.55 13 10 13Z"
                      fill="currentColor"
                    />
                  </svg>
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>Duração</span>
                    <span className={styles.detailValue}>
                      {event.duracaoMin} minutos
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {event.descricao && (
              <div className={styles.description}>
                <h3 className={styles.descriptionTitle}>Sobre o evento</h3>
                <p className={styles.descriptionText}>{event.descricao}</p>
              </div>
            )}

            {/* Purchase Section */}
            <div className={styles.purchaseSection}>
              <div className={styles.purchaseHeader}>
                <h3 className={styles.purchaseTitle}>Comprar ingressos</h3>
                <div className={styles.availability}>
                  <span className={styles.availabilityText}>
                    {event.ticketsAvailable} de {event.totalTickets} ingressos disponíveis
                  </span>
                </div>
              </div>

              {isAvailable && isUpcoming && (
                <div className={styles.quantitySelector}>
                  <label htmlFor="quantity" className={styles.quantityLabel}>
                    Quantidade
                  </label>
                  <div className={styles.quantityControls}>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={styles.quantityButton}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className={styles.quantityInput}
                      min="1"
                      max={event.ticketsAvailable}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(event.ticketsAvailable, quantity + 1))}
                      className={styles.quantityButton}
                      disabled={quantity >= event.ticketsAvailable}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalValue}>
                    {formatPrice(Number(event.preco) * quantity)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBuyClick}
                className={`${styles.buyButton} ${
                  !isAvailable || !isUpcoming
                    ? styles.buyButtonDisabled
                    : styles.buyButtonEnabled
                }`}
                disabled={!isAvailable || !isUpcoming}
              >
                {!isAuthenticated
                  ? 'Fazer login para comprar'
                  : !isUpcoming
                  ? 'Evento passado'
                  : isSoldOut
                  ? 'Esgotado'
                  : `Comprar ${quantity} ingresso${quantity > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
