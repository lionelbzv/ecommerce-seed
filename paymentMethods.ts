import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate sylius_payment_method
 * @returns Promise<string[]>
 */
export async function populatePaymentMethods(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const paymentMethodIds = new Array<string>();

            const deleteQuery = 'DELETE FROM sylius_payment_method';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE sylius_payment_method AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const paymentMethodInsertQueries = new Array<Promise<void>>();

                    const code = ['credit-card', 'stripe', 'paypal', 'apple', 'bank-transfer'];
                    const name = ['Credit Card', 'Stripe', 'Paypal', 'Apple Pay', 'Brank Transfer'];
                    for (let i = 0; i < 5; i++) {
                        const paymentMethod = {
                            code: code[i],
                            name: name[i],
                            description: faker.lorem.words(),
                            enabled: 1,
                            created_at: faker.date.recent(),
                            updated_at: faker.date.recent(),
                        };

                        const insertPaymentMethodQuery = 'INSERT INTO sylius_payment_method SET ?';
                        const insertPaymentMethodPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertPaymentMethodQuery, paymentMethod, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                paymentMethodIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        paymentMethodInsertQueries.push(insertPaymentMethodPromise);
                    }

                    Promise.all(paymentMethodInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(paymentMethodIds);
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