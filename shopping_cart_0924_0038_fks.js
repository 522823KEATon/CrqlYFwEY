// 代码生成时间: 2025-09-24 00:38:36
const Hapi = require('hapi');

// 创建一个新的Hapi服务器实例，并指定端口号
const server = Hapi.server({
    port: 3000,
    host: 'localhost',
});

// 购物车数据模型
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    // 添加商品到购物车
    addItem(item) {
        const existingItem = this.items.find((i) => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
    }

    // 从购物车移除商品
    removeItem(itemId) {
        this.items = this.items.filter((item) => item.id !== itemId);
    }

    // 清空购物车
    clearCart() {
        this.items = [];
    }

    // 获取购物车中的商品列表
    getItems() {
        return this.items;
    }
}

// 购物车实例
const cart = new ShoppingCart();

// 路由处理程序
const routes = [
    {
        method: 'GET',
        path: '/cart',
        handler: async (request, h) => {
            return {
                items: cart.getItems(),
            };
        },
    },
    {
        method: 'POST',
        path: '/cart/add',
        handler: async (request, h) => {
            try {
                const item = request.payload;
                cart.addItem(item);
                return {
                    message: 'Item added to cart',
                    cart: cart.getItems(),
                };
            } catch (error) {
                return h.response({
                    status: 'error',
                    message: 'Failed to add item to cart',
                }).code(500);
            }
        },
    },
    {
        method: 'POST',
        path: '/cart/remove',
        handler: async (request, h) => {
            try {
                const itemId = request.payload.id;
                cart.removeItem(itemId);
                return {
                    message: 'Item removed from cart',
                    cart: cart.getItems(),
                };
            } catch (error) {
                return h.response({
                    status: 'error',
                    message: 'Failed to remove item from cart',
                }).code(500);
            }
        },
    },
    {
        method: 'POST',
        path: '/cart/clear',
        handler: async (request, h) => {
            try {
                cart.clearCart();
                return {
                    message: 'Cart cleared',
                };
            } catch (error) {
                return h.response({
                    status: 'error',
                    message: 'Failed to clear cart',
                }).code(500);
            }
        },
    },
];

// 注册路由
server.route(routes);

// 启动服务器
async function start() {
    await server.start();
    console.log('Server running on %s', server.info.uri);
}

start();

// 为便于测试，导出购物车实例
module.exports = {
    ShoppingCart,
    cart,
};