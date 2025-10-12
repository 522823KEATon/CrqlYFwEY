// 代码生成时间: 2025-10-13 03:21:24
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Joi = require('joi');
const axios = require('axios');

// BlockchainExplorer class to handle blockchain data
class BlockchainExplorer {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  // Retrieves the latest block from the blockchain
  async getLatestBlock() {
    try {
      const response = await axios.get(`${this.baseUrl}/block/0`);
      return response.data;
    } catch (error) {
      throw Boom.badRequest('Failed to retrieve the latest block');
    }
  }

  // Retrieves a block from the blockchain by its hash
  async getBlockByHash(blockHash) {
    try {
      const response = await axios.get(`${this.baseUrl}/block/${blockHash}`);
      return response.data;
    } catch (error) {
      throw Boom.badRequest('Failed to retrieve the block by hash');
    }
  }
}

// Hapi server configuration
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  // Define the routes for the blockchain explorer
  server.route([
    {
      method: 'GET',
      path: '/block/latest',
      handler: async (request, h) => {
        try {
          const explorer = new BlockchainExplorer({ baseUrl: 'https://blockchain.info/api' });
          const latestBlock = await explorer.getLatestBlock();
          return h.response(latestBlock).code(200);
        } catch (error) {
          return error;
        }
      },
    },
    {
      method: 'GET',
      path: '/block/{blockHash}',
      handler: async (request, h) => {
        try {
          const { blockHash } = request.params;
          const explorer = new BlockchainExplorer({ baseUrl: 'https://blockchain.info/api' });
          const block = await explorer.getBlockByHash(blockHash);
          return h.response(block).code(200);
        } catch (error) {
          return error;
        }
      },
    },
  ]);

  await server.start();
  console.log('Server running at:', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();