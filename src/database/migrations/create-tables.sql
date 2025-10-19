-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    type TEXT NOT NULL CHECK(type IN ('product', 'service')),
    unit TEXT,
    cost REAL NOT NULL DEFAULT 0,
    barcode TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    payment_details TEXT,
    sale_date TEXT NOT NULL
);

-- Tabela de itens de venda
CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    cost REAL NOT NULL DEFAULT 0,
    barcode TEXT,
    FOREIGN KEY (sale_id) REFERENCES sales (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
);

-- Tabela de caixa
CREATE TABLE IF NOT EXISTS cash_registers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    opened_at DATETIME NOT NULL,
    closed_at DATETIME,
    initial_amount REAL NOT NULL DEFAULT 0,
    final_amount REAL,
    total_sales REAL NOT NULL DEFAULT 0,
    total_entries REAL NOT NULL DEFAULT 0,
    total_withdrawals REAL NOT NULL DEFAULT 0,
    observations TEXT,
    difference REAL DEFAULT 0
);


CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_cash_registers_closed ON cash_registers(closed_at);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
