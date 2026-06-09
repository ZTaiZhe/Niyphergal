import { DB } from './data.js';
import { Actions } from './auth.js';
import { validateEmailFormat, validateEmailDomain, checkPasswordValidity } from './utils.js';
import { AuthStore } from './store.js';

export function bindPasswordCheck() {
    if (DB.user) {return;}

    function bindEmailStepEvents() {
        const emailInput = document.getElementById('auth-email');
        const emailNextBtn = document.getElementById('email-next-btn');

        if (!emailInput || !emailNextBtn) {return;}

        const validateEmail = () => {
            let email = emailInput.value;
            const emailError = document.getElementById('email-error');

            if (email.includes('＠')) {
                email = email.replace(/＠/g, '@');
                emailInput.value = email;
            }

            if (email.length === 0) {
                if (emailError) {emailError.classList.add('hidden');}
                emailNextBtn.disabled = true;
                return;
            }

            const isEmailValid = validateEmailFormat(email);
            if (!isEmailValid) {
                if (emailError) {
                    emailError.textContent = '请正确输入邮箱格式';
                    emailError.classList.remove('hidden');
                }
                emailNextBtn.disabled = true;
                return;
            }

            const isDomainValid = validateEmailDomain(email);
            if (!isDomainValid) {
                if (emailError) {
                    emailError.textContent = '暂不支持该邮箱';
                    emailError.classList.remove('hidden');
                }
                emailNextBtn.disabled = true;
                return;
            }

            if (emailError) {emailError.classList.add('hidden');}
            emailNextBtn.disabled = false;
        };

        emailInput.addEventListener('input', validateEmail);
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && emailNextBtn.disabled === false) {
                Actions.handleEmailStep();
            }
        });

        validateEmail();
    }

    if (AuthStore.getState().step === 1) {
        bindEmailStepEvents();
    } else if (AuthStore.getState().step === 2) {
        bindAuthStepEvents();
        setTimeout(() => {
            Actions.initTurnstile();
        }, 100);
    }
}

export function bindAuthStepEvents() {
    const pwd1Input = document.getElementById('auth-pwd1');
    const pwd2Input = document.getElementById('auth-pwd2');
    const authActionBtn = document.getElementById('auth-action-btn');

    if (!pwd1Input || !authActionBtn) {return;}

    document.querySelectorAll('.toggle-password').forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        if (!targetInput) {return;}

        const showPassword = () => {
            targetInput.type = 'text';
            btn.innerHTML = '<i class="ri-eye-line"></i>';
        };

        const hidePassword = () => {
            targetInput.type = 'password';
            btn.innerHTML = '<i class="ri-eye-off-line"></i>';
        };

        btn.addEventListener('mousedown', showPassword);
        btn.addEventListener('mouseup', hidePassword);
        btn.addEventListener('mouseleave', hidePassword);
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            showPassword();
        });
        btn.addEventListener('touchend', hidePassword);
    });

    const validatePassword = () => {
        const { isRegistered, humanVerified } = AuthStore.getState();
        const pwd1 = pwd1Input.value;

        if (isRegistered) {
            authActionBtn.disabled = pwd1.length === 0 || !humanVerified;
        } else {
            const pwd2 = pwd2Input ? pwd2Input.value : '';
            const pwdMatchError = document.getElementById('pwd-match-error');
            const passwordCheck = checkPasswordValidity(pwd1);
            const pwdMatch = pwd1 === pwd2;

            const checkLengthEl = document.getElementById('check-length');
            const checkUpperEl = document.getElementById('check-upper');
            const checkLowerEl = document.getElementById('check-lower');
            const checkNumberEl = document.getElementById('check-number');
            const checkSpecialEl = document.getElementById('check-special');
            const greenIcon = 'ri-checkbox-circle-fill';
            const redIcon = 'ri-checkbox-circle-line';

            if (checkLengthEl) {checkLengthEl.innerHTML = `<i class="${passwordCheck.checks.length ? greenIcon : redIcon} mr-1 ${passwordCheck.checks.length ? 'text-green-500' : 'text-red-500'}"></i>至少8位`;}
            if (checkUpperEl) {checkUpperEl.innerHTML = `<i class="${passwordCheck.checks.upper ? greenIcon : redIcon} mr-1 ${passwordCheck.checks.upper ? 'text-green-500' : 'text-red-500'}"></i>至少1个大写字母`;}
            if (checkLowerEl) {checkLowerEl.innerHTML = `<i class="${passwordCheck.checks.lower ? greenIcon : redIcon} mr-1 ${passwordCheck.checks.lower ? 'text-green-500' : 'text-red-500'}"></i>至少1个小写字母`;}
            if (checkNumberEl) {checkNumberEl.innerHTML = `<i class="${passwordCheck.checks.number ? greenIcon : redIcon} mr-1 ${passwordCheck.checks.number ? 'text-green-500' : 'text-red-500'}"></i>至少1个数字`;}
            if (checkSpecialEl) {checkSpecialEl.innerHTML = `<i class="${passwordCheck.checks.special ? greenIcon : redIcon} mr-1 ${passwordCheck.checks.special ? 'text-green-500' : 'text-red-500'}"></i>至少1个特殊字符`;}

            if (pwdMatchError && pwd1.length > 0 && pwd2.length > 0 && !pwdMatch) {
                pwdMatchError.classList.remove('hidden');
            } else if (pwdMatchError) {
                pwdMatchError.classList.add('hidden');
            }

            authActionBtn.disabled = !passwordCheck.allValid || !pwdMatch || !humanVerified;
        }
    };

    pwd1Input.addEventListener('input', validatePassword);
    if (pwd2Input) {
        pwd2Input.addEventListener('input', validatePassword);
    }

    pwd1Input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && authActionBtn.disabled === false) {
            Actions.handleAuthStep();
        }
    });

    if (pwd2Input) {
        pwd2Input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && authActionBtn.disabled === false) {
                Actions.handleAuthStep();
            }
        });
    }

    document.addEventListener('humanVerified', validatePassword);

    validatePassword();
}

export default { bindPasswordCheck, bindAuthStepEvents };
