import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate customer_issue_support
 * @param string[]
 * @returns Promise<string[]>
 */
export async function populateCustomerIssueSupports(customerIssueIds: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const customerIssueSupportIds = new Array<string>();

            const deleteQuery = 'DELETE FROM customer_issue_support';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE customer_issue_support AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const customerIssueSupportInsertQueries = new Array<Promise<void>>();

                    const type = ['email', 'phone', 'chat'];
                    const owner = ['lionel.bouzonville@forestadmin.com', 'louis@forestadmin.com', 'steveb@forestadmin.com', undefined];
                    for (let i = 0; i < 200; i++) {
                        const customerIssueSupport = {
                            customer_issue_id: faker.helpers.arrayElement(customerIssueIds),
                            owner: faker.helpers.arrayElement(owner),
                            type: faker.helpers.arrayElement(type),
                            description: faker.lorem.text(),
                            created_at: faker.date.recent(60),
                            updated_at: faker.date.recent(60),
                        };

                        const insertCustomerIssueSupportQuery = 'INSERT INTO customer_issue_support SET ?';
                        const insertCustomerIssueSupportPromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertCustomerIssueSupportQuery, customerIssueSupport, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                customerIssueSupportIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        customerIssueSupportInsertQueries.push(insertCustomerIssueSupportPromise);
                    }

                    Promise.all(customerIssueSupportInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(customerIssueSupportIds);
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
