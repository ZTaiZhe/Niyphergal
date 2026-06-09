const fs = require('fs');
const path = require('path');

// 读取HTML文件内容
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// 提取所有script标签内容
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
let scriptIndex = 0;
let hasError = false;

console.log('开始验证HTML中的JavaScript代码...');

while ((match = scriptRegex.exec(htmlContent)) !== null) {
    const scriptContent = match[1];
    
    // 跳过外部脚本引用
    if (scriptContent.trim().startsWith('https://') || scriptContent.trim().startsWith('http://')) {
        continue;
    }
    
    scriptIndex++;
    console.log(`\n检查脚本块 ${scriptIndex}...`);
    
    try {
        // 使用Node.js的VM模块来验证JavaScript语法
        const vm = require('vm');
        const script = new vm.Script(scriptContent);
        
        // 创建一个安全的上下文
        const context = vm.createContext({
                window: {
                    crypto: {
                        getRandomValues: (array) => {
                            for (let i = 0; i < array.length; i++) {
                                array[i] = Math.floor(Math.random() * 256);
                            }
                            return array;
                        }
                    },
                    addEventListener: () => {},
                    removeEventListener: () => {}
                },
                document: {
                    addEventListener: () => {},
                    removeEventListener: () => {},
                    getElementById: () => ({
                        addEventListener: () => {},
                        removeEventListener: () => {},
                        querySelectorAll: () => ([]),
                        querySelector: () => ({})
                    }),
                    querySelector: () => ({
                        addEventListener: () => {},
                        removeEventListener: () => {},
                        querySelectorAll: () => ([]),
                        querySelector: () => ({})
                    }),
                    querySelectorAll: () => ([]),
                    createElement: () => ({
                        addEventListener: () => {},
                        removeEventListener: () => {},
                        setAttribute: () => {},
                        getAttribute: () => '',
                        appendChild: () => {},
                        classList: { add: () => {}, remove: () => {}, contains: () => false }
                    }),
                    body: {},
                    title: '',
                    head: { appendChild: () => {} }
                },
                localStorage: {},
                sessionStorage: {},
                console: console,
                alert: () => {},
                setTimeout: () => {},
                setInterval: () => {},
                clearTimeout: () => {},
                clearInterval: () => {},
                XMLHttpRequest: class {},
                fetch: () => {},
                URL: class {},
                Event: class {},
                CustomEvent: class {},
                MutationObserver: class {
                    constructor() {}
                    observe() {}
                    disconnect() {}
                },
                IntersectionObserver: class {
                    constructor() {}
                    observe() {}
                    disconnect() {}
                },
                Promise: Promise,
                async function() {},
                await: () => {},
                Array: Array,
                Object: Object,
                String: String,
                Number: Number,
                Boolean: Boolean,
                RegExp: RegExp,
                Date: Date,
                Math: Math,
                JSON: JSON,
                // 添加ValidationUtils和其他可能被引用的对象
                ValidationUtils: {
                    validateLength: () => {},
                    filterIllegalChars: () => {},
                    sanitizeInput: () => {},
                    validateInput: () => {}
                },
                PinyinConverter: {
                    toPinyin: () => {}
                },
                DB: {
                    resources: [],
                    registeredUsers: [],
                    user: null,
                    users: [],
                    comments: [],
                    announcement: {}
                },
                SearchSuggestion: {},
                router: {
                    push: () => {}
                },
                Actions: {},
                ThemeManager: {
                    loadTheme: () => {},
                    getServerTime: () => {},
                    updateThemeIcon: () => {}
                },
                BackendValidation: {},
                turnstile: {
                    render: () => {},
                    reset: () => {}
                },
                argon2: {
                    hash: async () => ({ encoded: 'test-hash', hash: new Uint8Array(32), salt: new Uint8Array(16) }),
                    verify: async () => true,
                    ArgonType: {
                        Argon2id: 2
                    }
                }
            });
        
        // 执行脚本（只验证语法，不执行逻辑）
        script.runInContext(context);
        
        console.log(`✓ 脚本块 ${scriptIndex} 语法正确`);
    } catch (error) {
        console.log(`✗ 脚本块 ${scriptIndex} 存在语法错误:`);
        console.log(`   ${error.message}`);
        hasError = true;
    }
}

console.log('\n验证完成！');
if (hasError) {
    console.log('发现语法错误，请检查代码。');
    process.exit(1);
} else {
    console.log('所有脚本块语法正确！');
    process.exit(0);
}
