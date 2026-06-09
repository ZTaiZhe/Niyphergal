import { DB } from './data.js';
import { showNotification, checkPasswordValidity, validateEmailFormat, validateEmailDomain, generateSalt, hashPassword, verifyPassword } from './utils.js';
import { CONFIG } from './config.js';
import { Store, AuthStore, authFlowState } from './store.js';
import { router } from './router.js';
import { bindAuthStepEvents } from './authForm.js';

const TURNSTILE_SITE_KEY = CONFIG.TURNSTILE.SITE_KEY;

function setButtonLoading(btn, originalText) {
    if (!btn) {return;}
    btn.disabled = true;
    btn.dataset.originalText = originalText;
    btn.innerHTML = '<i class="ri-loader-4-line animate-spin text-xl"></i>';
}

function setButtonSuccess(btn) {
    if (!btn) {return;}
    btn.className = btn.className.replace(/bg-pink-600/g, 'bg-green-500').replace(/shadow-pink-600\/20/g, 'shadow-green-500/20');
    btn.innerHTML = '<i class="ri-check-line text-2xl text-white"></i>';
}

function setButtonError(btn) {
    if (!btn) {return;}
    btn.className = btn.className.replace(/bg-pink-600/g, 'bg-red-500').replace(/shadow-pink-600\/20/g, 'shadow-red-500/20');
    btn.innerHTML = '<i class="ri-close-line text-2xl text-white"></i>';
}

function resetButton(btn) {
    if (!btn) {return;}
    const originalText = btn.dataset.originalText || '下一步';
    btn.className = btn.className.replace(/bg-green-500/g, 'bg-pink-600').replace(/bg-red-500/g, 'bg-pink-600').replace(/shadow-green-500\/20/g, 'shadow-pink-600/20').replace(/shadow-red-500\/20/g, 'shadow-pink-600/20');
    btn.innerHTML = originalText;
    btn.disabled = false;
}

function transitionToStep(targetStep) {
    const currentStep = AuthStore.getState().step;
    const fromEl = document.getElementById(`step-${currentStep}`);
    const toEl = document.getElementById(`step-${targetStep}`);

    if (!fromEl || !toEl) {return;}

    fromEl.style.opacity = '0';
    fromEl.style.transition = 'opacity 0.3s ease-out';

    setTimeout(() => {
        fromEl.classList.add('hidden');
        fromEl.style.opacity = '';
        fromEl.style.transition = '';

        Store.setAuthStep(targetStep);

        toEl.style.opacity = '0';
        toEl.classList.remove('hidden');

        requestAnimationFrame(() => {
            toEl.style.transition = 'opacity 0.3s ease-out';
            toEl.style.opacity = '1';
        });

        setTimeout(() => {
            toEl.style.opacity = '';
            toEl.style.transition = '';
        }, 300);

        updateStepIndicators();

        if (targetStep === 2) {
            setTimeout(bindAuthStepEvents, 50);
        }
    }, 300);
}

function transitionToProfile() {
    const step2El = document.getElementById('step-2');
    const container = document.getElementById('main-container');

    authFlowState.step = 1;
    authFlowState.email = '';
    authFlowState.isRegistered = false;
    authFlowState.humanVerified = false;
    authFlowState.turnstileToken = null;

    if (!step2El || !container) {
        router.push('profile');
        return;
    }

    const card = step2El.closest('.glass-card');
    if (card) {
        card.style.opacity = '0';
        card.style.transition = 'opacity 0.3s ease-out';
    }

    setTimeout(() => {
        router.push('profile');
    }, 300);
}

function updateStepIndicators() {
    const container = document.querySelector('.glass-card .flex.items-center.justify-center.gap-2');
    if (!container) {return;}

    const stepIndicators = container.querySelectorAll('div.flex.items-center.gap-1');
    const line = container.querySelector('div.h-0\\.5');

    if (stepIndicators.length < 2) {return;}

    const step1Indicator = stepIndicators[0];
    const step2Indicator = stepIndicators[1];
    const step1Circle = step1Indicator.querySelector('.rounded-full');
    const step2Circle = step2Indicator.querySelector('.rounded-full');
    const step2Label = step2Indicator.querySelector('span:last-child');

    if (authFlowState.step === 1) {
        step1Indicator.classList.add('text-pink-600');
        step1Indicator.classList.remove('text-gray-500', 'dark:text-gray-400');
        if (step1Circle) {
            step1Circle.classList.add('border-pink-600', 'text-pink-600');
            step1Circle.classList.remove('border-gray-300', 'dark:border-gray-600', 'text-gray-500', 'dark:text-gray-400');
        }

        step2Indicator.classList.remove('text-pink-600');
        step2Indicator.classList.add('text-gray-500', 'dark:text-gray-400');
        if (step2Circle) {
            step2Circle.classList.remove('border-pink-600', 'text-pink-600');
            step2Circle.classList.add('border-gray-300', 'dark:border-gray-600', 'text-gray-500', 'dark:text-gray-400');
        }

        if (line) {
            line.classList.remove('bg-pink-600');
            line.classList.add('bg-gray-300', 'dark:bg-gray-600');
        }

        if (step2Label) {
            step2Label.textContent = '注册/登录';
        }
    } else if (authFlowState.step === 2) {
        step1Indicator.classList.add('text-pink-600');
        step1Indicator.classList.remove('text-gray-500', 'dark:text-gray-400');
        if (step1Circle) {
            step1Circle.classList.add('border-pink-600', 'text-pink-600');
            step1Circle.classList.remove('border-gray-300', 'dark:border-gray-600', 'text-gray-500', 'dark:text-gray-400');
        }

        step2Indicator.classList.add('text-pink-600');
        step2Indicator.classList.remove('text-gray-500', 'dark:text-gray-400');
        if (step2Circle) {
            step2Circle.classList.add('border-pink-600', 'text-pink-600');
            step2Circle.classList.remove('border-gray-300', 'dark:border-gray-600', 'text-gray-500', 'dark:text-gray-400');
        }

        if (line) {
            line.classList.add('bg-pink-600');
            line.classList.remove('bg-gray-300', 'dark:bg-gray-600');
        }

        if (step2Label) {
            step2Label.textContent = authFlowState.isRegistered ? '登录' : '注册';
        }
    }
}

function initTurnstileForStep2() {
    const container = document.getElementById('turnstile-container');
    if (!container || !window.turnstile) {return;}

    container.innerHTML = '';

    const isDark = document.body.classList.contains('dark');
    const theme = isDark ? 'dark' : 'light';

    const widgetId = window.turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: theme,
        callback: (token) => {
            authFlowState.turnstileToken = token;
            authFlowState.humanVerified = true;
            document.dispatchEvent(new Event('humanVerified'));
        }
    });

    authFlowState.turnstileWidgetId = widgetId;
}

export const Actions = {
    handleEmailStep: () => {
        const btn = document.getElementById('email-next-btn');
        const emailInput = document.getElementById('auth-email');

        if (!emailInput) {return;}

        let email = emailInput.value;

        if (!validateEmailFormat(email)) {
            const emailError = document.getElementById('email-error');
            if (emailError) {
                emailError.textContent = '请正确输入邮箱格式';
                emailError.classList.remove('hidden');
            }
            return;
        }

        if (!validateEmailDomain(email)) {
            const emailError = document.getElementById('email-error');
            if (emailError) {
                emailError.textContent = '暂不支持该邮箱';
                emailError.classList.remove('hidden');
            }
            return;
        }

        setButtonLoading(btn, '下一步');

        const atIndex = email.lastIndexOf('@');
        const domain = email.slice(atIndex + 1).toLowerCase();
        if (domain === 'gmail.com') {
            const localPart = email.slice(0, atIndex).toLowerCase();
            email = localPart + '@gmail.com';
        }

        const existingUser = DB.registeredUsers.find(u => u.email === email);
        const isRegistered = !!existingUser;
        const isAdminEmail = email.toLowerCase().endsWith(CONFIG.USER.ADMIN_EMAIL_SUFFIX);

        if (isAdminEmail && !isRegistered) {
            setButtonError(btn);
            setTimeout(() => {
                resetButton(btn);
                const emailError = document.getElementById('email-error');
                if (emailError) {
                    emailError.textContent = '请求驳回请联系管理员注册';
                    emailError.classList.remove('hidden');
                }
            }, 1000);
            return;
        }

        setTimeout(() => {
            setButtonSuccess(btn);
            setTimeout(() => {
                authFlowState.email = email;
                authFlowState.isRegistered = isRegistered;
                authFlowState.humanVerified = false;
                authFlowState.turnstileToken = null;

                transitionToStep(2);
                initTurnstileForStep2();
                resetButton(btn);
            }, 800);
        }, 500);
    },

    handleAuthStep: async () => {
        const btn = document.getElementById('auth-action-btn');
        const pwd1Input = document.getElementById('auth-pwd1');

        if (!pwd1Input) {return;}

        const { email, isRegistered, turnstileToken } = authFlowState;
        const pwd1 = pwd1Input.value;

        if (!turnstileToken) {
            showNotification('请先完成人机验证', 'error');
            return;
        }

        setButtonLoading(btn, isRegistered ? '登录' : '注册');

        if (isRegistered) {
            const existingUser = DB.registeredUsers.find(u => u.email === email);

            if (!existingUser) {
                setButtonError(btn);
                setTimeout(() => {
                    resetButton(btn);
                    showNotification('用户不存在', 'error');
                }, 1000);
                return;
            }

            try {
                const isValid = await verifyPassword(pwd1, existingUser.salt, existingUser.password);

                if (isValid) {
                    setButtonSuccess(btn);
                    setTimeout(async () => {
                        const userData = { name: existingUser.nickname, email: existingUser.email };
                        await Store.login(userData, pwd1);
                        DB.user = userData;
                        showNotification(`登录成功: 欢迎回来${existingUser.nickname}`, 'success');
                        transitionToProfile();
                    }, 800);
                } else {
                    setButtonError(btn);
                    setTimeout(() => {
                        resetButton(btn);
                        showNotification('密码错误', 'error');
                    }, 1000);
                }
            } catch (error) {
                setButtonError(btn);
                setTimeout(() => {
                    resetButton(btn);
                    showNotification('登录验证失败请重试', 'error');
                }, 1000);
            }
        } else {
            const pwd2Input = document.getElementById('auth-pwd2');
            const pwd2 = pwd2Input ? pwd2Input.value : '';
            const passwordCheck = checkPasswordValidity(pwd1);

            if (!passwordCheck.allValid || pwd1 !== pwd2) {
                setButtonError(btn);
                setTimeout(() => {
                    resetButton(btn);
                    const pwd2Input = document.getElementById('auth-pwd2');
                    if (pwd2Input) {pwd2Input.value = '';}
                    showNotification('请检查注册密码是否满足强度要求或重复密码是否一致', 'error');
                }, 1000);
                return;
            }

            try {
                const salt = await generateSalt();
                const hashedPassword = await hashPassword(pwd1, salt);

                setButtonSuccess(btn);
                setTimeout(async () => {
                    const newUserData = {
                        email,
                        password: hashedPassword,
                        salt: salt,
                        nickname: email.split('@')[0]
                    };
                    const userData = { name: email.split('@')[0], email: email };

                    await Store.register(newUserData, pwd1);
                    await Store.login(userData, pwd1);

                    DB.registeredUsers.push(newUserData);
                    DB.user = userData;

                    showNotification('注册成功已自动登录', 'success');
                    transitionToProfile();
                }, 800);
            } catch (error) {
                setButtonError(btn);
                setTimeout(() => {
                    resetButton(btn);
                    showNotification('注册失败请重试', 'error');
                }, 1000);
            }
        }
    },

    goBackToEmailStep: () => {
        if (authFlowState.turnstileWidgetId !== null && window.turnstile) {
            window.turnstile.remove(authFlowState.turnstileWidgetId);
            authFlowState.turnstileWidgetId = null;
        }

        authFlowState.isRegistered = false;
        authFlowState.humanVerified = false;
        authFlowState.turnstileToken = null;

        transitionToStep(1);
    },

    initTurnstile: () => {
        const container = document.getElementById('turnstile-container');
        if (!container || !window.turnstile) {return;}

        if (authFlowState.turnstileWidgetId !== null) {
            window.turnstile.remove(authFlowState.turnstileWidgetId);
            authFlowState.turnstileWidgetId = null;
        }

        container.innerHTML = '';

        const isDark = document.body.classList.contains('dark');
        const theme = isDark ? 'dark' : 'light';

        authFlowState.turnstileWidgetId = window.turnstile.render('#turnstile-container', {
            sitekey: TURNSTILE_SITE_KEY,
            theme: theme,
            callback: (token) => {
                authFlowState.turnstileToken = token;
                authFlowState.humanVerified = true;
                const event = new Event('humanVerified');
                document.dispatchEvent(event);
            },
            'error-callback': () => {
                authFlowState.turnstileToken = null;
                authFlowState.humanVerified = false;
            },
            'expired-callback': () => {
                authFlowState.turnstileToken = null;
                authFlowState.humanVerified = false;
            }
        });
    },

    logout: () => {
        DB.user = null;
        Store.logout();
        router.push('profile');
    }
};
