import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  BarChart3, 
  Calendar, 
  X, 
  Package, 
  CreditCard,
  TrendingUp,
  FileText,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';


const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

const formatWeekRange = (weekStart) => {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(start.getDate() + 6);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };
  
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  
  if (startYear === endYear) {
    return `${formatDate(start)} - ${formatDate(end)}/${startYear.toString().slice(-2)}`;
  } else {
    return `${formatDate(start)}/${startYear.toString().slice(-2)} - ${formatDate(end)}/${endYear.toString().slice(-2)}`;
  }
};

const formatSaleDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};


const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`notification ${type}`}>
      {type === 'success' && <TrendingUp size={18} />}
      {type === 'error' && <X size={18} />}
      {type === 'info' && <FileText size={18} />}
      <span>{message}</span>
      <button 
        type="button" 
        className="notification-close"
        onClick={onClose}
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  );
};

function SalesHistory({ sales }) {
  
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [weeksPerPage, setWeeksPerPage] = useState(4);
  
 
  const [searchDate, setSearchDate] = useState('');
  
  
  const [notifications, setNotifications] = useState([]);

  
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
 
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

 
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Ordenar vendas por data 
  const sortedSales = useMemo(() => {
    return [...sales].sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));
  }, [sales]);

  // Filtrar vendas por data
  const filteredSales = useMemo(() => {
    if (!searchDate) return sortedSales;
    
    const searchDateObj = new Date(searchDate);
    return sortedSales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate.toDateString() === searchDateObj.toDateString();
    });
  }, [sortedSales, searchDate]);

  // Agrupar vendas por semana
  const groupedSales = useMemo(() => {
    return filteredSales.reduce((acc, sale) => {
      const weekStart = getWeekStart(sale.sale_date);
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!acc[weekKey]) {
        acc[weekKey] = {
          weekStart: weekStart,
          weekLabel: formatWeekRange(weekStart),
          sales: [],
          total: 0,
          count: 0,
          items: 0
        };
      }
      
      acc[weekKey].sales.push(sale);
      acc[weekKey].total += sale.total;
      acc[weekKey].count += 1;
      acc[weekKey].items += sale.items.reduce((sum, item) => sum + item.quantity, 0);
      
      return acc;
    }, {});
  }, [filteredSales]);

  
  const allWeeks = useMemo(() => {
    return Object.values(groupedSales).sort((a, b) => b.weekStart - a.weekStart);
  }, [groupedSales]);

  
  const displayedWeeks = useMemo(() => {
    if (searchDate) {
      
      return allWeeks;
    }
    const startIndex = currentWeekOffset * weeksPerPage;
    return allWeeks.slice(startIndex, startIndex + weeksPerPage);
  }, [allWeeks, currentWeekOffset, weeksPerPage, searchDate]);


  const hasPreviousWeeks = useMemo(() => {
    return currentWeekOffset > 0;
  }, [currentWeekOffset]);

  
  const hasNextWeeks = useMemo(() => {
    if (searchDate) return false; 
    const nextStartIndex = (currentWeekOffset + 1) * weeksPerPage;
    return nextStartIndex < allWeeks.length;
  }, [currentWeekOffset, weeksPerPage, allWeeks.length, searchDate]);

  const getTotalSales = () => {
    return filteredSales.reduce((total, sale) => total + sale.total, 0);
  };

  const getTotalItemsSold = () => {
    return filteredSales.reduce((total, sale) => 
      total + sale.items.reduce((sum, item) => sum + item.quantity, 0), 0
    );
  };

  const goToPreviousWeeks = () => {
    if (hasPreviousWeeks) {
      setCurrentWeekOffset(prev => Math.max(0, prev - 1));
    }
  };

  const goToNextWeeks = () => {
    if (hasNextWeeks) {
      setCurrentWeekOffset(prev => prev + 1);
    }
  };

  const resetNavigation = () => {
    setCurrentWeekOffset(0);
  };

  
  useEffect(() => {
    resetNavigation();
  }, [searchDate]);

  return (
    <div className="sales-history-container">
     
      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <header className="section-header">
        <h2>
          <BarChart3 size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Histórico de Vendas
        </h2>
      </header>

      
      <div className="summary-card">
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-label">
              <TrendingUp size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Total de Vendas
            </div>
            <div className="summary-value">R$ {getTotalSales().toFixed(2)}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">
              <Package size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Itens Vendidos
            </div>
            <div className="summary-value">{getTotalItemsSold()}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">
              <Receipt size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Nº de Vendas
            </div>
            <div className="summary-value">{filteredSales.length}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">
              <Calendar size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Semanas Exibidas
            </div>
            <div className="summary-value">{displayedWeeks.length}</div>
          </div>
        </div>
      </div>

      
      <div className="date-search-section">
        <div className="date-search-container">
          <div className="search-input-wrapper">
            <Calendar size={16} className="search-icon" />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="date-input"
              placeholder="Selecione uma data"
            />
            {searchDate && (
              <button
                type="button"
                className="clear-date-btn"
                onClick={() => setSearchDate('')}
                aria-label="Limpar data"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          
          {!searchDate && allWeeks.length > 2 && (
            <div className="weeks-navigation">
              <button
                type="button"
                className="nav-btn"
                onClick={goToPreviousWeeks}
                disabled={!hasPreviousWeeks}
                title="Semanas anteriores"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="nav-info">
                {currentWeekOffset * weeksPerPage + 1} - {Math.min((currentWeekOffset + 1) * weeksPerPage, allWeeks.length)} de {allWeeks.length}
              </span>
              
              <button
                type="button"
                className="nav-btn"
                onClick={goToNextWeeks}
                disabled={!hasNextWeeks}
                title="Próximas semanas"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Histórico por Semana */}
      {displayedWeeks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <BarChart3 size={48} />
          </div>
          <h3>{searchDate ? 'Nenhuma venda encontrada' : 'Nenhuma venda registrada ainda'}</h3>
          <p>{searchDate ? 'Nenhuma venda foi realizada nesta data.' : 'As vendas realizadas aparecerão aqui.'}</p>
        </div>
      ) : (
        <div className="weeks-list">
          {displayedWeeks.map((week, weekIndex) => (
            <div key={week.weekStart.toISOString()} className="week-section">
              <div className="week-header">
                <h3 className="week-title">
                  <Calendar size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Semana de {week.weekLabel}
                </h3>
                <div className="week-summary">
                  <span className="week-sales-count">
                    {week.count} {week.count === 1 ? 'venda' : 'vendas'}
                  </span>
                  <span className="week-total">
                    <TrendingUp size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    R$ {week.total.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="week-sales">
                {week.sales.map(sale => (
                  <div key={sale.id} className="sale-card">
                    <div className="sale-header">
                      <div className="sale-info">
                        <h4 className="sale-id">
                          <Receipt size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                          Venda #{sale.id}
                        </h4>
                        <p className="sale-meta">
                          <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          {formatSaleDate(sale.sale_date)} • 
                          <CreditCard size={12} style={{ marginLeft: '6px', marginRight: '4px', verticalAlign: 'middle' }} />
                          {sale.payment_method}
                        </p>
                      </div>
                      <div className="sale-total">
                        <TrendingUp size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        R$ {sale.total.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="sale-items">
                      {sale.items.map((item, itemIndex) => (
                        <div key={`${sale.id}-${itemIndex}`} className="sale-item">
                          <span className="item-name">
                            <Package size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            {item.quantity}x {item.product_name}
                          </span>
                          <span className="item-total">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

SalesHistory.propTypes = {
  sales: PropTypes.array.isRequired,
};

export default SalesHistory;