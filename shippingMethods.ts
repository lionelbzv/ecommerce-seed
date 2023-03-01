import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate sylius_shipping_method
 * @returns Promise<string[]>
 */
export async function populateShippingMethods(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const shippingMethodIds = new Array<string>();

            const deleteQuery = 'DELETE FROM sylius_shipping_method';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE sylius_shipping_method AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const shippingMethodInsertQueries = new Array<Promise<void>>();

                    const code = ['ups', 'fedex', 'dhl-express'];
                    const name = ['UPS', 'FedEx Logistics', 'DHL Express'];
                    for (let i = 0; i < 3; i++) {
                        const shippingMethod = {
                            code: code[i],
                            name: name[i],
                            description: faker.lorem.words(),
                            calculator: `{
                                "type": "per_item_rate",
                                "configuration": {
                                    "amount": 1000,
                                    "included_units": 2,
                                    "additional_unit_price": 500
                                }
                            }`,
                        };

                        const insertShippingMethodQuery = 'INSERT INTO sylius_shipping_method SET ?';
                        const insertShippingMethodPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertShippingMethodQuery, shippingMethod, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                shippingMethodIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        shippingMethodInsertQueries.push(insertShippingMethodPromise);
                    }

                    Promise.all(shippingMethodInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(shippingMethodIds);
                        })
                        .catch((error) => {
                            connection.release();
                            reject(error);
                        });
                });
            });
        });
    });
}