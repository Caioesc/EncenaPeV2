import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { FAQService } from '../../services/api';
import styles from './FAQ.module.css';

interface FAQItem {
  id: number;
  pergunta: string;
  resposta: string;
  categoria: string;
}

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Buscar FAQs
  const { data: faqs, isLoading, error } = useQuery(
    ['faqs', searchTerm, selectedCategory],
    () => FAQService.searchFAQs(searchTerm, selectedCategory),
    {
      keepPreviousData: true,
    }
  );

  // Buscar categorias
  const { data: categories } = useQuery('faqCategories', FAQService.getCategories);

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca é feita automaticamente pelo useQuery
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const filteredFAQs = faqs || [];
  const hasFilters = searchTerm || selectedCategory;

  return (
    <div className={styles.faq}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Central de Ajuda</h1>
          <p className={styles.subtitle}>
            Encontre respostas para as perguntas mais frequentes
          </p>
        </div>

        {/* Search and Filters */}
        <div className={styles.filters}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInput}>
              <input
                type="text"
                placeholder="Buscar perguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="">Todas as categorias</option>
              {categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button onClick={clearFilters} className={styles.clearButton}>
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className={styles.results}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className="spinner" />
              <p>Carregando perguntas...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Erro ao carregar perguntas. Tente novamente.</p>
            </div>
          ) : filteredFAQs.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>❓</div>
              <h3>Nenhuma pergunta encontrada</h3>
              <p>
                {hasFilters
                  ? 'Tente ajustar os filtros ou buscar por outros termos.'
                  : 'Ainda não temos perguntas cadastradas.'}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className={styles.emptyButton}>
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                <p className={styles.resultsCount}>
                  {filteredFAQs.length} pergunta{filteredFAQs.length !== 1 ? 's' : ''} encontrada{filteredFAQs.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className={styles.faqList}>
                {filteredFAQs.map((faq: FAQItem) => (
                  <div key={faq.id} className={styles.faqItem}>
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className={styles.faqQuestion}
                    >
                      <div className={styles.questionContent}>
                        <span className={styles.questionText}>{faq.pergunta}</span>
                        {faq.categoria && (
                          <span className={styles.questionCategory}>
                            {faq.categoria}
                          </span>
                        )}
                      </div>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className={`${styles.expandIcon} ${
                          expandedItems.has(faq.id) ? styles.expandIconRotated : ''
                        }`}
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {expandedItems.has(faq.id) && (
                      <div className={styles.faqAnswer}>
                        <div className={styles.answerContent}>
                          {faq.resposta.split('\n').map((paragraph, index) => (
                            <p key={index} className={styles.answerText}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Contact Section */}
        <div className={styles.contactSection}>
          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3768 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.271 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06679 2.16708 8.43376 2.48353C8.80073 2.79999 9.03996 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.106C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.contactContent}>
              <h3 className={styles.contactTitle}>Não encontrou o que procura?</h3>
              <p className={styles.contactText}>
                Entre em contato conosco e nossa equipe estará pronta para ajudar.
              </p>
              <button className={styles.contactButton}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M2.00334 5.884L9.99999 9.882L17.9967 5.884C17.9883 4.919 17.6382 3.988 17.0078 3.25766C16.3774 2.52732 15.5047 2.04001 14.5483 1.884L9.99999 1L5.45166 1.884C4.49524 2.04001 3.62256 2.52732 2.99219 3.25766C2.36181 3.988 2.01166 4.919 2.00334 5.884Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.00334 5.884L9.99999 9.882L17.9967 5.884"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.00334 5.884L9.99999 9.882L17.9967 5.884"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Enviar mensagem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
