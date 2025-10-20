import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { EventService, TicketService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import styles from './Checkout.module.css';

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Buscar evento
  const { data: event, isLoading: eventLoading, error: eventError } = useQuery(
    ['event', id],
    () => EventService.getEventById(Number(id)),
    {
      enabled: !!id,
    }
  );

  // Mutation para comprar ingresso
  const purchaseMutation = useMutation(
    (data: { eventId: number; quantity: number }) =>
      TicketService.purchaseTicket({ eventoId: data.eventId, quantidade: data.quantity }),
    {
      onSuccess: (data) => {
        navigate(`/compras/${data.id}`, { 
          state: { message: 'Compra realizada com sucesso!' }
        });
      },
      onError: (error: any) => {
        console.error('Erro ao comprar ingresso:', error);
        // O erro será tratado pelo componente
      },
    }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/checkout/${id}` } });
      return;
    }

    const quantityParam = searchParams.get('quantity');
    if (quantityParam) {
      setQuantity(Number(quantityParam));
    }
  }, [isAuthenticated, id, navigate, searchParams]);

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

  const handleQuantityChange = (newQuantity: number) => {
    if (event && newQuantity > 0 && newQuantity <= event.ticketsAvailable) {
      setQuantity(newQuantity);
    }
  };

  const handlePurchase = async () => {
    if (!event || !user) return;

    setIsProcessing(true);
    try {
      await purchaseMutation.mutateAsync({
        eventId: event.id,
        quantity,
      });
    } catch (error) {
      // Erro já tratado pelo mutation
    } finally {
      setIsProcessing(false);
    }
  };

  const isAvailable = event?.ticketsAvailable > 0 && event?.ativo;
  const isUpcoming = event ? new Date(event.dataHora) > new Date() : false;
  const canPurchase = isAvailable && isUpcoming && !isProcessing;

  if (!isAuthenticated) {
    return null; // Será redirecionado pelo useEffect
  }

  if (eventLoading) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
        <p>Carregando evento...</p>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className={styles.error}>
        <h2>Evento não encontrado</h2>
        <p>O evento que você está tentando comprar não existe ou foi removido.</p>
        <button onClick={() => navigate('/eventos')} className={styles.backButton}>
          Voltar aos eventos
        </button>
      </div>
    );
  }

  const totalPrice = Number(event.preco) * quantity;

  return (
    <div className={styles.checkout}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button
            onClick={() => navigate(`/eventos/${event.id}`)}
            className={styles.backButton}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Voltar ao evento
          </button>
          <h1 className={styles.title}>Finalizar compra</h1>
        </div>

        <div className={styles.content}>
          {/* Event Summary */}
          <div className={styles.eventSummary}>
            <div className={styles.eventImage}>
              {event.imagemUrl ? (
                <img src={event.imagemUrl} alt={event.titulo} />
              ) : (
                <div className={styles.placeholderImage}>
                  <span className={styles.placeholderIcon}>🎭</span>
                </div>
              )}
            </div>
            
            <div className={styles.eventInfo}>
              <h2 className={styles.eventTitle}>{event.titulo}</h2>
              <div className={styles.eventDetails}>
                <div className={styles.eventDetail}>
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
                  <span>{formatDate(event.dataHora)} às {formatTime(event.dataHora)}</span>
                </div>
                <div className={styles.eventDetail}>
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
                  <span>{event.local || event.espaco?.nome || 'Local a definir'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Form */}
          <div className={styles.purchaseForm}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Quantidade de ingressos</h3>
              <div className={styles.quantitySelector}>
                <div className={styles.quantityControls}>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className={styles.quantityButton}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className={styles.quantityInput}
                    min="1"
                    max={event.ticketsAvailable}
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className={styles.quantityButton}
                    disabled={quantity >= event.ticketsAvailable}
                  >
                    +
                  </button>
                </div>
                <div className={styles.quantityInfo}>
                  <span className={styles.quantityLabel}>
                    {event.ticketsAvailable} ingressos disponíveis
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Resumo do pedido</h3>
              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    {quantity} ingresso{quantity > 1 ? 's' : ''} × {formatPrice(Number(event.preco))}
                  </span>
                  <span className={styles.summaryValue}>
                    {formatPrice(Number(event.preco) * quantity)}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Taxa de serviço</span>
                  <span className={styles.summaryValue}>Grátis</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Total</span>
                  <span className={styles.summaryTotal}>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Informações do comprador</h3>
              <div className={styles.buyerInfo}>
                <div className={styles.buyerDetail}>
                  <span className={styles.buyerLabel}>Nome</span>
                  <span className={styles.buyerValue}>{user?.nome}</span>
                </div>
                <div className={styles.buyerDetail}>
                  <span className={styles.buyerLabel}>Email</span>
                  <span className={styles.buyerValue}>{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <div className={styles.purchaseSection}>
              {purchaseMutation.error && (
                <div className={styles.errorAlert}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 6V10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 14H10.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {purchaseMutation.error?.response?.data?.message || 'Erro ao processar compra. Tente novamente.'}
                  </span>
                </div>
              )}

              <button
                onClick={handlePurchase}
                className={`${styles.purchaseButton} ${
                  canPurchase ? styles.purchaseButtonEnabled : styles.purchaseButtonDisabled
                }`}
                disabled={!canPurchase}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner" />
                    Processando...
                  </>
                ) : !isUpcoming ? (
                  'Evento passado'
                ) : !isAvailable ? (
                  'Esgotado'
                ) : (
                  `Comprar ${quantity} ingresso${quantity > 1 ? 's' : ''} por ${formatPrice(totalPrice)}`
                )}
              </button>

              <div className={styles.purchaseInfo}>
                <p className={styles.purchaseText}>
                  Ao finalizar a compra, você receberá um email de confirmação com seus ingressos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
