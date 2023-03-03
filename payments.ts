import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate sylius_payment
 * @returns Promise<string[]>
 */
export async function populatePayments(orderIds: string[], paymentMethodIds: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const paymentIds = new Array<string>();

            const deleteQuery = 'DELETE FROM sylius_payment';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE sylius_payment AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const paymentInsertQueries = new Array<Promise<void>>();

                    const state = ['New', 'Completed'];
                    for (let i = 0; i < 100; i++) {
                        const payment = {
                            state: faker.helpers.arrayElement(state),
                            amount: faker.commerce.price(),
                            currency_code: 'USD',
                            details: faker.lorem.text(),
                            method_id: faker.helpers.arrayElement(paymentMethodIds),
                            order_id: orderIds[i],
                        };

                        const insertPaymentQuery = 'INSERT INTO sylius_payment SET ?';
                        const insertPaymentPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertPaymentQuery, payment, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                paymentIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        paymentInsertQueries.push(insertPaymentPromise);
                    }

                    Promise.all(paymentInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(paymentIds);
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
