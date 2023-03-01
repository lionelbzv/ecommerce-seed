import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate sylius_taxon
 * @returns Promise<string[]>
 */
export async function populateTaxons(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const taxonIds = new Array<string>();

            const deleteQuery = 'DELETE FROM sylius_taxon';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE sylius_taxon AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const taxonInsertQueries = new Array<Promise<void>>();

                    const categories = ['Desktop', 'Portable', 'Apple', 'Smartphones', 'Reconditioned', 'Other materials'];
                    for (let i = 0; i < 6; i++) {
                        const taxon = {
                            name: categories[i],
                            description: faker.commerce.productDescription(),
                        };

                        const insertTaxonQuery = 'INSERT INTO sylius_taxon SET ?';
                        const insertTaxonPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertTaxonQuery, taxon, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                taxonIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        taxonInsertQueries.push(insertTaxonPromise);
                    }

                    Promise.all(taxonInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(taxonIds);
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