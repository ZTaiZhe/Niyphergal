export const CONFIG = {

    API: {
        BASE_URL: location.hostname === 'localhost'
            ? 'http://localhost:8787'
            : 'https://niyphergal-api.ineviy.workers.dev',
        TIMEOUT_MS: 10000
    },    APP: {
        NAME: 'Niypher',
        VERSION: '1.0.0'
    },

    USER: {
        DEFAULT_ID: '8848293',
        ADMIN_EMAIL_SUFFIX: '@niypher.net'
    },

    CONTACT: {
        SUPPORT_EMAIL: 'feedback@niypher.net'
    },

    SECURITY: {
        PASSWORD_HASH_ITERATIONS: 10000,
        PASSWORD_MIN_LENGTH: 8
    },

    ENCRYPTION: {
        KEY_SALT: 'niypher_encryption_salt_2024_v1',
        ITERATIONS: 100000
    },

    TURNSTILE: {
        SITE_KEY: '0x4AAAAAACJ_rMxcCB0FrOve'
    },

    EMAIL: {
        SUPPORTED_DOMAINS: [
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
            'aliyun.com',
            'niypher.com',
            'niypher.net'
        ]
    },

    SEARCH: {
        DEBOUNCE_DELAY: 300,
        MIN_QUERY_LENGTH: 1,
        MAX_SUGGESTIONS: 10,
        SUGGESTIONS_PER_PAGE: 5,
        CACHE_MAX_SIZE: 50,
        CACHE_TTL_MINUTES: 5
    },

    UI: {
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        HEADER_HEIGHT: 64,
        LOGO_BTN_WIDTH: 120,
        LEFT_PADDING: 40,
        RIGHT_MIN_PADDING: 40,
        SEARCH_MIN_WIDTH: 280,
        SEARCH_MAX_WIDTH: 672,
        MIN_GAP_WIDTH: 20
    }
};

export default CONFIG;
