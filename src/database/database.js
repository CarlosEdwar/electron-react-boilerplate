const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

// Caminho para o banco de dados SQLite
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'papelaria.db');

class PapelariaDatabase {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    // Criar diretório se não existir
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

   
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
      } else {
        
        this.createTables();
        this.insertDefaultData();
      }
    });
  }

  
  runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  
  allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  
  getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Criar tabelas
   async createTables() {
    try {
      // Caminho correto para o arquivo SQL
      const migrationPath = path.join(process.cwd(), 'src', 'database', 'migrations', 'create-tables.sql');
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(migrationPath)) {
        console.error('Arquivo de migração não encontrado:', migrationPath);
        return;
      }
      
      const sql = fs.readFileSync(migrationPath, 'utf8');
      const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
      
      for (const stmt of statements) {
        await this.runQuery(stmt);
      }
      
      
    } catch (error) {
      console.error('Erro ao criar tabelas:', error);
    }
  }

  
  async insertDefaultData() {
    
  }

  // === MÉTODOS PARA PRODUTOS ===
  async getProducts() {
    return await this.allQuery('SELECT * FROM products ORDER BY name');
  }

  async getProduct(id) {
    return await this.getQuery('SELECT * FROM products WHERE id = ?', [id]);
  }

  async addProduct(productData) {
    const sql = `
      INSERT INTO products (name, price, category, image, stock, type, unit, cost, barcode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      productData.name,
      parseFloat(productData.price),
      productData.category,
      productData.image,
      parseInt(productData.stock) || 0,
      productData.type,
      productData.unit || null,
      parseFloat(productData.cost) || 0,
      productData.barcode || null
    ];
    
    const result = await this.runQuery(sql, params);
    const product = await this.getProduct(result.lastID);
    return { success: true, product };
  }

  async updateProduct(productId, productData) {
    const fields = [];
    const params = [];
    
    if (productData.name !== undefined) {
      fields.push('name = ?');
      params.push(productData.name);
    }
    if (productData.price !== undefined) {
      fields.push('price = ?');
      params.push(parseFloat(productData.price));
    }
    if (productData.category !== undefined) {
      fields.push('category = ?');
      params.push(productData.category);
    }
    if (productData.image !== undefined) {
      fields.push('image = ?');
      params.push(productData.image);
    }
    if (productData.stock !== undefined) {
      fields.push('stock = ?');
      params.push(parseInt(productData.stock));
    }
    if (productData.type !== undefined) {
      fields.push('type = ?');
      params.push(productData.type);
    }
    if (productData.unit !== undefined) {
      fields.push('unit = ?');
      params.push(productData.unit || null);
    }
    if (productData.cost !== undefined) {
      fields.push('cost = ?');
      params.push(parseFloat(productData.cost) || 0);
    }
    if (productData.barcode !== undefined) {
      fields.push('barcode = ?');
      params.push(productData.barcode || null);
    }
    
    if (fields.length === 0) {
      return { success: false, error: 'Nenhum dado para atualizar' };
    }
    
    params.push(productId);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await this.runQuery(sql, params);
    if (result.changes > 0) {
      const product = await this.getProduct(productId);
      return { success: true, product };
    }
    return { success: false, error: 'Produto não encontrado' };
  }

  async deleteProduct(productId) {
    // Verificar se o produto tem vendas
    const saleCheck = await this.getQuery(
      'SELECT COUNT(*) as count FROM sale_items WHERE product_id = ?',
      [productId]
    );
    
    if (saleCheck.count > 0) {
      return { success: false, error: 'Não é possível excluir produto com histórico de vendas' };
    }
    
    const result = await this.runQuery('DELETE FROM products WHERE id = ?', [productId]);
    if (result.changes > 0) {
      return { success: true };
    }
    return { success: false, error: 'Produto não encontrado' };
  }

  async updateProductStock(productId, newStock) {
    const result = await this.runQuery(
      'UPDATE products SET stock = ? WHERE id = ?',
      [parseInt(newStock), productId]
    );
    
    if (result.changes > 0) {
      return { success: true, changes: result.changes };
    }
    return { success: false, error: 'Produto não encontrado' };
  }

  async getProductByBarcode(barcode) {
    return await this.getQuery('SELECT * FROM products WHERE barcode = ?', [barcode.toString()]);
  }

  // === MÉTODOS PARA VENDAS ===
  async createSale(saleData) {
    // Iniciar transação
    await this.runQuery('BEGIN TRANSACTION');
    
    try {
      // Criar venda
      const saleSql = `
        INSERT INTO sales (total, payment_method, payment_details, sale_date)
        VALUES (?, ?, ?, ?)
      `;
      const saleParams = [
        parseFloat(saleData.total),
        saleData.paymentMethod,
        saleData.paymentDetails ? JSON.stringify(saleData.paymentDetails) : null,
        new Date().toISOString() 
      ];
      
      const saleResult = await this.runQuery(saleSql, saleParams);
      const saleId = saleResult.lastID;
      
      // Criar itens da venda
      const itemSql = `
        INSERT INTO sale_items (sale_id, product_id, product_name, quantity, price, cost, barcode)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      for (const item of saleData.items) {
        const itemParams = [
          saleId,
          item.id,
          item.name,
          parseInt(item.quantity),
          parseFloat(item.price),
          parseFloat(item.cost) || 0,
          item.barcode || null
        ];
        await this.runQuery(itemSql, itemParams);
        
        // Atualizar estoque se for produto
        if (item.type === 'product') {
          await this.runQuery(
            'UPDATE products SET stock = stock - ? WHERE id = ?',
            [parseInt(item.quantity), item.id]
          );
        }
      }
      
      
      await this.runQuery('COMMIT');
      return { success: true, saleId };
    } catch (error) {
     
      await this.runQuery('ROLLBACK');
      throw error;
    }
  }

  async getSalesWithItems() {
    const sales = await this.allQuery(`
      SELECT s.*, 
             GROUP_CONCAT(
               json_object(
                 'id', si.id,
                 'product_id', si.product_id,
                 'product_name', si.product_name,
                 'quantity', si.quantity,
                 'price', si.price,
                 'cost', si.cost,
                 'barcode', si.barcode
               )
             ) as items_json
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      GROUP BY s.id
      ORDER BY s.sale_date DESC
    `);
    
    return sales.map(sale => ({
      ...sale,
      items: sale.items_json ? 
        JSON.parse('[' + sale.items_json.split('}{').join('},{') + ']') : []
    }));
  }

  async getSalesByDateRange(startDate, endDate) {
    const sql = `
      SELECT s.*, 
             GROUP_CONCAT(
               json_object(
                 'id', si.id,
                 'product_id', si.product_id,
                 'product_name', si.product_name,
                 'quantity', si.quantity,
                 'price', si.price,
                 'cost', si.cost,
                 'barcode', si.barcode
               )
             ) as items_json
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      WHERE s.sale_date BETWEEN ? AND ?
      GROUP BY s.id
      ORDER BY s.sale_date DESC
    `;
    
    const sales = await this.allQuery(sql, [startDate, endDate]);
    
    return sales.map(sale => ({
      ...sale,
      items: sale.items_json ? 
        JSON.parse('[' + sale.items_json.split('}{').join('},{') + ']') : []
    }));
  }

  // === MÉTODOS PARA CAIXA ===
  async openCashRegister(initialAmount = 0) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    
    // Verificar se já existe caixa aberto hoje
    const existingOpen = await this.getQuery(`
      SELECT * FROM cash_registers 
      WHERE closed_at IS NULL 
      AND opened_at BETWEEN ? AND ?
    `, [todayStart.toISOString(), todayEnd.toISOString()]);
    
    if (existingOpen) {
      return { success: false, error: 'Já existe um caixa aberto hoje' };
    }
    
    const sql = `
      INSERT INTO cash_registers (opened_at, initial_amount)
      VALUES (?, ?)
    `;
    
    const result = await this.runQuery(sql, [new Date().toISOString(), parseFloat(initialAmount)]);
    const cashRegister = await this.getQuery('SELECT * FROM cash_registers WHERE id = ?', [result.lastID]);
    
    return { success: true, cashRegister };
  }

  async closeCashRegister(finalAmount, observations = '') {
    const openCashRegister = await this.getQuery(
      'SELECT * FROM cash_registers WHERE closed_at IS NULL ORDER BY opened_at DESC LIMIT 1'
    );

    if (!openCashRegister) {
      return { success: false, error: 'Nenhum caixa aberto encontrado' };
    }

    
    const salesInPeriod = await this.allQuery(
      'SELECT total FROM sales WHERE sale_date BETWEEN ? AND ?',
      [openCashRegister.opened_at, new Date().toISOString()]
    );

    const totalSales = salesInPeriod.reduce((sum, sale) => sum + sale.total, 0);

    const expectedAmount = openCashRegister.initial_amount + totalSales +
                      openCashRegister.total_entries - openCashRegister.total_withdrawals;
    const difference = finalAmount - expectedAmount;

    const sql = `
      UPDATE cash_registers 
      SET closed_at = ?, 
          final_amount = ?, 
          total_sales = ?, 
          observations = ?,
          difference = ?
      WHERE id = ?
    `;

    await this.runQuery(sql, [
      new Date().toISOString(),
      parseFloat(finalAmount),
      totalSales,
      observations,
      difference, 
      openCashRegister.id
    ]);

    const updatedCashRegister = await this.getQuery('SELECT * FROM cash_registers WHERE id = ?', [openCashRegister.id]);

    return { 
      success: true, 
      cashRegister: updatedCashRegister,
      summary: {
        initialAmount: openCashRegister.initial_amount,
        totalSales: totalSales,
        entries: openCashRegister.total_entries,
        withdrawals: openCashRegister.total_withdrawals,
        expectedAmount: expectedAmount,
        finalAmount: updatedCashRegister.final_amount,
        difference: difference
      }
    };
  }

  async getOpenCashRegister() {
    return await this.getQuery(
      'SELECT * FROM cash_registers WHERE closed_at IS NULL ORDER BY opened_at DESC LIMIT 1'
    );
  }

  async getCashRegisters() {
    return await this.allQuery(
      'SELECT * FROM cash_registers WHERE closed_at IS NOT NULL ORDER BY closed_at DESC'
    );
  }

  async addCashEntry(amount, description) {
    const openCashRegister = await this.getOpenCashRegister();
    if (!openCashRegister) {
      return { success: false, error: 'Nenhum caixa aberto' };
    }
    
    const sql = `
      UPDATE cash_registers 
      SET total_entries = total_entries + ?
      WHERE id = ?
    `;
    
    await this.runQuery(sql, [parseFloat(amount), openCashRegister.id]);
    const updatedCashRegister = await this.getQuery('SELECT * FROM cash_registers WHERE id = ?', [openCashRegister.id]);
    
    return { success: true, cashRegister: updatedCashRegister };
  }

  async addCashWithdrawal(amount, description) {
    const openCashRegister = await this.getOpenCashRegister();
    if (!openCashRegister) {
      return { success: false, error: 'Nenhum caixa aberto' };
    }
    
    const sql = `
      UPDATE cash_registers 
      SET total_withdrawals = total_withdrawals + ?
      WHERE id = ?
    `;
    
    await this.runQuery(sql, [parseFloat(amount), openCashRegister.id]);
    const updatedCashRegister = await this.getQuery('SELECT * FROM cash_registers WHERE id = ?', [openCashRegister.id]);
    
    return { success: true, cashRegister: updatedCashRegister };
  }

  async getMonthlyReport(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    
    const monthlySales = await this.getSalesByDateRange(startDate.toISOString(), endDate.toISOString());
    const monthlyCashRegisters = await this.allQuery(
      'SELECT * FROM cash_registers WHERE closed_at BETWEEN ? AND ?',
      [startDate.toISOString(), endDate.toISOString()]
    );
    
    const totalSales = monthlySales.reduce((sum, sale) => sum + sale.total, 0);
    const totalProfit = monthlySales.reduce((sum, sale) => {
      const saleProfit = sale.items.reduce((itemSum, item) => {
        return itemSum + ((item.price - (item.cost || 0)) * item.quantity);
      }, 0);
      return sum + saleProfit;
    }, 0);
    
    return {
      period: { year, month },
      totalSales,
      totalProfit,
      totalTransactions: monthlySales.length,
      cashRegisters: monthlyCashRegisters.length,
      dailyAverages: {
        sales: totalSales / new Date(year, month, 0).getDate(),
        transactions: monthlySales.length / new Date(year, month, 0).getDate()
      }
    };
  }

 

  
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = new PapelariaDatabase();