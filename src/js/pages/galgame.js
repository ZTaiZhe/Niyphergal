import { renderCardSkeleton } from "../modules/ui/components.js";

export function renderGalgameSkeleton() {
    const searchBarSkel = '<div class="skel-base mb-6" style="width:100%;height:48px;border-radius:9999px"></div>';
    const cardSkels = Array(6).fill(0).map((_, i) =>
        renderCardSkeleton(i * 0.08)
    ).join("");
    return `
        <div class="auth-page-container">
            <div class="glass-card wide-card flex flex-col space-y-4 mx-auto">
                ${searchBarSkel}
                <div class="skel-base" style="width:100%;height:48px;border-radius:12px"></div>
            </div>
            <div class="game-cards-container mt-6">
                ${cardSkels}
            </div>
        </div>
    `;
}

export function renderGalgame(animationClass = "") {
    return `
        <div class="${animationClass ? animationClass + " " : ""}auth-page-container">
            <div class="glass-card wide-card flex flex-col space-y-4 mx-auto">
                <h2 class="text-2xl font-bold mb-1 text-center">Niypher</h2>
                <p class="text-xs text-gray-400 mb-4 text-center">引力搜索 Galgame</p>
                <div class="form-input-wrapper">
                    <i class="ri-search-line text-gray-400 mr-2 absolute left-0 top-1/2 -translate-y-1/2"></i>
                    <input type="text" id="gal-search" placeholder="输入游戏原名或中文名..." class="form-input pl-6">
                </div>
                <button data-action="galgame-search" class="w-full bg-pink-600 text-white mt-4 py-3 rounded-xl font-bold text-sm btn-active shadow-lg shadow-pink-600/20">引力搜索</button>
            </div>
            
            <div class="mt-6 opacity-40 text-center space-y-2">
                <i class="ri-database-2-line text-4xl"></i>
                <p class="text-xs">
                    Source: <br>
                    <a href="https://github.com/Moe-Sakura/SearchGal" target="_blank" class="text-[10px] text-pink-600 hover:underline">
                        : https://github.com/Moe-Sakura/SearchGal
                    </a>
                </p>
            </div>
        </div>
    `;
}
