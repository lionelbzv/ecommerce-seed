import { pool } from './database';
import { faker } from '@faker-js/faker';

faker.setLocale('en_US');

/**
 * Populate customer_issue
 * @param string[]
 * @returns Promise<string[]>
 */
export async function populateCustomerIssues(orderIds: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            const customerIssueIds = new Array<string>();

            const deleteQuery = 'DELETE FROM customer_issue';
            connection.query(deleteQuery, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }

                const resetQuery = 'ALTER TABLE customer_issue AUTO_INCREMENT = 1';
                connection.query(resetQuery, (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const customerIssueInsertQueries = new Array<Promise<void>>();

                    const state = ['New', 'Closed'];
                    const type = ['payment', 'shipping', 'return'];
                    const owner = ['lionel.bouzonville@forestadmin.com', 'louis@forestadmin.com', 'steveb@forestadmin.com', undefined];
                    for (let i = 0; i < 50; i++) {
                        const customerIssue = {
                            order_id: faker.helpers.arrayElement(orderIds),
                            state: faker.helpers.arrayElement(state),
                            owner: faker.helpers.arrayElement(owner),
                            type: faker.helpers.arrayElement(type),
                            created_at: faker.date.recent(60),
                            updated_at: faker.date.recent(60),
                        };

                        const insertCustomerIssueQuery = 'INSERT INTO customer_issue SET ?';
                        const insertCustomerIssuePromise = new Promise<void>((resolve, reject) => {
                            connection.query(insertCustomerIssueQuery, customerIssue, (error, results, fields) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                customerIssueIds.push(results.insertId.toString());
                                resolve();
                            });
                        });
                        customerIssueInsertQueries.push(insertCustomerIssuePromise);
                    }

                    Promise.all(customerIssueInsertQueries)
                        .then(() => {
                            connection.release();
                            resolve(customerIssueIds);
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
