import React from 'react';
import PropTypes from 'prop-types';
import { 
  Package, 
  FileText, 
  PenTool, 
  Monitor, 
  Wrench,
  AlertTriangle,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

function StockManager({ products, onUpdateStock }) {
  const productsWithStock = products.filter(product => product.type === 'product');

 
  const categoryIcons = {
    'Papelaria': FileText,
    'Escritório': PenTool,
    'Informática': Monitor,
    'Serviços': Wrench
  };

  
  const renderProductIcon = (product) => {
    const IconComponent = categoryIcons[product.category] || Package;
    return <IconComponent size={24} />;
  };

  return (
    <div className="stock-manager-container">
      <header className="section-header">
        <h2>
          <Package size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Gerenciar Estoque
        </h2>
      </header>

      {productsWithStock.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Package size={48} />
          </div>
          <h3>Nenhum produto com estoque</h3>
          <p>Adicione produtos físicos para gerenciar seu estoque.</p>
        </div>
      ) : (
        <div className="stock-grid">
          {productsWithStock.map(product => (
            <div key={product.id} className="stock-card">
              <div className="product-header">
                <div className="product-icon">
                  {renderProductIcon(product)}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                </div>
              </div>

              <div className="stock-controls">
                <span className="stock-label">Estoque:</span>
                <input
                  type="number"
                  min="0"
                  value={Number(product.stock)}
                  onChange={(e) => onUpdateStock(product.id, Number(e.target.value))}
                  className="stock-input"
                />
                <span className={`stock-quantity ${
                  Number(product.stock) < 10 ? 'low-stock' :
                  Number(product.stock) < 20 ? 'medium-stock' : 'healthy-stock'
                }`}>
                  {Number(product.stock)} uni.
                  {Number(product.stock) < 10 && (
                    <AlertTriangle size={12} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                  )}
                  {Number(product.stock) >= 20 && (
                    <CheckCircle size={12} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                  )}
                </span>
              </div>

              <div className="product-price-info">
                <TrendingUp size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                R$ {product.price.toFixed(2)} /unidade
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

StockManager.propTypes = {
  products: PropTypes.array.isRequired,
  onUpdateStock: PropTypes.func.isRequired,
};

export default StockManager;