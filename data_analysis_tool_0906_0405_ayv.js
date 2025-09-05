// 代码生成时间: 2025-09-06 04:05:50
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

// Create a new Hapi server instance
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Define the data analysis functionality
class DataAnalysisService {
    // Calculate the mean of an array of numbers
    calculateMean(data) {
        if (!Array.isArray(data) || data.some(isNaN)) {
            throw Boom.badRequest('Invalid data provided');
        }
        const sum = data.reduce((acc, val) => acc + val, 0);
        return sum / data.length;
    }

    // Calculate the median of an array of numbers
    calculateMedian(data) {
        if (!Array.isArray(data) || data.some(isNaN)) {
            throw Boom.badRequest('Invalid data provided');
        }
        data.sort((a, b) => a - b);
        const middleIndex = Math.floor(data.length / 2);
        return data.length % 2 !== 0 ? data[middleIndex] : (data[middleIndex - 1] + data[middleIndex]) / 2;
    }

    // Calculate the mode of an array of numbers
    calculateMode(data) {
        if (!Array.isArray(data) || data.some(isNaN)) {
            throw Boom.badRequest('Invalid data provided');
        }
        const frequencyMap = data.reduce((map, val) => {
            map[val] = (map[val] || 0) + 1;
            return map;
        }, {});
        const maxFrequency = Math.max(...Object.values(frequencyMap));
        return Object.keys(frequencyMap).filter(key => frequencyMap[key] === maxFrequency);
    }

    // Calculate the standard deviation of an array of numbers
    calculateStandardDeviation(data) {
        if (!Array.isArray(data) || data.some(isNaN)) {
            throw Boom.badRequest('Invalid data provided');
        }
        const mean = this.calculateMean(data);
        const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
        return Math.sqrt(variance);
    }
}

// Instantiate the data analysis service
const dataAnalysisService = new DataAnalysisService();

// Define the route for the data analysis endpoint
server.route({
    method: 'POST',
    path: '/analyze',
    handler: async (request, h) => {
        try {
            const { data } = request.payload;
            const results = {
                mean: dataAnalysisService.calculateMean(data),
                median: dataAnalysisService.calculateMedian(data),
                mode: dataAnalysisService.calculateMode(data),
                standardDeviation: dataAnalysisService.calculateStandardDeviation(data)
            };
            return h.response(results).code(200);
        } catch (error) {
            return error;
        }
    }
});

// Start the server
async function start() {
    await server.start();
    console.log('Server running on %s', server.info.uri);
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});
