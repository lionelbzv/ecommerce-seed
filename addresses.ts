import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate sylius_address
 * @param number[]
 * @returns Promise<string[]>
 */
export async function populateAddresses(customerIds: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const addressIds = new Array<string>();

            const deleteQuery = 'DELETE FROM sylius_address';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE sylius_address AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const addressInsertQueries = new Array<Promise<void>>();

                    for (let i = 0; i < 500; i++) {
                        const address = {
                            customer_id: customerIds[Math.floor(Math.random() * customerIds.length)],
                            first_name: faker.name.firstName(),
                            last_name: faker.name.lastName(),
                            country_code: faker.address.countryCode(),
                            street: faker.address.street(),
                            city: faker.address.city(),
                            postcode: faker.address.zipCode(),
                            phone_number: faker.phone.number(),
                        };

                        const insertAddressQuery = 'INSERT INTO sylius_address SET ?';
                        const insertAddressPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertAddressQuery, address, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                addressIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        addressInsertQueries.push(insertAddressPromise);
                    }

                    Promise.all(addressInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(addressIds);
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
