// 代码生成时间: 2025-08-03 07:27:02
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const { setInterval } = require('timers');

// SchedulerService class encapsulates the functionality for scheduling tasks.
class SchedulerService {
    constructor() {
        this.tasks = [];
    }

    // Adds a new task to the scheduler with a given function and interval.
    addTask(taskFunction, interval) {
        const id = setInterval(taskFunction, interval);
        this.tasks.push({ id, interval });
        return id;
    }

    // Removes a scheduled task from the scheduler using its ID.
    removeTask(id) {
        clearInterval(id);
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    // Lists all scheduled tasks.
    listTasks() {
        return this.tasks;
    }
}

// Create a Hapi server with a host and port.
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // Define the route for adding a new task.
    server.route({
        method: 'POST',
        path: '/add-task',
        options: {
            handler: async (request, h) => {
                const { functionBody, interval } = request.payload;
                try {
                    // Evaluate the function body to create a new function.
                    const taskFunction = new Function('return ' + functionBody)();
                    const taskId = scheduler.addTask(taskFunction, interval);
                    return { status: 'success', taskId };
                } catch (error) {
                    return Boom.badImplementation(error);
                }
            },
            validate: {
                payload: Joi.object({
                    functionBody: Joi.string().required(),
                    interval: Joi.number().required()
                })
            }
        }
    });

    // Define the route for removing a task.
    server.route({
        method: 'DELETE',
        path: '/remove-task/{id}',
        options: {
            handler: async (request, h) => {
                const { id } = request.params;
                try {
                    scheduler.removeTask(parseInt(id));
                    return { status: 'success' };
                } catch (error) {
                    return Boom.notFound(error);
                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().required()
                })
            }
        }
    });

    // Define the route for listing all tasks.
    server.route({
        method: 'GET',
        path: '/list-tasks',
        options: {
            handler: async () => {
                return { status: 'success', tasks: scheduler.listTasks() };
            }
        }
    });

    // Start the Hapi server.
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// Initialize the scheduler service.
const scheduler = new SchedulerService();

// Call the initialization function to start the server.
init();