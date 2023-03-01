"use strict";
exports.__esModule = true;
exports.pool = void 0;
var mysql = require("mysql");
exports.pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    port: 3308,
    user: 'root',
    password: 'root',
    database: 'sylius_ecommerce'
});
