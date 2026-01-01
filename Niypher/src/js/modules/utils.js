/**
 * 工具函数模块
 * 包含通用的工具函数，如防抖、节流等
 */

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖处理后的函数
 */
export function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流处理后的函数
 */
export function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(null, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为有效邮箱格式
 */
export function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 验证邮箱域名是否为支持的主流大厂域名
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为支持的邮箱域名
 */
export function validateEmailDomain(email) {
    const supportedMainDomains = [
        'qq.com',
        'gmail.com',
        '163.com',
        '126.com',
        'sina.com',
        'yahoo.com',
        'hotmail.com',
        'outlook.com',
        'icloud.com',
        'foxmail.com',
        '139.com',
        'aliyun.com'
    ];
    
    const domain = email.split('@')[1];
    const domainParts = domain.split('.');
    
    // 提取主域名（最后两部分）
    let mainDomain;
    if (domainParts.length >= 2) {
        mainDomain = domainParts.slice(-2).join('.');
    } else {
        mainDomain = domain;
    }
    
    // 检查主域名是否在支持列表中
    return supportedMainDomains.includes(mainDomain);
}

/**
 * 检查密码强度
 * @param {string} password - 密码
 * @returns {Object} 包含密码强度检查结果的对象
 */
export function checkPasswordValidity(password) {
    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const allValid = checks.length && checks.upper && checks.lower && checks.number && checks.special;
    return { checks, allValid };
}

/**
 * 显示通知
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型：success, error, info, warning
 * @param {number} duration - 显示时长（毫秒）
 */
export function showNotification(message, type = 'info', duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        notification.remove();
    }, duration);
}

/**
 * 显示加载指示器
 */
export function showLoader() {
    // 创建加载覆盖层
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = '<div class="loading-spinner"></div>';
    loader.id = 'app-loader';
    
    // 添加到页面
    document.body.appendChild(loader);
}

/**
 * 隐藏加载指示器
 */
export function hideLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
        loader.remove();
    }
}
