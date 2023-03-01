import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate sylius_product
 * @returns Promise<string[]>
 */
export async function populateProducts(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const productIds = new Array<string>();

            const deleteQuery = 'DELETE FROM sylius_product';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE sylius_product AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const productInsertQueries = new Array<Promise<void>>();

                    for (let i = 0; i < 100; i++) {
                        const product = {
                            name: faker.commerce.productName(),
                            description: faker.commerce.productDescription(),
                            price: faker.commerce.price(),
                        };

                        const insertProductQuery = 'INSERT INTO sylius_product SET ?';
                        const insertProductPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertProductQuery, product, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                productIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        productInsertQueries.push(insertProductPromise);
                    }

                    Promise.all(productInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(productIds);
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
