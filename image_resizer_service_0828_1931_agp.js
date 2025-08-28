// 代码生成时间: 2025-08-28 19:31:17
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// 创建一个 Hapi 服务器实例
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 路由定义：批量调整图片尺寸
    server.route({
        method: 'POST',
        path: '/resize-images',
        handler: resizeImages
    });

    await server.start();
    console.log('Server running at:', server.info.uri);
};

// 图片尺寸调整的函数
async function resizeImages(request, h) {
    try {
        const { images } = request.payload;
        if (!images || !Array.isArray(images)) {
            return h.response({
                status: 'fail',
                message: 'Invalid image data'
            }).code(400);
        }

        const resizedImages = await Promise.all(images.map(
            async (image) => {
                const { originalPath, targetPath, width, height } = image;
                const resizedImagePath = path.join(__dirname, targetPath);
                await sharp(originalPath)
                    .resize(width, height)
                    .toFile(resizedImagePath);
                return {
                    originalPath,
                    resizedPath: resizedImagePath,
                    width,
                    height
                };
            })
        );

        return {
            status: 'success',
            resizedImages: resizedImages
        };
    } catch (error) {
        return h.response({
            status: 'fail',
            message: error.message
        }).code(500);
    }
}

// 模块导出
module.exports = { init };

// 请注意：此代码假定已经安装了 sharp 库，并且有正确的环境配置来处理图片文件。