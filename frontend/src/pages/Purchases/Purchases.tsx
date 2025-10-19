import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { TicketService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import styles from './Purchases.module.css';

interface Purchase {
  id: number;
  codigo: string;
  qrCode: string;
  status: string;
  dataCompra: string;
  valorTotal: number;
  evento: {
    id: number;
    titulo: string;
    dataHora: string;
    local: string;
    imagemUrl?: string;
  };
}

const Purchases: React.FC = () => {
  const { user } = useAuth();
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const { data: purchases, isLoading, error } = useQuery(
    'userPurchases',
    TicketService.getMyTickets,
    {
      enabled: !!user,
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return styles.statusActive;
      case 'usado':
        return styles.statusUsed;
      case 'cancelado':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'Válido';
      case 'usado':
        return 'Usado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handlePurchaseClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
  };

  const handleCloseModal = () => {
    setSelectedPurchase(null);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
        <p>Carregando suas compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Erro ao carregar compras. Tente novamente.</p>
      </div>
    );
  }

  const purchasesList = purchases || [];

  return (
    <div className={styles.purchases}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Minhas compras</h1>
          <p className={styles.subtitle}>
            Gerencie seus ingressos e acompanhe suas compras
          </p>
        </div>

        {/* Purchases List */}
        {purchasesList.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🎫</div>
            <h3>Nenhuma compra encontrada</h3>
            <p>Você ainda não fez nenhuma compra. Explore nossos eventos!</p>
            <a href="/eventos" className={styles.exploreButton}>
              Explorar eventos
            </a>
          </div>
        ) : (
          <div className={styles.purchasesList}>
            {purchasesList.map((purchase) => (
              <div
                key={purchase.id}
                className={styles.purchaseCard}
                onClick={() => handlePurchaseClick(purchase)}
              >
                <div className={styles.purchaseImage}>
                  {purchase.evento.imagemUrl ? (
                    <img
                      src={purchase.evento.imagemUrl}
                      alt={purchase.evento.titulo}
                    />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <span className={styles.placeholderIcon}>🎭</span>
                    </div>
                  )}
                </div>

                <div className={styles.purchaseInfo}>
                  <div className={styles.purchaseHeader}>
                    <h3 className={styles.eventTitle}>{purchase.evento.titulo}</h3>
                    <span className={`${styles.status} ${getStatusColor(purchase.status)}`}>
                      {getStatusText(purchase.status)}
                    </span>
                  </div>

                  <div className={styles.purchaseDetails}>
                    <div className={styles.detailItem}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
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
                      <span>{formatDateTime(purchase.evento.dataHora)}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
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
                      <span>{purchase.evento.local}</span>
                    </div>
                  </div>

                  <div className={styles.purchaseFooter}>
                    <div className={styles.purchaseDate}>
                      <span className={styles.dateLabel}>Comprado em</span>
                      <span className={styles.dateValue}>{formatDate(purchase.dataCompra)}</span>
                    </div>
                    <div className={styles.purchasePrice}>
                      <span className={styles.priceLabel}>Total</span>
                      <span className={styles.priceValue}>{formatPrice(purchase.valorTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.purchaseActions}>
                  <button className={styles.viewButton}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M1 10S4 3 10 3S19 10 19 10S16 17 10 17S1 10 1 10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Ver ingresso
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Purchase Modal */}
        {selectedPurchase && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Detalhes do ingresso</h2>
                <button onClick={handleCloseModal} className={styles.closeButton}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.ticketInfo}>
                  <div className={styles.ticketHeader}>
                    <h3 className={styles.ticketTitle}>{selectedPurchase.evento.titulo}</h3>
                    <span className={`${styles.ticketStatus} ${getStatusColor(selectedPurchase.status)}`}>
                      {getStatusText(selectedPurchase.status)}
                    </span>
                  </div>

                  <div className={styles.ticketDetails}>
                    <div className={styles.ticketDetail}>
                      <span className={styles.detailLabel}>Código do ingresso</span>
                      <span className={styles.detailValue}>{selectedPurchase.codigo}</span>
                    </div>

                    <div className={styles.ticketDetail}>
                      <span className={styles.detailLabel}>Data e hora</span>
                      <span className={styles.detailValue}>{formatDateTime(selectedPurchase.evento.dataHora)}</span>
                    </div>

                    <div className={styles.ticketDetail}>
                      <span className={styles.detailLabel}>Local</span>
                      <span className={styles.detailValue}>{selectedPurchase.evento.local}</span>
                    </div>

                    <div className={styles.ticketDetail}>
                      <span className={styles.detailLabel}>Valor pago</span>
                      <span className={styles.detailValue}>{formatPrice(selectedPurchase.valorTotal)}</span>
                    </div>
                  </div>

                  {selectedPurchase.qrCode && (
                    <div className={styles.qrCodeSection}>
                      <h4 className={styles.qrCodeTitle}>QR Code</h4>
                      <div className={styles.qrCodeContainer}>
                        <img src={selectedPurchase.qrCode} alt="QR Code" className={styles.qrCode} />
                      </div>
                      <p className={styles.qrCodeText}>
                        Apresente este QR Code na entrada do evento
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;
