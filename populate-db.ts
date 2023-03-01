import { populateCustomers } from './customers';
import { populateAddresses } from './addresses';
import { populateProducts } from './products';
import { populateTaxons } from './taxons';
import { populateProductTaxon } from './productTaxon';
import { populatePaymentMethods } from './paymentMethods';
import { populateShippingMethods } from './shippingMethods';
import { populateOrders } from './orders';
import { populateOrderItems } from './orderItems';

import { pool } from './database';

/**
 * TODO
 * - add image to product
 */


(async () => {
  process.stdout.write('Starting populate the database...');

  const customerIds = await populateCustomers();
  process.stdout.write('.');
  const addressIds = await populateAddresses(customerIds);
  process.stdout.write('.');
  const productIds = await populateProducts();
  process.stdout.write('.');
  const taxonIds = await populateTaxons();
  process.stdout.write('.');
  await populateProductTaxon(productIds, taxonIds);
  process.stdout.write('.');
  const paymentMethodIds = await populatePaymentMethods();
  process.stdout.write('.');
  const shippingMethodIds = await populateShippingMethods();
  process.stdout.write('.');
  const orderIds = await populateOrders(customerIds);
  process.stdout.write('.');
  const orderItemIds = await populateOrderItems(productIds, orderIds);
  process.stdout.write('.');

  pool.end((err) => {
    if (err) throw err;
    console.log(' the database has been populated ! 👏');
  });
})();
