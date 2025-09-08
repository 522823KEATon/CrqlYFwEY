// 代码生成时间: 2025-09-08 22:25:29
// Required dependencies
const Hapi = require('@hapi/hapi');
const Excel = require('exceljs');
const fs = require('fs');
const path = require('path');

// Create a new Hapi server
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Initialize the ExcelJS workbook
const workbook = new Excel.Workbook();

// Define the route for generating Excel files
server.route({
    method: 'GET',
    path: '/generate-excel',
    handler: async (request, h) => {
        try {
            // Add a worksheet to the workbook
            const worksheet = workbook.addWorksheet('My Sheet');

            // Add data to the worksheet
            worksheet.addRow(['ID', 'Name', 'Age']);
            worksheet.addRow([1, 'John Doe', 30]);
            worksheet.addRow([2, 'Jane Doe', 25]);

            // Set the style for the header row
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true };
            headerRow.fill = { patternType: 'solid', fgColor: { rgb: 'FF0000' } };

            // Generate the Excel file
            const buffer = await workbook.xlsx.writeBuffer();

            // Set the filename and content type for the response
            const filename = 'generated_excel.xlsx';
            const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

            // Return the file as a response
            return h.response(buffer).type(contentType).header('Content-disposition', `attachment; filename=