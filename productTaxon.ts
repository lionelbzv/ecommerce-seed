import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate sylius_product_taxon
 * @returns Promise<boolean>
 */
export async function populateProductTaxon(productIds: string[], taxonIds: string[]): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const productTaxonIds = new Array<string>();

            const deleteQuery = 'DELETE FROM sylius_product_taxon';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE sylius_product_taxon AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const productTaxonInsertQueries = new Array<Promise<void>>();
                    for (let i = 0; i < productIds.length; i++) {
                        const productTaxon = {
                            product_id: productIds[i],
                            taxon_id: faker.helpers.arrayElement(taxonIds),
                        };

                        const insertProductTaxonQuery = 'INSERT INTO sylius_product_taxon SET ?';
                        const insertProductTaxonPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertProductTaxonQuery, productTaxon, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                productTaxonIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        productTaxonInsertQueries.push(insertProductTaxonPromise);
                    }

                    Promise.all(productTaxonInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(true);
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

