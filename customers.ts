import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate sylius_customer
 * @returns Promise<string[]>
 */
export async function populateCustomers(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }
            const customerIds = new Array<string>();

            const deleteQuery = 'DELETE FROM sylius_customer';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE sylius_customer AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const customerInsertQueries = new Array<Promise<void>>();

                    for (let i = 0; i < 100; i++) {
                        const customer = {
                            first_name: faker.name.firstName(),
                            last_name: faker.name.lastName(),
                            email: faker.internet.email(),
                            gender: faker.helpers.arrayElement(['M', 'Ms']),
                            birthday: faker.date.birthdate(),
                            created_at: faker.date.recent(),
                            updated_at: faker.date.recent(),
                        };

                        const insertCustomerQuery = 'INSERT INTO sylius_customer SET ?';
                        const insertCustomerPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertCustomerQuery, customer, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                customerIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        customerInsertQueries.push(insertCustomerPromise);
                    }

                    Promise.all(customerInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(customerIds);
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
