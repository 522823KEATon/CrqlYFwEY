// 代码生成时间: 2025-09-09 17:50:36
 * Interactive Chart Generator using HAPI framework
 *
 * This program sets up a HAPI server and provides an endpoint to
 * generate interactive charts based on provided data.
 */

const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const fs = require('fs');

// Initialize HAPI server
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Define the chart data schema
const chartDataSchema = Joi.object({
    type: Joi.string().required(),
    data: Joi.array().required()
});

// Register plugins
async function startServer() {
    await server.register(Vision);
    await server.views({
        engines: { html: Handlebars },
        relativeTo: __dirname,
        path: 'views'
    });
}

// Create the route for chart generation
server.route({
    method: 'GET',
    path: '/generate-chart',
    handler: async (request, h) => {
        try {
            // Validate the input data
            const { type, data } = await chartDataSchema.validateAsync(request.query);
            
            // Render the chart using the validated data
            return h.view('chart', {
                type: type,
                data: data
            });
        } catch (error) {
            // Handle any validation errors
            return h.response('Invalid chart data provided').code(400);
        }
    },
    config: {
        validate: {
            query: chartDataSchema
        }
    }
});

// Start the server
startServer().then(() => {
    console.log('Server running at:', server.info.uri);
}).catch((err) => {
    console.error('Failed to start server:', err);
});

// Define the Handlebars template for the chart (chart.handlebars)
// Please add this file in the views directory with the correct Handlebars syntax
fs.writeFileSync('views/chart.handlebars', `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div>
        <canvas id="myChart"></canvas>
    </div>
    <script>
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: '{{type}}',
            data: {
                labels: {{labels}},
                datasets: [{
                    label: '# of Votes',
                    data: {{data}},
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>
`);
