import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Package, 
  FileText, 
  PenTool, 
  Monitor, 
  Wrench,
  Plus,
  X,
  Edit3,
  Trash2,
  Search,
  Filter,
  RotateCcw,
  TrendingUp,
  Wallet,
  Calculator,
  Tag,
  Type,
  Layers,
  Box,
  Barcode,
  Clipboard as ClipboardIcon,
  Palette as PaletteIcon,
  Image as ImageIcon,
  Globe as GlobeIcon,
  Keyboard as KeyboardIcon,
  Book as BookIcon,
  Camera as CameraIcon,
  Folder as FolderIcon
} from 'lucide-react';

// Componentes de ícone 
const Printer = () => <Package size={18} />;
const Clipboard = () => <ClipboardIcon size={18} />;
const Palette = () => <PaletteIcon size={18} />;
const Image = () => <ImageIcon size={18} />;
const Bookmark = () => <FileText size={18} />;
const Globe = () => <GlobeIcon size={18} />;
const Keyboard = () => <KeyboardIcon size={18} />;
const Book = () => <BookIcon size={18} />;
const Camera = () => <CameraIcon size={18} />;
const Folder = () => <FolderIcon size={18} />;
const BoxIcon = () => <Box size={18} />;

// Mapa de ícones
const iconMap = {
  'file-text': FileText,
  'pen-tool': PenTool,
  'pencil': PenTool,
  'notebook': FileText,
  'printer': Printer,
  'clipboard': Clipboard,
  'palette': Palette,
  'image': Image,
  'bookmark': Bookmark,
  'globe': Globe,
  'keyboard': Keyboard,
  'book': Book,
  'camera': Camera,
  'folder': Folder,
  'box': BoxIcon,
  'package': Package
};

const iconOptions = [
  { key: 'file-text', name: 'Documento', icon: FileText },
  { key: 'pen-tool', name: 'Caneta', icon: PenTool },
  { key: 'pencil', name: 'Lápis', icon: PenTool },
  { key: 'notebook', name: 'Caderno', icon: FileText },
  { key: 'printer', name: 'Impressora', icon: Printer },
  { key: 'clipboard', name: 'Prancheta', icon: Clipboard },
  { key: 'palette', name: 'Paleta', icon: Palette },
  { key: 'image', name: 'Imagem', icon: Image },
  { key: 'bookmark', name: 'Marcador', icon: Bookmark },
  { key: 'globe', name: 'Globo', icon: Globe },
  { key: 'keyboard', name: 'Teclado', icon: Keyboard },
  { key: 'book', name: 'Livro', icon: Book },
  { key: 'camera', name: 'Câmera', icon: Camera },
  { key: 'folder', name: 'Pasta', icon: Folder },
  { key: 'box', name: 'Caixa', icon: BoxIcon },
  { key: 'package', name: 'Pacote', icon: Package }
];


const Notification = ({ message, type, onClose }) => (
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

function ProductManager({ products, onProductAdded, onProductUpdated, onProductDeleted }) { 
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCapturingBarcode, setIsCapturingBarcode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    cost: '',
    type: 'product',
    unit: '',
    image: 'file-text',
    barcode: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedType, setSelectedType] = useState('Todos');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });

  const categories = ['Papelaria', 'Escritório', 'Informática', 'Serviços'];

  const stats = useMemo(() => {
    const total = products.length;
    const productsCount = products.filter(p => p.type === 'product').length;
    const servicesCount = products.filter(p => p.type === 'service').length;
    
    const categoryCounts = {};
    categories.forEach(cat => {
      categoryCounts[cat] = products.filter(p => p.category === cat).length;
    });
    
    return { total, productsCount, servicesCount, categoryCounts };
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchTerm));
      
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesType = selectedType === 'Todos' || product.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [products, searchTerm, selectedCategory, selectedType]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      stock: '',
      cost: '',
      type: 'product',
      unit: '',
      image: 'file-text',
      barcode: ''
    });
    setEditingProduct(null);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type }), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: formData.type === 'product' ? parseInt(formData.stock) : 0,
      cost: parseFloat(formData.cost) || 0
    };

    try {
      if (editingProduct) {
        const result = await window.electron.database.updateProduct(editingProduct.id, productData);
        if (result.success) {
          onProductUpdated(result.product);
          setShowForm(false);
          resetForm();
          showNotification('Produto atualizado com sucesso!', 'success');
        } else {
          showNotification('Erro ao atualizar produto: ' + result.error, 'error');
        }
      } else {
        const result = await window.electron.database.addProduct(productData);
        if (result.success) {
          onProductAdded(result.product);
          setShowForm(false);
          resetForm();
          showNotification('Produto adicionado com sucesso!', 'success');
        } else {
          showNotification('Erro ao adicionar produto: ' + result.error, 'error');
        }
      }
    } catch (error) {
      showNotification('Erro ao salvar produto', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock?.toString() || '0',
      cost: (product.cost || 0).toString(),
      type: product.type,
      unit: product.unit || '',
      image: product.image || 'file-text',
      barcode: product.barcode || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?\n\nEsta ação não pode ser desfeita.')) {
      try {
        const result = await window.electron.database.deleteProduct(productId);
        if (result.success) {
          onProductDeleted(productId);
          showNotification('Produto excluído com sucesso!', 'success');
        } else {
          showNotification('Erro ao excluir produto: ' + result.error, 'error');
        }
      } catch (error) {
        showNotification('Erro ao excluir produto', 'error');
      }
    }
  };

 
useEffect(() => {
  let barcodeBuffer = '';
  let barcodeTimeout;
  let isProcessing = false; 

  const handleGlobalKeydown = (event) => {
    const key = event.key;
    
    
    if (isProcessing) {
      return;
    }

    
    if (showForm) {
      
      if (key === 'Enter' && barcodeBuffer.length > 0) {
        isProcessing = true; 
        
        
       
        setFormData(prev => ({ 
          ...prev, 
          barcode: barcodeBuffer 
        }));
        
        setIsCapturingBarcode(true);
        
       
        setTimeout(() => {
          barcodeBuffer = '';
          isProcessing = false;
          setIsCapturingBarcode(false);
        }, 100);
        
        event.preventDefault();
        return;
      }
    } 
    
    else {
      
      if (key === 'Enter' && barcodeBuffer.length > 3) {
        isProcessing = true; 
        console.log('🔍 Código capturado para BUSCA:', barcodeBuffer);
        
        
        const produtoEncontrado = products.find(p => p.barcode === barcodeBuffer);
        
        if (produtoEncontrado) {
          showNotification(`✅ ${produtoEncontrado.nome} encontrado!`, 'success');
        } else {
          showNotification('❌ Produto não encontrado! Cadastre este produto.', 'error');
        }
        
        
        setTimeout(() => {
          barcodeBuffer = '';
          isProcessing = false;
        }, 100);
        
        event.preventDefault();
        return;
      }
    }
    
    
    if (/^[a-zA-Z0-9]$/.test(key)) {
      barcodeBuffer += key;
      
      
      clearTimeout(barcodeTimeout);
      barcodeTimeout = setTimeout(() => {
        if (barcodeBuffer.length > 0) {
          console.log('⏰ Buffer limpo (timeout):', barcodeBuffer);
          barcodeBuffer = '';
        }
      }, 150); 
    }
  };

  window.addEventListener('keydown', handleGlobalKeydown);
  
  return () => {
    window.removeEventListener('keydown', handleGlobalKeydown);
    clearTimeout(barcodeTimeout);
  };
}, [showForm, products, showNotification]); 

  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowForm(false);
    };
    if (showForm) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [showForm]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todas');
    setSelectedType('Todos');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'Todas' || selectedType !== 'Todos';

  const renderIcon = (iconKey) => {
    const IconComponent = iconMap[iconKey] || FileText;
    return <IconComponent size={24} />;
  };

  return (
    <div className="product-manager-container">
      
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: 'info' })}
        />
      )}
      
      <div className="section-header">
        <div className="header-info">
          <h2>
            <Package size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Gerenciar Produtos
          </h2>
          <div className="product-stats">
            <span className="stat-item">
              Total: <strong>{stats.total}</strong>
            </span>
            <span className="stat-item">
              <span className="stat-badge product">Produtos: <strong>{stats.productsCount}</strong></span>
            </span>
            <span className="stat-item">
              <span className="stat-badge service">Serviços: <strong>{stats.servicesCount}</strong></span>
            </span>
          </div>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Novo Produto
        </button>
      </div>

      <div className="filters-section compact">
        <div className="filters-row">
          
          <div className="search-compact">
            <Search size={16} className="search-icon-compact" />
            <input
              type="text"
              placeholder="Buscar produtos por nome, categoria ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-compact"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-compact"
                onClick={() => setSearchTerm('')}
                aria-label="Limpar busca"
              >
                <X size={14} />
              </button>
            )}
          </div>

          
          <div className="filters-compact">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select-compact"
            >
              <option value="Todas">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select-compact"
            >
              <option value="Todos">Todos</option>
              <option value="product">Produtos</option>
              <option value="service">Serviços</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn-clear-compact"
                onClick={clearAllFilters}
                title="Limpar filtros"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="filter-results-compact">
          <span>
            <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> produtos
            {searchTerm && ` • Busca: "${searchTerm}"`}
            {selectedCategory !== 'Todas' && ` • Categoria: ${selectedCategory}`}
            {selectedType !== 'Todos' && ` • Tipo: ${selectedType === 'product' ? 'Produtos' : 'Serviços'}`}
          </span>
        </div>
      </div>

      
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div 
            className="modal-content product-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {editingProduct ? (
                  <>
                    <Edit3 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Editar Produto
                  </>
                ) : (
                  <>
                    <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Novo Produto
                  </>
                )}
              </h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <Barcode size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Código de Barras:
                  </label>
                  <input
                    id="barcodeInput"
                    type="text"
                    value={formData.barcode || ''}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    placeholder="Digitalize o código de barras aqui"
                    className={`form-input ${isCapturingBarcode ? 'capturing-barcode' : ''}`}
                  />
                  <div className="barcode-help">
                    {isCapturingBarcode ? (
                      <div className="barcode-success">
                        <TrendingUp size={14} />
                        Código capturado com sucesso!
                      </div>
                    ) : (
                      <small>Digitalize para preencher automaticamente</small>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <Tag size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Nome do Produto/Serviço:
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    maxLength="100"
                    placeholder="Ex: Caneta Bic, Xerox Preto e Branco"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <Wallet size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Preço de Venda (R$):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="99999.99"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <Calculator size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Custo (R$):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="99999.99"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <Layers size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Categoria:
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    >
                      <option value="">Selecione...</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      <Type size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Tipo:
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="product">Produto</option>
                      <option value="service">Serviço</option>
                    </select>
                  </div>
                </div>

                {formData.type === 'product' && (
                  <div className="form-group">
                    <label>
                      <Box size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Estoque:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99999"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      required
                      placeholder="0"
                    />
                  </div>
                )}

                {formData.type === 'service' && (
                  <div className="form-group">
                    <label>
                      <Type size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Unidade de Medida:
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      placeholder="ex: por página, por hora, etc."
                      maxLength="50"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>
                    <ImageIcon size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Ícone:
                  </label>
                  <div className="icon-selector">
                    {iconOptions.map(iconOption => {
                      const IconComponent = iconOption.icon;
                      return (
                        <button
                          key={iconOption.key}
                          type="button"
                          className={`icon-btn ${formData.image === iconOption.key ? 'active' : ''}`}
                          onClick={() => setFormData({...formData, image: iconOption.key})}
                          aria-label={`Ícone ${iconOption.name}`}
                          title={iconOption.name}
                        >
                          <IconComponent size={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {editingProduct ? 'Atualizar Produto' : 'Adicionar Produto'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          {products.length === 0 ? (
            <>
              <div className="empty-icon">
                <Package size={48} />
              </div>
              <h3>Nenhum produto cadastrado</h3>
              <p>Clique em "Novo Produto" para começar a gerenciar seu estoque.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Cadastrar Primeiro Produto
              </button>
            </>
          ) : (
            <>
              <div className="empty-icon">
                <Search size={48} />
              </div>
              <h3>Nenhum produto encontrado</h3>
              <p>Ajuste os filtros ou tente uma busca diferente.</p>
              <button
                type="button"
                className="btn-secondary"
                onClick={clearAllFilters}
              >
                <RotateCcw size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Limpar Filtros
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => {
            const ProductIcon = iconMap[product.image] || FileText;
            return (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <div className="product-icon">
                    <ProductIcon size={24} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-meta">
                      <span className="category-tag">{product.category}</span>
                      <span className={`type-tag ${product.type}`}>
                        {product.type === 'service' ? 'Serviço' : 'Produto'}
                      </span>
                      {product.barcode && (
                        <span className="barcode-tag">
                          <Barcode size={12} />
                          {product.barcode}
                        </span>
                      )}
                      {product.type === 'product' && (
                        <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                          {product.stock === 0 ? 'Sem estoque' : `${product.stock} un`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="product-details">
                  <div className="price-row">
                    <span className="label">Venda:</span>
                    <span className="value sale-price">R$ {product.price.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span className="label">Custo:</span>
                    <span className="value cost-price">R$ {(product.cost || 0).toFixed(2)}</span>
                  </div>
                  {product.cost > 0 && product.price > 0 && (
                    <div className="price-row">
                      <span className="label">Lucro:</span>
                      <span className="value profit">
                        R$ {(product.price - product.cost).toFixed(2)} 
                        <span className="profit-percentage">
                          ({(((product.price - product.cost) / product.cost) * 100).toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                  )}

                  {product.type === 'product' && (
                    <div className="stock-info">
                      <span className="label">Estoque:</span>
                      <span className={`value ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                        {product.stock} unidades
                      </span>
                    </div>
                  )}

                  {product.type === 'service' && product.unit && (
                    <div className="unit-info">
                      <span className="label">Unidade:</span>
                      <span className="value">{product.unit}</span>
                    </div>
                  )}
                </div>

                <div className="product-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit3 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

ProductManager.propTypes = {
  products: PropTypes.array.isRequired,
  onProductAdded: PropTypes.func.isRequired,
  onProductUpdated: PropTypes.func.isRequired,
  onProductDeleted: PropTypes.func.isRequired,
};

export default ProductManager;