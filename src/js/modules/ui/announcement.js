import { DB } from '../foundation/data.js';

export function showAnnouncement() {
    const modal = document.getElementById('announcement-modal');
    if (modal) {
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
    }
}

export function closeAnnouncement(event) {
    const modal = document.getElementById('announcement-modal');
    if (modal) {
        modal.classList.add('hidden');
        DB.announcement.show = false;
    }
}

export default { showAnnouncement, closeAnnouncement };
