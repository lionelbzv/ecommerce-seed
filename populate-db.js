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
var customers_1 = require("./customers");
var addresses_1 = require("./addresses");
var products_1 = require("./products");
var taxons_1 = require("./taxons");
var productTaxon_1 = require("./productTaxon");
var paymentMethods_1 = require("./paymentMethods");
var shippingMethods_1 = require("./shippingMethods");
var orders_1 = require("./orders");
var orderItems_1 = require("./orderItems");
var payments_1 = require("./payments");
var shippings_1 = require("./shippings");
var customerIssues_1 = require("./customerIssues");
var customerIssueSupports_1 = require("./customerIssueSupports");
var database_1 = require("./database");
/**
 * @todo
 */
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var customerIds, addressIds, productIds, taxonIds, paymentMethodIds, shippingMethodIds, orderIds, orderItemIds, paymentIds, shippingIds, customerIssueIds, customerIssueSupportIds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                process.stdout.write('Starting populate the database...');
                return [4 /*yield*/, (0, customers_1.populateCustomers)()];
            case 1:
                customerIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, addresses_1.populateAddresses)(customerIds)];
            case 2:
                addressIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, products_1.populateProducts)()];
            case 3:
                productIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, taxons_1.populateTaxons)()];
            case 4:
                taxonIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, productTaxon_1.populateProductTaxon)(productIds, taxonIds)];
            case 5:
                _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, paymentMethods_1.populatePaymentMethods)()];
            case 6:
                paymentMethodIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, shippingMethods_1.populateShippingMethods)()];
            case 7:
                shippingMethodIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, orders_1.populateOrders)(customerIds)];
            case 8:
                orderIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, orderItems_1.populateOrderItems)(productIds, orderIds)];
            case 9:
                orderItemIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, payments_1.populatePayments)(orderIds, paymentMethodIds)];
            case 10:
                paymentIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, shippings_1.populateShippings)(orderIds, shippingMethodIds)];
            case 11:
                shippingIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, customerIssues_1.populateCustomerIssues)(orderIds)];
            case 12:
                customerIssueIds = _a.sent();
                process.stdout.write('.');
                return [4 /*yield*/, (0, customerIssueSupports_1.populateCustomerIssueSupports)(customerIssueIds)];
            case 13:
                customerIssueSupportIds = _a.sent();
                process.stdout.write('.');
                database_1.pool.end(function (err) {
                    if (err)
                        throw err;
                    console.log(' the database has been populated ! ????');
                });
                return [2 /*return*/];
        }
    });
}); })();
