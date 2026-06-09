import { DB } from '../modules/foundation/data.js';
import { escapeHtml } from '../modules/foundation/utils.js';
import { CONFIG } from '../modules/foundation/config.js';
import { renderMenuItem } from '../modules/ui/components.js';
import { renderCardSkeleton } from '../modules/ui/components.js';
import { Store, AuthStore, authFlowState } from '../modules/foundation/store.js';

export { authFlowState };

function renderAuthStepIndicator() {
    const state = AuthStore.getState();
    return `
        <div class="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-1 ${state.step >= 1 ? 'text-pink-600' : ''}">
                <span class="w-6 h-6 rounded-full border-2 ${state.step >= 1 ? 'border-pink-600 text-pink-600' : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'} flex items-center justify-center bg-transparent">1</span>
                <span>邮箱</span>
            </div>
            <div class="h-0.5 w-4 bg-gray-300 dark:bg-gray-600 ${state.step >= 2 ? 'bg-pink-600' : ''}"></div>
            <div class="flex items-center gap-1 ${state.step >= 2 ? 'text-pink-600' : ''}">
                <span class="w-6 h-6 rounded-full border-2 ${state.step >= 2 ? 'border-pink-600 text-pink-600' : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'} flex items-center justify-center bg-transparent">2</span>
                <span>${state.step === 2 ? (state.isRegistered ? '登录' : '注册') : '注册/登录'}</span>
            </div>
        </div>
    `;
}

function renderEmailStep() {
    const state = AuthStore.getState();
    return `
        <div id="step-1" class="${state.step === 1 ? '' : 'hidden'}">
            <div class="space-y-4">
                <div class="form-input-wrapper">
                    <input type="email" id="auth-email" inputmode="email" enterkeyhint="next" class="form-input" placeholder="邮箱" value="${state.email || ''}">
                </div>
                <p id="email-error" class="text-[10px] text-red-500 hidden mt-1 ml-1"></p>
            </div>
            <button id="email-next-btn" data-action="handle-email-step" class="w-full bg-pink-600 text-white mt-6 py-4 rounded-xl font-bold shadow-lg shadow-pink-600/20 btn-active h-[60px] flex items-center justify-center" disabled>
                继续
            </button>
            <p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">注册即表示同意服务条款</p>
        </div>
    `;
}

function renderAuthStep() {
    const state = AuthStore.getState();
    const passwordFeedback = !state.isRegistered ? `
        <div id="password-feedback" class="text-xs bg-transparent dark:bg-transparent rounded-lg p-3 space-y-1 mt-2">
            <div id="check-length" class="flex items-center"><i class="ri-checkbox-circle-line mr-1 text-red-500"></i>8</div>
            <div id="check-upper" class="flex items-center"><i class="ri-checkbox-circle-line mr-1 text-red-500"></i>1</div>
            <div id="check-lower" class="flex items-center"><i class="ri-checkbox-circle-line mr-1 text-red-500"></i>1</div>
            <div id="check-number" class="flex items-center"><i class="ri-checkbox-circle-line mr-1 text-red-500"></i>1</div>
            <div id="check-special" class="flex items-center"><i class="ri-checkbox-circle-line mr-1 text-red-500"></i>1</div>
        </div>
    ` : '';

    const confirmPasswordField = !state.isRegistered ? `
        <div class="space-y-1">
            <div class="form-input-wrapper relative">
                <input type="password" id="auth-pwd2" inputmode="text" enterkeyhint="done" class="form-input pr-10" placeholder="重复密码">
                <button type="button" class="toggle-password absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-pink-600 transition-colors" data-target="auth-pwd2">
                    <i class="ri-eye-off-line"></i>
                </button>
            </div>
            <p id="pwd-match-error" class="text-[10px] text-red-500 hidden mt-1 ml-1"></p>
        </div>
    ` : '';

    const forgotPassword = state.isRegistered ? `
        <p class="mt-4 text-center text-xs text-gray-400 dark:text-gray-500"><a href="#" class="text-pink-600 hover:underline">忘记密码？</a></p>
    ` : '';

    return `
        <div id="step-2" class="${state.step === 2 ? '' : 'hidden'}">
            <button data-action="go-back-email-step" class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-pink-600 transition-colors">
                <i class="ri-arrow-left-line"></i>
                <span>返回</span>
            </button>
            
            <div class="text-center py-2">
                <p class="text-sm font-medium">${escapeHtml(state.email)}</p>
            </div>
            
            <div class="space-y-1">
                <div class="form-input-wrapper relative">
                    <input type="password" id="auth-pwd1" inputmode="text" enterkeyhint="next" class="form-input pr-10" placeholder="${state.isRegistered ? '密码' : '设置密码'}">
                    <button type="button" class="toggle-password absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-pink-600 transition-colors" data-target="auth-pwd1">
                        <i class="ri-eye-off-line"></i>
                    </button>
                </div>
                ${passwordFeedback}
            </div>
            
            ${confirmPasswordField}
            
            <div id="turnstile-container" class="mt-6 flex justify-center"></div>

            <button id="auth-action-btn" data-action="handle-auth-step" class="mt-8 w-full bg-pink-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-pink-600/20 btn-active h-[60px] flex items-center justify-center" disabled>
                ${state.isRegistered ? '登录' : '注册'}
            </button>
            
            ${forgotPassword}
        </div>
    `;
}

function renderUserProfile() {
    const menuItems = [
        { icon: 'ri-image-edit-line', label: '修改头像', action: 'show-notification', params: { message: '修改头像功能开发中', type: 'info' } },
        { icon: 'ri-edit-line', label: '修改昵称', action: 'show-notification', params: { message: '修改昵称功能开发中', type: 'info' } },
        { icon: 'ri-mail-lock-line', label: '绑定邮箱', action: 'show-notification', params: { message: '邮箱已绑定', type: 'success' }, value: '已绑定' },
        { icon: 'ri-key-2-line', label: '修改密码', action: 'show-notification', params: { message: '修改密码功能开发中', type: 'info' }, isLast: true }
    ];

    return `
        <div class="space-y-6 pt-20">
            <div class="glass-card p-6 flex items-center gap-4">
                <div class="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-400 text-xl font-bold border-2 border-pink-600/50">
                    ${escapeHtml(DB.user?.name?.[0] ?? 'U')}
                </div>
                <div>
                    <h2 class="text-xl font-bold">${escapeHtml(DB.user?.name ?? '未知用户')}</h2>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">ID: ${CONFIG.USER.DEFAULT_ID}  ${escapeHtml(DB.user?.email ?? '未绑定邮箱')}</p>
                </div>
            </div>
            <div class="glass-card p-2 text-sm font-medium">
                ${menuItems.map(item => renderMenuItem(item)).join('')}
            </div>

            <button data-action="logout" class="w-full glass-card py-4 text-red-500 font-bold btn-active">退出登录</button>
        </div>
    `;
}

export function renderProfile() {
    if (!DB.user) {
        return `
            <div class="auth-page-container">
                <h2 class="text-2xl font-bold mb-8 text-center">账户</h2>
                <div class="glass-card responsive-card flex flex-col space-y-4 mx-auto">
                    ${renderAuthStepIndicator()}
                    ${renderEmailStep()}
                    ${renderAuthStep()}
                    <p class="text-center text-xs text-gray-400 dark:text-gray-500"><span>如有问题请联系：</span><span class="text-pink-600">${CONFIG.CONTACT.SUPPORT_EMAIL}</span></p>
                </div>
            </div>
        `;
    }
    return renderUserProfile();
}

export function renderProfileSkeleton() {
    return `
        <div class="auth-page-container">
            <div class="glass-card responsive-card flex flex-col space-y-4 mx-auto">
                <div class="flex items-center justify-center gap-2">
                    <div class="skel-base" style="width:48px;height:48px;border-radius:50%"></div>
                    <div class="skel-base" style="width:80px;height:20px;border-radius:4px"></div>
                </div>
                <div class="space-y-4 mt-4">
                    <div class="skel-base" style="width:100%;height:56px;border-radius:12px"></div>
                    <div class="skel-base" style="width:100%;height:56px;border-radius:12px"></div>
                    <div class="skel-base" style="width:100%;height:56px;border-radius:12px"></div>
                    <div class="skel-base" style="width:100%;height:56px;border-radius:12px"></div>
                </div>
            </div>
        </div>
    `;
}
