// 代码生成时间: 2025-10-01 17:14:53
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const Boom = require('@hapi/boom');

// 定义供应商的数据模型
const suppliers = [];

// 启动服务器
const startServer = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 定义路由：获取所有供应商信息
    server.route({
        method: 'GET',
        path: '/suppliers',
        handler: async (request, h) => {
            try {
                return {
                    suppliers: suppliers
                };
            } catch (error) {
                throw Boom.badImplementation(error.message);
            }
        }
    });

    // 定义路由：添加新的供应商
    server.route({
        method: 'POST',
        path: '/suppliers',
        handler: async (request, h) => {
            const { name, contactInfo } = request.payload;
            try {
                const newSupplier = {
                    id: suppliers.length + 1, // 自动生成ID
                    name: name,
                    contactInfo: contactInfo
                };
                suppliers.push(newSupplier);
                return {
                    message: 'Supplier added successfully',
                    supplier: newSupplier
                };
            } catch (error) {
                throw Boom.badImplementation(error.message);
            }
        },
        validate: {
            payload: Joi.object({
                name: Joi.string().required(),
                contactInfo: Joi.string().required()
            })
        }
    });

    // 定义路由：更新供应商信息
    server.route({
        method: 'PUT',
        path: '/suppliers/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            const { name, contactInfo } = request.payload;
            try {
                const supplierIndex = suppliers.findIndex(s => s.id === parseInt(id));
                if (supplierIndex === -1) {
                    throw Boom.notFound('Supplier not found');
                }
                suppliers[supplierIndex] = {
                    id: parseInt(id),
                    name: name,
                    contactInfo: contactInfo
                };
                return {
                    message: 'Supplier updated successfully',
                    supplier: suppliers[supplierIndex]
                };
            } catch (error) {
                throw Boom.badImplementation(error.message);
            }
        },
        validate: {
            params: Joi.object({
                id: Joi.number().required()
            }),
            payload: Joi.object({
                name: Joi.string().required(),
                contactInfo: Joi.string().required()
            })
        }
    });

    // 定义路由：删除供应商
    server.route({
        method: 'DELETE',
        path: '/suppliers/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            try {
                const supplierIndex = suppliers.findIndex(s => s.id === parseInt(id));
                if (supplierIndex === -1) {
                    throw Boom.notFound('Supplier not found');
                }
                suppliers.splice(supplierIndex, 1);
                return {
                    message: 'Supplier deleted successfully'
                };
            } catch (error) {
                throw Boom.badImplementation(error.message);
            }
        },
        validate: {
            params: Joi.object({
                id: Joi.number().required()
            })
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

startServer();
