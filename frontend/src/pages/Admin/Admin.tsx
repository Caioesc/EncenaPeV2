import React, { useState, useEffect } from 'react';
import { EventService } from '../../services/api';
import { toast } from 'react-toastify';
import styles from './Admin.module.css';

interface Event {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  cidade: string;
  local: string;
  endereco: string;
  dataHora: string;
  duracaoMin: number;
  preco: number;
  totalTickets: number;
  ticketsAvailable: number;
  imagemUrl: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

const Admin: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await EventService.getAllEventsAdmin(0, 100);
      setEvents(response.content || response);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) {
      return;
    }

    try {
      await EventService.deleteEvent(id);
      toast.success('Evento excluído com sucesso');
      loadEvents();
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      toast.error('Erro ao excluir evento');
    }
  };

  const handleToggleEventStatus = async (event: Event) => {
    try {
      await EventService.updateEvent(event.id, { ativo: !event.ativo });
      toast.success(`Evento ${!event.ativo ? 'ativado' : 'desativado'} com sucesso`);
      loadEvents();
    } catch (error) {
      console.error('Erro ao alterar status do evento:', error);
      toast.error('Erro ao alterar status do evento');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando eventos...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h1>Painel Administrativo</h1>
        <p>Gerencie eventos e configurações do sistema</p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.createButton}
          onClick={() => setShowCreateForm(true)}
        >
          + Novo Evento
        </button>
        <button
          className={styles.refreshButton}
          onClick={loadEvents}
        >
          🔄 Atualizar
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total de Eventos</h3>
          <p>{events.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Eventos Ativos</h3>
          <p>{events.filter(e => e.ativo).length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Eventos Inativos</h3>
          <p>{events.filter(e => !e.ativo).length}</p>
        </div>
      </div>

      <div className={styles.eventsList}>
        <h2>Eventos Cadastrados</h2>
        
        {events.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum evento cadastrado ainda.</p>
            <button
              className={styles.createButton}
              onClick={() => setShowCreateForm(true)}
            >
              Criar Primeiro Evento
            </button>
          </div>
        ) : (
          <div className={styles.eventsGrid}>
            {events.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventImage}>
                  {event.imagemUrl ? (
                    <img src={event.imagemUrl} alt={event.titulo} />
                  ) : (
                    <div className={styles.placeholderImage}>
                      🎭
                    </div>
                  )}
                  <div className={`${styles.statusBadge} ${event.ativo ? styles.active : styles.inactive}`}>
                    {event.ativo ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
                
                <div className={styles.eventInfo}>
                  <h3>{event.titulo}</h3>
                  <p className={styles.category}>{event.categoria}</p>
                  <p className={styles.location}>{event.local} - {event.cidade}</p>
                  <p className={styles.date}>{formatDate(event.dataHora)}</p>
                  <p className={styles.price}>{formatPrice(event.preco)}</p>
                  <p className={styles.tickets}>
                    {event.ticketsAvailable} / {event.totalTickets} ingressos disponíveis
                  </p>
                </div>
                
                <div className={styles.eventActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => setEditingEvent(event)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className={`${styles.toggleButton} ${event.ativo ? styles.deactivate : styles.activate}`}
                    onClick={() => handleToggleEventStatus(event)}
                  >
                    {event.ativo ? '⏸️ Desativar' : '▶️ Ativar'}
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TODO: Implementar formulários de criação e edição */}
      {showCreateForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Criar Novo Evento</h2>
            <p>Formulário de criação será implementado em breve.</p>
            <button onClick={() => setShowCreateForm(false)}>Fechar</button>
          </div>
        </div>
      )}

      {editingEvent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Editar Evento: {editingEvent.titulo}</h2>
            <p>Formulário de edição será implementado em breve.</p>
            <button onClick={() => setEditingEvent(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

