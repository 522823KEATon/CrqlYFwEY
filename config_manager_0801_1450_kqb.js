// 代码生成时间: 2025-08-01 14:50:38
const Hapi = require('@hapi/hapi');

// Define a configuration schema
const configSchema = Joi => {
    return Joi.object({
        db: Joi.object({
            host: Joi.string().required(),
            port: Joi.number().required(),
            user: Joi.string().required(),
            password: Joi.string().required(),
            database: Joi.string().required()
        }).required(),
        app: Joi.object({
            port: Joi.number().default(3000),
            secret: Joi.string().required()
        }).required()
    });
};

// Configuration Manager class
class ConfigManager {
    constructor(config) {
        this.config = config;
    }

    // Method to get a configuration value
    getConfig(key) {
        return this.config[key];
    }

    // Method to reload configuration
    reloadConfig(newConfig) {
        // Validate new configuration
        const validationResult = Joi.validate(newConfig, configSchema(Joi));
        if (validationResult.error) {
            throw new Error('Invalid configuration: ' + validationResult.error.details.map(e => e.message).join(', '));
        }
        this.config = newConfig;
    }
}

// Start HAPI Server
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // Registering the config manager plugin
    await server.register({
        plugin: ConfigManager,
        options: {
            // Example configuration object
            config: {
                db: {
                    host: 'localhost',
                    port: 5432,
                    user: 'user',
                    password: 'password',
                    database: 'database'
                },
                app: {
                    port: 3000,
                    secret: 'secret'
                }
            }
        }
    });

    // Start the server
    await server.start();
    console.log('Server running at:', server.info.uri);
}

// Export the initialization function for use in other modules
module.exports = {
    init
};