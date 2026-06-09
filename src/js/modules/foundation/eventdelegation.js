import { router } from './router.js';
import { showNotification } from './utils.js';
import { DB } from './data.js';
import { Actions } from './auth.js';
import { closeAnnouncement } from '../ui/announcement.js';
import { ImageViewer } from '../ui/components.js';
import { performHeroNavigate, performHeroExit, getHeroExitContext } from '../ui/animationHelpers.js';
import { setHeroTransition } from '../../pages/detail.js';

export const EventDelegation = {
    initialized: false,

    init: function() {
        if (this.initialized) {return;}

        document.addEventListener('click', this.handleClick.bind(this));

        this.initialized = true;
    },

    handleClick: function(e) {
        const target = e.target.closest('[data-action]');
        if (!target) {return;}

        const action = target.dataset.action;
        const params = target.dataset.params ? JSON.parse(target.dataset.params) : {};

        this.executeAction(action, params, target, e);
    },

    executeAction: function(action, params, target, event) {
        const actions = {
            'navigate': () => {
                const page = params.page;
                const data = params.data || {};
                router.push(page, data);
            },

            'navigate-hero-back': function() {
                var ctx = getHeroExitContext();
                if (ctx) {
                    performHeroExit(router);
                } else {
                    router.push('home');
                }
            },

            'navigate-detail': function() {
                var id = target.dataset.id;
                if (!id) return;

                var sourceImg = target.querySelector('[data-hero-role="source"]');

                if (sourceImg && sourceImg.complete) {
                    setHeroTransition(true);
                    performHeroNavigate(sourceImg, id, router);
                } else if (sourceImg && !sourceImg.complete) {
                    sourceImg.onload = function() {
                        setHeroTransition(true);
                        performHeroNavigate(sourceImg, id, router);
                    };
                    setTimeout(function() {
                        if (!sourceImg.complete) {
                            setHeroTransition(false);
                            router.push('detail', { id: id });
                        }
                    }, 300);
                } else {
                    setHeroTransition(false);
                    router.push('detail', { id: id });
                }
            },

            'show-notification': () => {
                const message = params.message || '操作成功';
                const type = params.type || 'info';
                showNotification(message, type);
            },

            'logout': () => {
                if (Actions && Actions.logout) {
                    Actions.logout();
                }
            },

            'handle-email-step': () => {
                if (Actions && Actions.handleEmailStep) {
                    Actions.handleEmailStep();
                }
            },

            'go-back-email-step': () => {
                if (Actions && Actions.goBackToEmailStep) {
                    Actions.goBackToEmailStep();
                }
            },

            'handle-auth-step': () => {
                if (Actions && Actions.handleAuthStep) {
                    Actions.handleAuthStep();
                }
            },

            'close-announcement': () => {
                closeAnnouncement(event);
            },

            'close-modal': () => {
                const modalId = target.dataset.modalId;
                if (modalId) {
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.classList.add('hidden');
                    }
                }
            },

            'download': () => {
                showNotification('下载功能开发中', 'info');
            },

            'report': () => {
                showNotification('举报已提交', 'success');
            },

            'feedback': () => {
                showNotification('反馈已提交', 'success');
            },

            'upload': () => {
                showNotification('上传功能开发中', 'info');
            },

            'comment': () => {
                showNotification('评论发送功能开发中', 'info');
            },

            'galgame-search': () => {
                showNotification('搜索功能开发中', 'info');
            },

            'category-navigate': () => {
                const name = target.dataset.name;
                showNotification(`进入 ${name} 分类`, 'info');
            },

            'open-image-viewer': () => {
                const mediaList = DB.resources.find(r => r.id === parseInt(target.closest('.glass-card')?.dataset?.id || router.params?.id))?.media || [];
                const index = parseInt(target.dataset.index) || 0;
                ImageViewer.open(mediaList, index);
            },

            'close-image-viewer': () => {
                ImageViewer.close();
            },

            'viewer-zoom-in': () => {
                ImageViewer.zoom(1.25, window.innerWidth / 2, window.innerHeight / 2);
            },

            'viewer-zoom-out': () => {
                ImageViewer.zoom(0.8, window.innerWidth / 2, window.innerHeight / 2);
            },

            'viewer-zoom-reset': () => {
                ImageViewer.resetZoom();
            },

            'viewer-prev': () => {
                ImageViewer.prev();
            },

            'viewer-next': () => {
                ImageViewer.next();
            }
        };

        if (actions[action]) {
            actions[action]();
        }
    }
};

export default EventDelegation;
