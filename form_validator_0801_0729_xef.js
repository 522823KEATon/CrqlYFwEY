// 代码生成时间: 2025-08-01 07:29:05
const Joi = require('@hapi/joi');

// 创建一个简单的表单数据验证器
// 使用了HAPI框架的Joi库来进行数据验证
const FormValidator = {

  // 验证邮箱地址
  validateEmail: async (email) => {
    // 定义邮箱的验证规则
    const schema = Joi.string().email().required();
    try {
      // 验证邮箱地址
      await schema.validateAsync(email);
    } catch (error) {
      // 如果验证失败，抛出错误
      throw new Error('Invalid email address');
    }
  },

  // 验证密码强度
  validatePassword: async (password) => {
    // 定义密码的验证规则，至少8个字符，包含大写字母、小写字母、数字和特殊字符
    const schema = Joi.string().min(8).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=\S+$)/);
    try {
      // 验证密码
      await schema.validateAsync(password);
    } catch (error) {
      // 如果验证失败，抛出错误
      throw new Error('Password must be at least 8 characters long and include uppercase and lowercase letters, numbers, and special characters');
    }
  },

  // 验证表单数据
  validateFormData: async (formData) => {
    // 定义表单数据的验证规则
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=\S+$)/).required()
    });
    try {
      // 验证表单数据
      await schema.validateAsync(formData);
    } catch (error) {
      // 如果验证失败，返回错误信息
      return {
        isValid: false,
        errors: error.details.map((error) => error.message)
      };
    }
    // 如果验证成功，返回成功信息
    return {
      isValid: true,
      message: 'Form data is valid'
    };
  }

};

// 导出表单数据验证器
module.exports = FormValidator;