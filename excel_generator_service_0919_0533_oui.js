// 代码生成时间: 2025-09-19 05:33:55
const Hapi = require('@hapi/hapi');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// 创建Hapi服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Excel文件生成服务
const excelService = {
    // 生成Excel文件
    generateExcel: async (filename, data) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet1');

            // 将数据写入工作表
            data.forEach(row => worksheet.addRow(row));

            // 将工作簿写入文件系统
            const filepath = path.join(__dirname, filename);
            await workbook.xlsx.writeFile(filepath);

            return `Excel file generated successfully at ${filepath}`;
        } catch (error) {
            throw new Error(`Error generating Excel file: ${error.message}`);
        }
    }
};

// 定义一个路由，用于接收数据并生成Excel文件
server.route({
    method: 'POST',
    path: '/generate-excel',
    handler: async (request, h) => {
        const { filename, data } = request.payload;
        try {
            const result = await excelService.generateExcel(filename, data);
            return {
                status: 'success',
                message: result
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }
});

// 启动服务器
async function start() {
    await server.start();
    console.log('Server running at:', server.info.uri);
}

start();

// 导出excelService以便在其他文件中使用
module.exports = excelService;