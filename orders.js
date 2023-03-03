"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.populateOrders = void 0;
var database_1 = require("./database");
var faker_1 = require("@faker-js/faker");
faker_1.faker.setLocale('en_US');
/**
 * Populate sylius_order
 * @returns Promise<string[]>
 */
function populateOrders(customerIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database_1.pool.getConnection(function (err, connection) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        var orderIds = new Array();
                        var deleteQuery = 'DELETE FROM sylius_order';
                        connection.query(deleteQuery, function (error, results, fields) {
                            if (error) {
                                reject(error);
                                return;
                            }
                            var resetQuery = 'ALTER TABLE sylius_order AUTO_INCREMENT = 1';
                            connection.query(resetQuery, function (error, results, fields) {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                var orderInsertQueries = new Array();
                                var state = ['New', 'Fulfilled'];
                                var owner = ['lionel.bouzonville@forestadmin.com', 'louis@forestadmin.com', 'steveb@forestadmin.com'];
                                var _loop_1 = function (i) {
                                    var order = {
                                        number: "3",
                                        total: faker_1.faker.commerce.price(),
                                        state: faker_1.faker.helpers.arrayElement(state),
                                        owner: faker_1.faker.helpers.arrayElement(owner),
                                        customer_id: faker_1.faker.helpers.arrayElement(customerIds),
                                        created_at: faker_1.faker.date.recent(60),
                                        updated_at: faker_1.faker.date.recent(60)
                                    };
                                    var insertOrderQuery = 'INSERT INTO sylius_order SET ?';
                                    var insertOrderPromise = new Promise(function (resolve, reject) {
                                        connection.query(insertOrderQuery, order, function (error, results, fields) {
                                            if (error) {
                                                reject(error);
                                                return;
                                            }
                                            orderIds.push(results.insertId.toString());
                                            resolve();
                                        });
                                    });
                                    orderInsertQueries.push(insertOrderPromise);
                                };
                                for (var i = 0; i < 100; i++) {
                                    _loop_1(i);
                                }
                                Promise.all(orderInsertQueries)
                                    .then(function () {
                                    connection.release();
                                    resolve(orderIds);
                                })["catch"](function (error) {
                                    connection.release();
                                    reject(error);
                                });
                            });
                        });
                    });
                })];
        });
    });
}
exports.populateOrders = populateOrders;
