import React, { useState, useEffect, useCallback } from 'react';
import { 
  CreditCard, 
  Lock, 
  Unlock, 
  Calendar, 
  Search, 
  X, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Plus,
  FileText
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

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
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
      {type === 'success' && <CheckCircle size={18} />}
      {type === 'error' && <AlertTriangle size={18} />}
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

function CashRegister() {
  const [openCashRegister, setOpenCashRegister] = useState(null);
  const [cashRegisters, setCashRegisters] = useState([]);
  const [showOpenForm, setShowOpenForm] = useState(false);
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [initialAmount, setInitialAmount] = useState('');
  const [finalAmount, setFinalAmount] = useState('');
  const [observations, setObservations] = useState('');
  
  
  const [notifications, setNotifications] = useState([]);
  
  
  const [searchDate, setSearchDate] = useState('');
  const [showAllWeeks, setShowAllWeeks] = useState(false);

 
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

 
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    loadCashRegisterData();
  }, []);

  const loadCashRegisterData = async () => {
    try {
      const [open, registers] = await Promise.all([
        window.electron.database.getOpenCashRegister(),
        window.electron.database.getCashRegisters()
      ]);
      setOpenCashRegister(open || null);
      setCashRegisters(registers || []);
    } catch (error) {
      
      addNotification('Erro ao carregar dados do caixa', 'error');
    }
  };

  const handleOpenCashRegister = async () => {
    if (!initialAmount || parseFloat(initialAmount) < 0) {
      addNotification('Informe um valor inicial válido para o caixa', 'error');
      return;
    }

    try {
      const result = await window.electron.database.openCashRegister(parseFloat(initialAmount));
      if (result.success) {
        setOpenCashRegister(result.cashRegister);
        setShowOpenForm(false);
        setInitialAmount('');
        await loadCashRegisterData();
        addNotification('Caixa aberto com sucesso!', 'success');
      } else {
        addNotification('Erro ao abrir caixa: ' + result.error, 'error');
      }
    } catch (error) {
      addNotification('Erro ao abrir caixa', 'error');
    }
  };

  const handleCloseCashRegister = async () => {
    if (!finalAmount || parseFloat(finalAmount) < 0) {
      addNotification('Informe um valor final válido para o caixa', 'error');
      return;
    }

    try {
      const result = await window.electron.database.closeCashRegister(
        parseFloat(finalAmount),
        observations
      );
      if (result.success) {
        setOpenCashRegister(null);
        setShowCloseForm(false);
        setFinalAmount('');
        setObservations('');
        await loadCashRegisterData();
        
        
        const summaryMessage = `Caixa fechado com sucesso!\nValor Inicial: R$ ${result.summary.initialAmount.toFixed(2)}\nVendas: R$ ${result.summary.totalSales.toFixed(2)}\nDiferença: R$ ${result.summary.difference.toFixed(2)}`;
        addNotification(summaryMessage, 'success');
      } else {
        addNotification('Erro ao fechar caixa: ' + result.error, 'error');
      }
    } catch (error) {
      addNotification('Erro ao fechar caixa', 'error');
    }
  };

  
  const filteredRegisters = cashRegisters.filter(register => {
    if (!searchDate) return true;
    
    const registerDate = new Date(register.closed_at);
    const searchDateObj = new Date(searchDate);
    
    
    return registerDate.toDateString() === searchDateObj.toDateString();
  });

  
  const groupedRegisters = filteredRegisters.reduce((acc, register) => {
    const weekStart = getWeekStart(register.closed_at);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!acc[weekKey]) {
      acc[weekKey] = {
        weekStart: weekStart,
        weekLabel: formatWeekRange(weekStart),
        registers: [],
        totalSales: 0,
        totalDifference: 0
      };
    }
    
    acc[weekKey].registers.push(register);
    acc[weekKey].totalSales += register.total_sales;
    acc[weekKey].totalDifference += register.difference || 0;
    
    return acc;
  }, {});

  
  const allWeeks = Object.values(groupedRegisters).sort((a, b) => 
    b.weekStart - a.weekStart
  );

  
  const displayedWeeks = showAllWeeks ? allWeeks : allWeeks.slice(0, 4);

  return (
    <div className="cash-register-container">
     
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
          <CreditCard size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Controle de Caixa
        </h2>
      </header>

      {/* Status do Caixa */}
      <div className="cash-status-card">
        {openCashRegister ? (
          <div className="cash-open">
            <div className="status-indicator">
              <Unlock size={20} className="status-icon open" />
            </div>
            <h3>Caixa Aberto</h3>
            <p className="status-detail">
              <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Aberto em: {formatDateTime(openCashRegister.opened_at)}
            </p>
            <p className="status-amount">
              <TrendingUp size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Valor Inicial: <strong>R$ {openCashRegister.initial_amount.toFixed(2)}</strong>
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowCloseForm(true)}
            >
              <Lock size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Fechar Caixa
            </button>
          </div>
        ) : (
          <div className="cash-closed">
            <div className="status-indicator">
              <Lock size={20} className="status-icon closed" />
            </div>
            <h3>Caixa Fechado</h3>
            <p className="status-detail">Nenhum caixa aberto no momento</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowOpenForm(true)}
            >
              <Unlock size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Abrir Caixa
            </button>
          </div>
        )}
      </div>

      
      {showOpenForm && (
        <div className="modal-overlay" onClick={() => setShowOpenForm(false)}>
          <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Abrir Caixa
              </h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowOpenForm(false)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="form-content">
              <div className="form-group">
                <label>
                  <TrendingUp size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Valor Inicial do Caixa (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-primary" onClick={handleOpenCashRegister}>
                  Abrir Caixa
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowOpenForm(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Fechamento */}
      {showCloseForm && (
        <div className="modal-overlay" onClick={() => setShowCloseForm(false)}>
          <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Lock size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Fechar Caixa
              </h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowCloseForm(false)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="form-content">
              <div className="form-group">
                <label>
                  <TrendingUp size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Valor Final no Caixa (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>
                  <FileText size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Observações:
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Observações sobre o fechamento..."
                  rows="3"
                  className="form-textarea"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-primary" onClick={handleCloseCashRegister}>
                  Fechar Caixa
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowCloseForm(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

     
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
          <div className="weeks-toggle">
            {allWeeks.length > 4 && (
              <button
                type="button"
                className="toggle-weeks-btn"
                onClick={() => setShowAllWeeks(!showAllWeeks)}
              >
                {showAllWeeks ? 'Mostrar últimas 4 semanas' : `Mostrar todas (${allWeeks.length})`}
              </button>
            )}
          </div>
        </div>
      </div>

      
      <div className="history-section">
        <h3 className="section-title">
          <FileText size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Histórico de Caixas
          {searchDate && (
            <span className="search-indicator">
              • {new Date(searchDate).toLocaleDateString('pt-BR')}
            </span>
          )}
        </h3>
        
        {displayedWeeks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <CreditCard size={48} />
            </div>
            <h3>{searchDate ? 'Nenhum caixa encontrado' : 'Nenhum caixa fechado registrado'}</h3>
            <p>{searchDate ? 'Nenhum caixa foi fechado nesta data.' : 'Os caixas fechados aparecerão aqui.'}</p>
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
                    <span className="week-registers-count">
                      {week.registers.length} {week.registers.length === 1 ? 'caixa' : 'caixas'}
                    </span>
                    <span className="week-total-sales">
                      <TrendingUp size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      R$ {week.totalSales.toFixed(2)}
                    </span>
                    <span className={`week-difference ${
                      Math.abs(week.totalDifference) < 0.01 ? 'balanced' : 
                      week.totalDifference > 0 ? 'positive' : 'negative'
                    }`}>
                      {Math.abs(week.totalDifference) < 0.01 ? (
                        <CheckCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      ) : week.totalDifference > 0 ? (
                        <TrendingUp size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      ) : (
                        <AlertTriangle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      )}
                      Dif: R$ {Math.abs(week.totalDifference).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="week-registers">
                  {week.registers.map(register => (
                    <div key={register.id} className="history-item">
                      <div className="history-header">
                        <div className="history-info">
                          <strong>Caixa {register.id}</strong>
                          <div className="history-date">
                            <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Aberto: {formatDateTime(register.opened_at)}
                          </div>
                          <div className="history-date">
                            <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Fechado: {formatDateTime(register.closed_at)}
                          </div>
                        </div>
                        <div className="history-summary">
                          <div className="total-sales">
                            <TrendingUp size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            R$ {register.total_sales.toFixed(2)}
                          </div>
                          <div className={`difference ${
                            Math.abs(register.difference || 0) < 0.01 ? 'balanced' : 
                            (register.difference || 0) > 0 ? 'positive' : 'negative'
                          }`}>
                            {Math.abs(register.difference || 0) < 0.01 ? (
                              <CheckCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            ) : (register.difference || 0) > 0 ? (
                              <TrendingUp size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            ) : (
                              <AlertTriangle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            )}
                            Dif: R$ {Math.abs(register.difference || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="history-details">
                        <div className="detail-item">
                          <span className="detail-label">Inicial:</span>
                          <span className="detail-value">R$ {register.initial_amount.toFixed(2)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Final:</span>
                          <span className="detail-value">R$ {register.final_amount.toFixed(2)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Vendas:</span>
                          <span className="detail-value">R$ {register.total_sales.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {register.observations && (
                        <div className="history-observations">
                          <strong>Obs:</strong> {register.observations}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CashRegister;