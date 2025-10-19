import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  X,
  Clipboard,
  ArrowLeft,
  CreditCard,
  DollarSign,
  Smartphone
} from 'lucide-react';

const PIX_KEY = 'lsmkj2015@gmail.com'; 
const MERCHANT_NAME = 'Luis Carlos Barros Saraiva';
const CITY = 'Nossa Senhora de Nazaré';


const calculateCrc16 = (payload) => {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};


const generatePixQrCode = (amount, pixKey, merchantName, city, description = '') => {
  const amountStr = amount.toFixed(2);
  
  
  const payload = [
    
    {
      id: '00',
      value: '01'
    },
    
    {
      id: '01',
      value: '12'
    },
    
    {
      id: '26',
      value: [
        
        {
          id: '00',
          value: 'br.gov.bcb.pix'
        },
       
        {
          id: '01',
          value: pixKey
        },
        
        ...(description ? [{
          id: '02',
          value: description.substring(0, 99)
        }] : [])
      ]
    },
    // Merchant Category Code 
    {
      id: '52',
      value: '0000'
    },
    // Transaction Currency
    {
      id: '53',
      value: '986'
    },
    // Transaction Amount 
    {
      id: '54',
      value: amountStr
    },
    // Country 
    {
      id: '58',
      value: 'BR'
    },
    // Merchant Name 
    {
      id: '59',
      value: merchantName.substring(0, 25)
    },
    // Merchant 
    {
      id: '60',
      value: city.substring(0, 15)
    },
    
    {
      id: '62',
      value: [
        
        {
          id: '05',
          value: '***'
        }
      ]
    }
  ];

 
  const formatField = (field) => {
    if (Array.isArray(field.value)) {
      
      const subFields = field.value.map(subField => 
        subField.id + String(subField.value.length).padStart(2, '0') + subField.value
      ).join('');
      return field.id + String(subFields.length).padStart(2, '0') + subFields;
    } else {
      
      return field.id + String(field.value.length).padStart(2, '0') + field.value;
    }
  };

  
  const payloadWithoutCrc = payload.map(formatField).join('');
  
  
  const crc16 = calculateCrc16(payloadWithoutCrc + '6304');
  return payloadWithoutCrc + '6304' + crc16;
};

function PaymentModal({ total, onClose, onPaymentComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [amountReceived, setAmountReceived] = useState('');
  const [showPixQrCode, setShowPixQrCode] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [splitPayments, setSplitPayments] = useState([
    { method: 'dinheiro', amount: total, received: '' }
  ]);

  const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });

  // Gerar payload PIX
  const pixPayload = useMemo(() => {
    return generatePixQrCode(total, PIX_KEY, MERCHANT_NAME, CITY, `Pagamento PDV - R$ ${total.toFixed(2)}`);
  }, [total]);

  // Troco pagamento simples
  const calculateChange = () => {
    if (paymentMethod === 'dinheiro' && amountReceived) {
      const received = parseFloat(amountReceived);
      return received - total;
    }
    return 0;
  };

  const change = calculateChange();
  const hasValidAmount = paymentMethod === 'dinheiro' ? amountReceived && change >= 0 : true;

  // Total pagamento dividido
  const splitTotal = useMemo(() => {
    return splitPayments.reduce((sum, payment) => {
      const amount = payment.method === 'dinheiro' && payment.received ? 
        parseFloat(payment.received) : 
        parseFloat(payment.amount) || 0;
      return sum + amount;
    }, 0);
  }, [splitPayments]);

  const isSplitValid = useMemo(() => {
    if (!isSplitPayment) return true;

    const hasValidCash = splitPayments.every(payment => {
      if (payment.method === 'dinheiro') {
        const received = parseFloat(payment.received);
        const amount = parseFloat(payment.amount);
        return received >= amount && !isNaN(received);
      }
      return !isNaN(parseFloat(payment.amount));
    });

    return hasValidCash && Math.abs(splitTotal - total) < 0.01; 
  }, [splitPayments, total, isSplitPayment]);

  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type }), 3000);
  };

  const handlePayment = () => {
    if (isSplitPayment) {
      if (!isSplitValid) {
        showNotification('Verifique os valores do pagamento dividido!', 'error');
        return;
      }

      const paymentData = {
        method: 'split',
        payments: splitPayments.map(p => ({
          method: p.method,
          amount: parseFloat(p.amount),
          received: p.method === 'dinheiro' ? parseFloat(p.received) : null
        }))
      };
      onPaymentComplete(paymentData);
    } else {
      if (paymentMethod === 'dinheiro') {
        if (!amountReceived) {
          showNotification('Por favor, informe o valor recebido!', 'error');
          return;
        }
        if (change < 0) {
          showNotification('Valor recebido é menor que o total da compra!', 'error');
          return;
        }
      }

      if (paymentMethod === 'pix') {
        setShowPixQrCode(true);
        return;
      }

      onPaymentComplete(paymentMethod);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmountReceived(value);
    }
  };

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setPixCopied(true);
      showNotification('Código PIX copiado!', 'success');
      setTimeout(() => setPixCopied(false), 2000);
    } catch (err) {
      showNotification('Erro ao copiar código PIX', 'error');
    }
  };

  // Pagamento dividido
  const addSplitPayment = () => {
    if (splitPayments.length < 3) { 
      const remaining = total - splitTotal;
      setSplitPayments([...splitPayments, { 
        method: 'dinheiro', 
        amount: remaining > 0 ? remaining.toFixed(2) : '', 
        received: '' 
      }]);
    }
  };

  const removeSplitPayment = (index) => {
    if (splitPayments.length > 1) {
      const newPayments = splitPayments.filter((_, i) => i !== index);
      setSplitPayments(newPayments);
    }
  };

  const updateSplitPayment = (index, field, value) => {
    const newPayments = [...splitPayments];
    newPayments[index][field] = value;
    setSplitPayments(newPayments);
  };

  // Troco pagamento dividido
  const getSplitChange = () => {
    const cashPayments = splitPayments.filter(p => p.method === 'dinheiro');
    const totalCashReceived = cashPayments.reduce((sum, p) => sum + (parseFloat(p.received) || 0), 0);
    const totalCashAmount = cashPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    return totalCashReceived - totalCashAmount;
  };

  const splitChange = getSplitChange();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <CreditCard size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Pagamento
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.type === 'success' && <CheckCircle size={18} />}
            {notification.type === 'error' && <AlertCircle size={18} />}
            {notification.type === 'info' && <TrendingUp size={18} />}
            <span>{notification.message}</span>
            <button
              type="button"
              className="notification-close"
              onClick={() => setNotification({ show: false, message: '', type: 'error' })}
              aria-label="Fechar notificação"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="payment-content">
          <div className="total-display">
            <span>Total a pagar:</span>
            <strong>
              <DollarSign size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              R$ {total.toFixed(2)}
            </strong>
          </div>

          <div className="split-toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={isSplitPayment}
                onChange={(e) => {
                  setIsSplitPayment(e.target.checked);
                  if (!e.target.checked) {
                    setSplitPayments([{ method: 'dinheiro', amount: total, received: '' }]);
                  }
                }}
              />
              <span className="slider"></span>
            </label>
            <span>Dividir pagamento (máx. 3 formas)</span>
          </div>

          {!isSplitPayment ? (
            <>
              <div className="form-group">
                <label htmlFor="paymentMethod">Forma de Pagamento:</label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    if (e.target.value !== 'dinheiro') {
                      setAmountReceived('');
                    }
                  }}
                  className="payment-select"
                >
                  <option value="dinheiro">💵 Dinheiro</option>
                  <option value="cartao">💳 Cartão</option>
                  <option value="pix">📱 PIX</option>
                </select>
              </div>

              {paymentMethod === 'dinheiro' && (
                <div className="form-group">
                  <label htmlFor="amountReceived">Valor Recebido:</label>
                  <input
                    id="amountReceived"
                    type="text"
                    inputMode="decimal"
                    value={amountReceived}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="amount-input"
                    onFocus={(e) => e.target.select()}
                    autoFocus
                  />
                </div>
              )}

              {paymentMethod === 'dinheiro' && amountReceived && (
                <div className={`change-display ${change >= 0 ? 'valid' : 'invalid'}`}>
                  <span>
                    {change >= 0 ? <CheckCircle size={30} color="#27ae60" /> : <AlertCircle size={20} color="#e74c3c" />}
                  </span>
                  <strong>Troco: R$ {Math.max(0, change).toFixed(2)}</strong>
                </div>
              )}
            </>
          ) : (
            <div className="split-payment-section">
              {splitPayments.map((payment, index) => (
                <div key={index} className="split-payment-item">
                  <div className="split-payment-header">
                    <span>Forma {index + 1}</span>
                    {splitPayments.length > 1 && (
                      <button
                        type="button"
                        className="remove-split-btn"
                        onClick={() => removeSplitPayment(index)}
                        title="Remover forma de pagamento"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="split-payment-row">
                    <select
                      value={payment.method}
                      onChange={(e) => updateSplitPayment(index, 'method', e.target.value)}
                      className="split-method-select"
                    >
                      <option value="dinheiro">💵 Dinheiro</option>
                      <option value="cartao">💳 Cartão</option>
                      <option value="pix">📱 PIX</option>
                    </select>
                    
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={total}
                      value={payment.amount}
                      onChange={(e) => updateSplitPayment(index, 'amount', e.target.value)}
                      placeholder="Valor"
                      className="split-amount-input"
                    />
                    
                    {payment.method === 'dinheiro' && (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={payment.received}
                        onChange={(e) => updateSplitPayment(index, 'received', e.target.value)}
                        placeholder="Recebido"
                        className="split-received-input"
                      />
                    )}
                  </div>
                </div>
              ))}
              
              {splitPayments.length < 3 && (
                <button
                  type="button"
                  className="add-split-btn secondary"
                  onClick={addSplitPayment}
                >
                  <TrendingUp size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Adicionar forma de pagamento
                </button>
              )}
              
              <div className="split-summary">
                <div className="split-total">
                  <span>Total informado:</span>
                  <strong>
                    <DollarSign size={20} style={{ verticalAlign: 'middle', marginRight: 2 }} />
                    R$ {splitTotal.toFixed(2)}
                  </strong>
                </div>
                <div className={`split-remaining ${Math.abs(splitTotal - total) < 0.01 ? 'valid' : 'invalid'}`}>
                  <span>Diferença:</span>
                  <strong>R$ {(splitTotal - total).toFixed(2)}</strong>
                </div>
                {splitChange > 0 && (
                  <div className="split-change">
                    <span>Troco total:</span>
                    <strong>
                      <DollarSign size={14} style={{ verticalAlign: 'middle', marginRight: 2 }} />
                      R$ {splitChange.toFixed(2)}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* QR Code PIX */}
        {showPixQrCode && (
          <div className="pix-qr-section">
            <h3>
              <Smartphone size={24} style={{ verticalAlign: 'middle', marginRight: 6, marginBottom: 6 }} />
              Pagamento PIX
            </h3>
            
            <div className="pix-amount-display">
              <strong>
                <DollarSign size={16} style={{ verticalAlign: 'middle', marginRight: 2, marginBottom: 2 }} />
                Valor: R$ {total.toFixed(2)}
              </strong>
            </div>

            <div className="qr-code-container">
              <QRCodeSVG
                value={pixPayload}
                size={300}
                level="M"
                includeMargin={true}
              />
            </div>

            <div className="pix-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={copyPixCode}
              >
                <Clipboard size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {pixCopied ? 'Copiado!' : 'Copiar Código'}
              </button>
              
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowPixQrCode(false)}
              >
                <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Voltar
              </button>
              
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setShowPixQrCode(false);
                  onPaymentComplete('pix');
                }}
              >
                <CheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Confirmar Pagamento
              </button>
            </div>

            <div className="pix-instructions">
              <p><strong>Como pagar:</strong></p>
              <ol>
                <li>Abra o app do seu banco</li>
                <li>Escolha "Pagar com PIX"</li>
                <li>Aponte a câmera para o QR Code</li>
                <li>Confirme o pagamento</li>
                <li>Clique em "Confirmar Pagamento" acima</li>
              </ol>
            </div>
          </div>
        )}

        {!showPixQrCode && (
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Cancelar
            </button>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handlePayment}
              disabled={isSplitPayment ? !isSplitValid : !hasValidAmount}
            >
              {paymentMethod === 'pix' ? (
                <>
                  <Smartphone size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Gerar PIX
                </>
              ) : (
                <>
                  <CheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Confirmar
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

PaymentModal.propTypes = {
  total: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onPaymentComplete: PropTypes.func.isRequired,
};

export default PaymentModal;