import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { EventService } from '../../services/api';
import EventCard, { Event } from '../../components/EventCard/EventCard';
import styles from './Events.module.css';

const Events: React.FC = () => {
  const [filters, setFilters] = useState({
    categoria: '',
    cidade: '',
    dataInicio: '',
    dataFim: '',
    search: '',
  });
  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Buscar categorias e cidades
  const { data: categoriesData } = useQuery('categories', EventService.getCategories);
  const { data: citiesData } = useQuery('cities', EventService.getCities);

  // Buscar eventos com filtros
  const { data: eventsData, isLoading, error } = useQuery(
    ['events', filters, page],
    () => EventService.getEvents({
      ...filters,
      page,
      size: 12,
    }),
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (citiesData) {
      setCities(citiesData);
    }
  }, [citiesData]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset para primeira página
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      categoria: '',
      cidade: '',
      dataInicio: '',
      dataFim: '',
      search: '',
    });
    setPage(0);
  };

  const handleBuyClick = (event: Event) => {
    window.location.href = `/checkout/${event.id}`;
  };

  const events = eventsData?.content || [];
  const totalPages = eventsData?.totalPages || 0;
  const hasNextPage = !eventsData?.last;
  const hasPreviousPage = !eventsData?.first;

  return (
    <div className={styles.events}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Eventos</h1>
          <p className={styles.subtitle}>
            Descubra os melhores espetáculos teatrais da sua cidade
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInput}>
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className={styles.searchField}
              />
              <button type="submit" className={styles.searchButton}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 19L14.65 14.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>

          <div className={styles.filterRow}>
            <select
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filters.cidade}
              onChange={(e) => handleFilterChange('cidade', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todas as cidades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.dataInicio}
              onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
              className={styles.filterDate}
              placeholder="Data início"
            />

            <input
              type="date"
              value={filters.dataFim}
              onChange={(e) => handleFilterChange('dataFim', e.target.value)}
              className={styles.filterDate}
              placeholder="Data fim"
            />

            <button
              type="button"
              onClick={clearFilters}
              className={styles.clearButton}
            >
              Limpar filtros
            </button>
          </div>
        </div>

        {/* Results */}
        <div className={styles.results}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className="spinner" />
              <p>Carregando eventos...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Erro ao carregar eventos. Tente novamente.</p>
            </div>
          ) : events.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🎭</div>
              <h3>Nenhum evento encontrado</h3>
              <p>Tente ajustar os filtros ou buscar por outros termos.</p>
              <button onClick={clearFilters} className={styles.emptyButton}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                <p className={styles.resultsCount}>
                  {eventsData?.totalElements || 0} eventos encontrados
                </p>
              </div>

              <div className={styles.eventsGrid}>
                {events.map((event: any) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showBuyButton={true}
                    onBuyClick={handleBuyClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!hasPreviousPage}
                    className={styles.paginationButton}
                  >
                    Anterior
                  </button>
                  
                  <div className={styles.paginationInfo}>
                    Página {page + 1} de {totalPages}
                  </div>
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!hasNextPage}
                    className={styles.paginationButton}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
