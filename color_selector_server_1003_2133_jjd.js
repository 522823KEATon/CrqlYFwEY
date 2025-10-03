// 代码生成时间: 2025-10-03 21:33:56
const Hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');
const vision = require('@hapi/vision');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

// Create a new HAPI server instance
const server = Hapi.server({
    port: 3000,
    host: 'localhost',
});

// Route handler for GET request to display the color selection form
const getColorForm = async (request, h) => {
    return h.view('color_selection_form', {});
};

// Route handler for POST request to process the selected color
const processColor = async (request, h) => {
    const { color } = request.payload;
    if (!color) {
        return h.response('No color selected').code(400); // Bad Request
    }
    return h.response(`You selected: ${color}`).code(200); // OK
};

// Register plugins with the server
async function startServer() {
    await server.register(inert);
    await server.register(vision);

    // Set up the view manager to render Handlebars templates
    await server.views({
        engines: { html: handlebars },
        relativeTo: __dirname,
        path: './views',
        layoutPath: './views/layouts',
        partialsPath: './views/partials',
        helpersPath: './views/helpers',
    });

    // Define routes
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: getColorForm,
        },
        {
            method: 'POST',
            path: '/',
            handler: processColor,
        },
    ]);

    await server.start();
    console.log('Server running at:', server.info.uri);
}

startServer();

// Load the HTML template from the file system and process it with Handlebars
function loadTemplate(templateName) {
    const templatePath = path.join(__dirname, './views', templateName + '.html');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    return handlebars.compile(templateContent);
}

// Export the loadTemplate function for use in other modules
module.exports = { loadTemplate };