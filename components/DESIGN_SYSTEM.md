# Dashboard Design System

## 🎨 Design Tokens

### Color System

#### Base Colors
```css
:root {
  /* Grayscale */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Semantic Colors */
  --success: #10b981;
  --warning: #fbbf24;
  --error: #ef4444;
  --info: #3b82f6;
}
```

#### Theme Variants

**Default Theme (Blue)**
```css
[data-theme="default"] {
  --primary: #0075ff;
  --primary-light: #e5f1ff;
  --primary-dark: #0056cc;
  --accent: #00d4ff;
}
```

**Industrial Theme (Cyan)**
```css
[data-theme="industrial"] {
  --primary: #26c6da;
  --primary-light: #b2ebf2;
  --primary-dark: #00acc1;
  --accent: #ffab40;
}
```

**Medical Theme (Green)**
```css
[data-theme="medical"] {
  --primary: #4caf50;
  --primary-light: #e8f5e8;
  --primary-dark: #388e3c;
  --accent: #ff9800;
}
```

**Security Theme (Red)**
```css
[data-theme="security"] {
  --primary: #f44336;
  --primary-light: #ffebee;
  --primary-dark: #d32f2f;
  --accent: #ffc107;
}
```

### Typography Scale

```css
:root {
  /* Font Families */
  --font-primary: 'SUIT-Regular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Spacing System

```css
:root {
  /* Base Spacing (4px scale) */
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  
  /* Component Specific */
  --sidebar-width: 280px;
  --header-height: 64px;
  --widget-padding: var(--space-6);
  --nav-item-height: 48px;
}
```

### Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.375rem;   /* 6px */
  --radius-base: 0.5rem;   /* 8px */
  --radius-md: 0.75rem;    /* 12px */
  --radius-lg: 1rem;       /* 16px */
  --radius-xl: 1.5rem;     /* 24px */
  --radius-full: 9999px;
}
```

### Shadows & Effects

```css
:root {
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
  
  /* Z-Index */
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-modal-backdrop: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-tooltip: 70;
}
```

### Animation Keyframes

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

## 🧩 Component Specifications

### Dashboard Layout

```css
.dashboard-layout {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  font-family: var(--font-primary);
  color: var(--text-primary);
}

.dashboard-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  z-index: var(--z-fixed);
}

.dashboard-body {
  display: flex;
  padding-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
}
```

### Sidebar Component

```css
.sidebar {
  width: var(--sidebar-width);
  background-color: var(--bg-primary);
  border-radius: var(--radius-xl);
  margin: var(--space-5);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base);
  flex-shrink: 0;
  z-index: var(--z-sticky);
}

.sidebar.collapsed {
  transform: translateX(-100%);
  margin-left: calc(-1 * var(--sidebar-width));
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  margin: var(--space-1) 0;
  border-radius: var(--radius-base);
  color: var(--text-primary);
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
  font-weight: var(--font-medium);
  min-height: var(--nav-item-height);
}

.nav-item:hover {
  background-color: var(--gray-100);
  color: var(--text-primary);
}

.nav-item.active {
  background-color: var(--primary-light);
  color: var(--primary);
}

.nav-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
```

### Widget/Card Component

```css
.widget {
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--widget-padding);
  box-shadow: var(--shadow-base);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.widget:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-color);
}

.widget-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.widget-content {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Button System

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-base);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  line-height: var(--leading-tight);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.btn-secondary {
  background-color: var(--gray-100);
  color: var(--text-primary);
  border-color: var(--gray-200);
}

.btn-secondary:hover {
  background-color: var(--gray-200);
}
```

### Status Indicators

```css
.status-normal { color: var(--success); }
.status-warning { color: var(--warning); }
.status-error { color: var(--error); }
.status-info { color: var(--info); }

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  display: inline-block;
}

.status-dot.normal { background-color: var(--success); }
.status-dot.warning { background-color: var(--warning); }
.status-dot.error { background-color: var(--error); }
.status-dot.info { background-color: var(--info); }
```

## 📱 Responsive Design

### Breakpoint System

```css
:root {
  --bp-sm: 640px;   /* Small devices (mobile) */
  --bp-md: 768px;   /* Medium devices (tablet) */
  --bp-lg: 1024px;  /* Large devices (desktop) */
  --bp-xl: 1280px;  /* Extra large devices */
  --bp-2xl: 1536px; /* 2X large devices */
}

/* Mobile First Approach */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: var(--header-height);
    left: 0;
    height: calc(100vh - var(--header-height));
    z-index: var(--z-modal);
    transform: translateX(-100%);
    margin: 0;
    border-radius: 0;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0 !important;
    padding: var(--space-4);
  }
  
  .widget-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
}
```

## 🎭 Theme Customization Guide

### 1. Color Customization
Create a theme by overriding color variables:

```css
[data-theme="custom"] {
  --primary: #your-brand-color;
  --primary-light: #lighter-shade;
  --primary-dark: #darker-shade;
  --accent: #accent-color;
}
```

### 2. Typography Customization
```css
[data-theme="custom"] {
  --font-primary: 'YourFont', sans-serif;
  --text-base: 1.125rem; /* Adjust base size */
}
```

### 3. Layout Customization
```css
[data-theme="custom"] {
  --sidebar-width: 320px; /* Wider sidebar */
  --header-height: 80px;  /* Taller header */
  --widget-padding: 2rem; /* More padding */
}
```

### 4. Component Style Overrides
```css
[data-theme="custom"] .nav-item {
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
}

[data-theme="custom"] .widget {
  border: 2px solid var(--primary);
}
```

## ⚡ Performance Guidelines

### CSS Optimization
- Use CSS custom properties for dynamic theming
- Minimize CSS file size with CSS purging
- Use `will-change` property sparingly for animations
- Leverage GPU acceleration with `transform` instead of `left/top`

### Animation Best Practices
- Keep animations under 300ms for perceived performance
- Use `transform` and `opacity` for smooth animations
- Add `motion-reduce` media query support
- Debounce resize and scroll events

### Accessibility
- Maintain 4.5:1 color contrast ratio minimum
- Support keyboard navigation
- Include focus indicators
- Use semantic HTML structure
- Add ARIA labels where needed

## 🚀 Implementation Examples

### Quick Start Template
```html
<!DOCTYPE html>
<html lang="ko" data-theme="default">
<head>
  <link rel="stylesheet" href="design-system.css">
</head>
<body>
  <div class="dashboard-layout">
    <header class="dashboard-header">
      <!-- Header content -->
    </header>
    <div class="dashboard-body">
      <aside class="sidebar">
        <!-- Sidebar content -->
      </aside>
      <main class="main-content">
        <!-- Main content -->
      </main>
    </div>
  </div>
</body>
</html>
```

### JavaScript Theme Switcher
```javascript
function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('dashboard-theme', themeName);
}

// Load saved theme
const savedTheme = localStorage.getItem('dashboard-theme') || 'default';
setTheme(savedTheme);
```