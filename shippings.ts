import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate sylius_shipping
 * @returns Promise<string[]>
 */
export async function populateShippings(orderIds: string[], shippingMethodIds: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const shippingIds = new Array<string>();

            const deleteQuery = 'DELETE FROM sylius_shipping';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE sylius_shipping AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const shippingInsertQueries = new Array<Promise<void>>();

                    const state = ['Ready', 'Shipped'];
                    for (let i = 0; i < 100; i++) {
                        const shipping = {
                            state: faker.helpers.arrayElement(state),
                            amount: faker.commerce.price(5, 15),
                            method_id: faker.helpers.arrayElement(shippingMethodIds),
                            order_id: orderIds[i],
                        };

                        const insertShippingQuery = 'INSERT INTO sylius_shipping SET ?';
                        const insertShippingPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertShippingQuery, shipping, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                shippingIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        shippingInsertQueries.push(insertShippingPromise);
                    }

                    Promise.all(shippingInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(shippingIds);
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
