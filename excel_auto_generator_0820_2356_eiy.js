// 代码生成时间: 2025-08-20 23:56:40
const Hapi = require('hapi');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Define a function to create an Excel workbook and add a worksheet
function createWorkbook(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Generated Data');

  // Add data rows
  data.forEach((row, index) => {
    worksheet.addRow(row);
  });

  return workbook;
}

// Create a server instance
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// Define a route to handle POST requests to generate an Excel file
server.route({
  method: 'POST',
  path: '/generate-excel',
  handler: async (request, h) => {
    try {
      // Get data from the request payload
      const data = request.payload;

      // Validate data structure
      if (!Array.isArray(data) || data.some(row => !Array.isArray(row))) {
        return h.response('Invalid data structure').code(400);
      }

      // Create an Excel workbook with the data
      const workbook = createWorkbook(data);

      // Prepare the response with the Excel file as an attachment
      const buffer = await workbook.xlsx.writeBuffer();
      const filePath = path.join(__dirname, 'generated.xlsx');
      fs.writeFileSync(filePath, buffer, 'binary');

      return h.response().file(filePath).header('Content-Disposition', 'attachment; filename=generated.xlsx');
    } catch (error) {
      // Handle errors and return a 500 Internal Server Error response
      return h.response('Internal Server Error').code(500);
    }
  }
});

// Start the server
async function start() {
  try {
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (error) {
    console.error(error);
  }
}

start();