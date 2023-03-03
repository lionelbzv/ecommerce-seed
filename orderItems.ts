import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate sylius_order_item
 * @returns Promise<string[]>
 */
export async function populateOrderItems(productIds: string[], orderIds: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const orderItemIds = new Array<string>();

            const deleteQuery = 'DELETE FROM sylius_order_item';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE sylius_order_item AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const orderItemInsertQueries = new Array<Promise<void>>();

                    for (let i = 0; i < 300; i++) {
                        const price = faker.commerce.price();
                        const orderItem = {
                            quantity: 1,
                            unit_price: price,
                            total: price,
                            product_id: faker.helpers.arrayElement(productIds),
                            order_id: faker.helpers.arrayElement(orderIds),
                        };

                        const insertOrderItemQuery = 'INSERT INTO sylius_order_item SET ?';
                        const insertOrderItemPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertOrderItemQuery, orderItem, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                orderItemIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        orderItemInsertQueries.push(insertOrderItemPromise);
                    }

                    Promise.all(orderItemInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(orderItemIds);
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
