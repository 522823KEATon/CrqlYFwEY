// 代码生成时间: 2025-09-29 14:20:35
const Hapi = require('@hapi/hapi');

// Create a new Hapi server instance
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Define the database schema
const transactions = [];

// Add a new transaction to the database
async function addTransaction(transaction) {
    if (!transaction.amount || typeof transaction.amount !== 'number') {
        throw new Error('Invalid transaction amount');
    }
    transactions.push(transaction);
    return transaction;
}

// Delete a transaction from the database by ID
async function deleteTransaction(id) {
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
        throw new Error('Transaction not found');
    }
    return transactions.splice(index, 1)[0];
}

// Update an existing transaction in the database
async function updateTransaction(id, updatedFields) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) {
        throw new Error('Transaction not found');
    }
    Object.assign(transaction, updatedFields);
    return transaction;
}

// Initialize the Hapi server and its routes
async function startServer() {
    await server.register(Hapi.plugins.Crud);

    // Define routes for the financial management module
    server.route({
        method: 'POST',
        path: '/transactions',
        handler: addTransaction,
        options: {
            validate: {
                payload: {
                    amount: Hapi.schema.number().required(),
                    description: Hapi.schema.string().required(),
                    category: Hapi.schema.string().required()
                }
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/transactions/{id}',
        handler: deleteTransaction,
        options: {
            validate: {
                params: {
                    id: Hapi.schema.string().required()
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/transactions/{id}',
        handler: updateTransaction,
        options: {
            validate: {
                params: {
                    id: Hapi.schema.string().required()
                },
                payload: {
                    amount: Hapi.schema.number(),
                    description: Hapi.schema.string(),
                    category: Hapi.schema.string()
                }
            }
        }
    });

    await server.start();
    console.log('Server running at:', server.info.uri);
}

// Start the server
startServer();