import * as mysql from 'mysql';

export const pool = mysql.createPool({
  connectionLimit: 10,
  host: '127.0.0.1',
  port: 3308,
  user: 'root',
  password: 'root',
  database: 'sylius_ecommerce'
});