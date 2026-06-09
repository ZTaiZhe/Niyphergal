# 🎨 Feature Spec: 日间模式搜索栏可见性增强

## 🎯 背景与动机 (Motivation)
用户反馈日间模式下无法识别搜索栏位置。原因是搜索栏背景透明度过高（48%有效不透明度），边框为白色，与白色背景融合，导致搜索栏难以辨识。

## 💡 核心改动概览 (What Changes)
- **背景透明度**：从 `rgba(255,255,255,0.6)` + `opacity:0.8` 改为 `rgba(255,255,255,0.85)` + `opacity:1`
- **边框颜色**：从 `rgba(255,255,255,0.3)` 改为 `rgba(0,0,0,0.08)`
- **阴影效果**：添加 `box-shadow: 0 2px 8px rgba(0,0,0,0.06)`
- **交互状态**：添加悬停和聚焦效果

## 🔗 影响范围 (Impact)
- **Affected Specs**: search-bar-acrylic, search-bar-pill-shape
- **Affected Code**:
  - 🎨 src/css/styles.css（`#desktop-search-bar` 样式）

## 📖 核心需求场景 (BDD Scenarios)

### Requirement 1: 日间模式搜索栏可见性
系统 SHALL 使搜索栏在日间模式下清晰可辨。

#### Scenario A: 默认状态
- **GIVEN** 页面处于日间模式
- **WHEN** 用户浏览页面
- **THEN** 搜索栏清晰可见
- **AND** 与背景形成足够对比

#### Scenario B: 悬停状态
- **GIVEN** 页面处于日间模式
- **WHEN** 用户悬停搜索栏
- **THEN** 搜索栏有明显的视觉反馈

## ⚙️ 技术实现参考 (Technical Implementation)

### CSS 修改

```css
#desktop-search-bar {
    background: rgba(255, 255, 255, 0.85);
    opacity: 1;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

#desktop-search-bar:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

#desktop-search-bar:focus-within {
    border-color: rgba(254, 0, 127, 0.3);
    box-shadow: 0 2px 8px rgba(254, 0, 127, 0.15);
}
```

## ✅ QA 验收检查单 (Acceptance Checklist)

### 🧪 视觉效果
- [ ] 日间模式下搜索栏清晰可见
- [ ] 搜索栏与背景形成足够对比
- [ ] 悬停时有明显视觉反馈
- [ ] 聚焦时有品牌色边框反馈
