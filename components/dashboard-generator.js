/**
 * Dashboard Generator
 * Easy-to-use abstraction layer for creating customized dashboards
 */

class DashboardGenerator {
  constructor() {
    this.templates = new Map();
    this.themes = new Map();
    this.configurations = new Map();
    
    // Load default templates and themes
    this.loadDefaults();
  }
  
  /**
   * Load default templates and themes
   */
  loadDefaults() {
    // Default themes
    this.registerTheme('default', {
      name: 'Default Blue',
      colors: {
        primary: '#0075ff',
        primaryLight: '#e5f1ff',
        primaryDark: '#0056cc',
        accent: '#00d4ff'
      }
    });
    
    this.registerTheme('recycling', {
      name: 'Eco Recycling',
      colors: {
        primary: '#26c6da',
        primaryLight: '#b2ebf2', 
        primaryDark: '#00acc1',
        accent: '#4caf50'
      }
    });
    
    this.registerTheme('school', {
      name: 'Smart School',
      colors: {
        primary: '#4caf50',
        primaryLight: '#e8f5e8',
        primaryDark: '#388e3c',
        accent: '#ff9800'
      }
    });
    
    this.registerTheme('industrial', {
      name: 'AI Industrial',
      colors: {
        primary: '#ff9800',
        primaryLight: '#fff3e0',
        primaryDark: '#f57c00',
        accent: '#26c6da'
      }
    });
    
    this.registerTheme('security', {
      name: 'Gas Security',
      colors: {
        primary: '#f44336',
        primaryLight: '#ffebee',
        primaryDark: '#d32f2f',
        accent: '#ffc107'
      }
    });
  }
  
  /**
   * Register a new theme
   */
  registerTheme(id, theme) {
    this.themes.set(id, {
      id,
      ...theme
    });
  }
  
  /**
   * Register a new template
   */
  registerTemplate(id, template) {
    this.templates.set(id, template);
  }
  
  /**
   * Create a new dashboard configuration
   */
  createDashboard(config) {
    const dashboardId = config.id || this.generateId();
    
    // Merge with defaults
    const fullConfig = this.mergeWithDefaults(config);
    
    // Validate configuration
    this.validateConfig(fullConfig);
    
    // Store configuration
    this.configurations.set(dashboardId, fullConfig);
    
    // Generate dashboard
    return this.generateDashboard(fullConfig);
  }
  
  /**
   * Generate dashboard HTML and configuration
   */
  generateDashboard(config) {
    const {
      id,
      title,
      theme,
      logo,
      user,
      navigation,
      widgets,
      layout,
      scripts,
      styles
    } = config;
    
    // Generate navigation HTML
    const navigationHtml = this.generateNavigation(navigation);
    
    // Generate widgets HTML
    const widgetsHtml = this.generateWidgets(widgets, layout);
    
    // Generate page actions
    const pageActionsHtml = this.generatePageActions(config.pageActions || []);
    
    // Generate modals
    const modalsHtml = this.generateModals(config.modals || []);
    
    // Create dashboard configuration object
    const dashboardConfig = this.createDashboardConfig(config);
    
    // Generate CSS variables for theme
    const themeCSS = this.generateThemeCSS(theme);
    
    // Load template and replace placeholders
    let html = this.getBaseTemplate();
    
    const replacements = {
      '{{DASHBOARD_TITLE}}': title,
      '{{LOGO_SRC}}': logo.src || '../assets/logo-nav.png',
      '{{LOGO_ALT}}': logo.alt || title,
      '{{LOGO_HREF}}': logo.href || '../index.html',
      '{{USER_NAME}}': user.name || 'Admin',
      '{{PAGE_TITLE}}': config.pageTitle || title,
      '{{PAGE_DESCRIPTION}}': config.pageDescription || '',
      '{{NAVIGATION_ITEMS}}': navigationHtml,
      '{{CONTENT_WIDGETS}}': widgetsHtml,
      '{{PAGE_ACTIONS}}': pageActionsHtml,
      '{{MODALS}}': modalsHtml,
      '{{SIDEBAR_FOOTER}}': config.sidebarFooter || '',
      '{{DASHBOARD_CONFIG}}': JSON.stringify(dashboardConfig, null, 2)
    };
    
    // Replace all placeholders
    Object.entries(replacements).forEach(([placeholder, value]) => {
      html = html.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return {
      id,
      html,
      css: themeCSS,
      config: dashboardConfig,
      theme: this.themes.get(theme)
    };
  }
  
  /**
   * Merge configuration with defaults
   */
  mergeWithDefaults(config) {
    const defaults = {
      theme: 'default',
      logo: {
        src: '../assets/logo-nav.png',
        alt: 'Logo',
        href: '../index.html'
      },
      user: {
        name: 'Admin'
      },
      layout: {
        grid: 'lg:grid-cols-12',
        gap: 'gap-6'
      },
      navigation: [],
      widgets: [],
      pageActions: [],
      modals: [],
      scripts: [],
      styles: [],
      features: {
        darkMode: true,
        sidebarToggle: true,
        responsive: true,
        persistence: true
      }
    };
    
    return this.deepMerge(defaults, config);
  }
  
  /**
   * Generate navigation HTML
   */
  generateNavigation(navigation) {
    return navigation.map(item => {
      if (item.children && item.children.length > 0) {
        return this.generateAccordionNav(item);
      } else {
        return this.generateSimpleNav(item);
      }
    }).join('');
  }
  
  /**
   * Generate simple navigation item
   */
  generateSimpleNav(item) {
    return `
      <li class="nav-item-container">
        <div class="nav-item ${item.active ? 'active' : ''}" 
             data-page-id="${item.id}" 
             title="${item.label}">
          <div class="nav-icon">
            ${this.getIcon(item.icon)}
          </div>
          <span class="nav-label">${item.label}</span>
        </div>
      </li>
    `;
  }
  
  /**
   * Generate accordion navigation item
   */
  generateAccordionNav(item) {
    const submenuItems = item.children.map(child => `
      <li>
        <div class="nav-item" data-page-id="${child.id}" title="${child.label}">
          <div class="nav-icon">
            ${this.getIcon(child.icon)}
          </div>
          <span class="nav-label">${child.label}</span>
        </div>
      </li>
    `).join('');
    
    return `
      <li class="nav-item-container">
        <button type="button" 
                id="accordion-${item.id}"
                aria-controls="${item.id}-submenu"
                aria-expanded="false"
                data-state="closed"
                class="nav-item accordion-button">
          <div class="nav-icon">
            ${this.getIcon(item.icon)}
          </div>
          <span class="nav-label">${item.label}</span>
          <svg class="accordion-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 9L12 15L18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div id="${item.id}-submenu" 
             role="region"
             class="submenu accordion-content"
             style="max-height: 0;">
          <ul class="submenu-list">
            ${submenuItems}
          </ul>
        </div>
      </li>
    `;
  }
  
  /**
   * Generate widgets HTML
   */
  generateWidgets(widgets, layout) {
    const gridClass = layout.grid || 'lg:grid-cols-12';
    const gapClass = layout.gap || 'gap-6';
    
    const widgetsHtml = widgets.map(widget => {
      return this.generateWidget(widget);
    }).join('');
    
    return `<div class="content-grid ${gridClass} ${gapClass}">${widgetsHtml}</div>`;
  }
  
  /**
   * Generate individual widget
   */
  generateWidget(widget) {
    const { type, id, title, size, content, config = {} } = widget;
    
    const sizeClasses = {
      small: 'lg:col-span-3',
      medium: 'lg:col-span-6', 
      large: 'lg:col-span-8',
      xl: 'lg:col-span-12'
    };
    
    const widgetClass = sizeClasses[size] || sizeClasses.medium;
    const widgetId = id || this.generateId('widget');
    
    let widgetContent = '';
    
    switch (type) {
      case 'kpi':
        widgetContent = this.generateKPIWidget(content);
        break;
      case 'chart':
        widgetContent = this.generateChartWidget(widgetId, content);
        break;
      case 'table':
        widgetContent = this.generateTableWidget(content);
        break;
      case 'map':
        widgetContent = this.generateMapWidget(widgetId, content);
        break;
      case 'custom':
        widgetContent = content.html || '';
        break;
      default:
        widgetContent = content.html || '<p>Widget content</p>';
    }
    
    return `
      <div class="widget ${widgetClass}" 
           data-widget-id="${widgetId}" 
           data-widget-type="${type}">
        <div class="widget-header">
          <h3 class="widget-title">
            ${content.icon ? `<div class="widget-icon">${this.getIcon(content.icon)}</div>` : ''}
            ${title}
          </h3>
          ${config.actions ? this.generateWidgetActions(config.actions) : ''}
        </div>
        <div class="widget-content">
          ${widgetContent}
        </div>
        ${config.footer ? `<div class="widget-footer">${config.footer}</div>` : ''}
      </div>
    `;
  }
  
  /**
   * Generate KPI widget content
   */
  generateKPIWidget(content) {
    if (content.kpis) {
      // Multiple KPIs in grid
      const gridCols = Math.min(content.kpis.length, 4);
      const kpiItems = content.kpis.map(kpi => `
        <div class="kpi-widget">
          <div class="kpi-icon-container">
            <div class="kpi-icon ${kpi.iconColor || 'blue'}">
              ${this.getIcon(kpi.icon)}
            </div>
          </div>
          <div class="kpi-content">
            <p class="kpi-label">${kpi.label}</p>
            <p class="kpi-value">
              ${kpi.value}
              <span class="kpi-unit">${kpi.unit || ''}</span>
            </p>
            ${kpi.trend ? `<div class="kpi-trend">${kpi.trend}</div>` : ''}
          </div>
        </div>
      `).join('');
      
      return `<div class="grid grid-cols-1 sm:grid-cols-${Math.min(gridCols, 2)} lg:grid-cols-${gridCols} gap-4">${kpiItems}</div>`;
    } else {
      // Single KPI
      return `
        <div class="kpi-widget">
          <div class="kpi-icon-container">
            <div class="kpi-icon ${content.iconColor || 'blue'}">
              ${this.getIcon(content.icon)}
            </div>
          </div>
          <div class="kpi-content">
            <p class="kpi-label">${content.label}</p>
            <p class="kpi-value">
              ${content.value}
              <span class="kpi-unit">${content.unit || ''}</span>
            </p>
            ${content.trend ? `<div class="kpi-trend">${content.trend}</div>` : ''}
          </div>
        </div>
      `;
    }
  }
  
  /**
   * Generate chart widget content
   */
  generateChartWidget(widgetId, content) {
    const chartId = `chart-${widgetId}`;
    const height = content.height || '300px';
    
    return `
      <div class="chart-container" style="height: ${height};">
        <canvas id="${chartId}" class="chart-canvas"></canvas>
      </div>
    `;
  }
  
  /**
   * Generate table widget content
   */
  generateTableWidget(content) {
    if (!content.headers || !content.rows) {
      return '<p>No table data provided</p>';
    }
    
    const headerHtml = content.headers.map(header => `<th>${header}</th>`).join('');
    const rowsHtml = content.rows.map(row => 
      `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
    ).join('');
    
    return `
      <div class="table-container">
        <table class="widget-table">
          <thead>
            <tr>${headerHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }
  
  /**
   * Generate map widget content
   */
  generateMapWidget(widgetId, content) {
    const mapId = `map-${widgetId}`;
    const height = content.height || '400px';
    
    return `
      <div id="${mapId}" class="map-container" style="height: ${height};"></div>
    `;
  }
  
  /**
   * Generate widget actions
   */
  generateWidgetActions(actions) {
    const actionsHtml = actions.map(action => `
      <button class="btn btn-sm btn-secondary" 
              onclick="${action.onclick || ''}"
              title="${action.title || ''}">
        ${action.icon ? this.getIcon(action.icon) : ''}
        ${action.label || ''}
      </button>
    `).join('');
    
    return `<div class="widget-actions">${actionsHtml}</div>`;
  }
  
  /**
   * Generate page actions
   */
  generatePageActions(actions) {
    return actions.map(action => `
      <button class="btn ${action.type === 'primary' ? 'btn-primary' : 'btn-secondary'}"
              onclick="${action.onclick || ''}"
              ${action.id ? `id="${action.id}"` : ''}>
        ${action.icon ? this.getIcon(action.icon) : ''}
        ${action.label}
      </button>
    `).join('');
  }
  
  /**
   * Generate modals
   */
  generateModals(modals) {
    return modals.map(modal => `
      <div id="${modal.id}" class="modal-overlay hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${modal.title}</h3>
            <button class="modal-close" aria-label="Close Modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6L18 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            ${modal.content || ''}
          </div>
          ${modal.actions ? `
            <div class="modal-footer">
              ${modal.actions.map(action => `
                <button class="btn ${action.type === 'primary' ? 'btn-primary' : 'btn-secondary'}"
                        onclick="${action.onclick || ''}">
                  ${action.label}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
  
  /**
   * Generate theme CSS
   */
  generateThemeCSS(themeId) {
    const theme = this.themes.get(themeId);
    if (!theme) return '';
    
    return `
      [data-theme="${themeId}"] {
        --primary: ${theme.colors.primary};
        --primary-light: ${theme.colors.primaryLight};
        --primary-dark: ${theme.colors.primaryDark};
        --accent: ${theme.colors.accent};
      }
    `;
  }
  
  /**
   * Create dashboard configuration object for JavaScript
   */
  createDashboardConfig(config) {
    return {
      id: config.id,
      theme: config.theme,
      sidebarOpen: true,
      persistState: config.features?.persistence !== false,
      animations: config.features?.animations !== false,
      responsive: config.features?.responsive !== false
    };
  }
  
  /**
   * Get icon HTML
   */
  getIcon(iconName) {
    const icons = {
      home: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path></svg>',
      dashboard: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path></svg>',
      chart: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"></path></svg>',
      settings: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>',
      users: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>',
      report: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
      download: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>'
    };
    
    return icons[iconName] || iconName;
  }
  
  /**
   * Get base template HTML
   */
  getBaseTemplate() {
    // This would typically load from the template file
    // For now, returning a simplified version
    return `
<!DOCTYPE html>
<html lang="ko" data-theme="{{THEME_ID}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{DASHBOARD_TITLE}}</title>
  <link rel="icon" type="image/x-icon" href="../assets/favicon.png">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="stylesheet" href="./dashboard-components.css">
  <link rel="stylesheet" href="./custom-styles.css">
</head>
<body class="dashboard-layout">
  <header class="dashboard-header">
    <div class="header-container">
      <div class="header-left">
        <button id="sidebar-toggle" class="sidebar-toggle-btn">
          <svg class="sidebar-icon sidebar-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M15 18L9 12L15 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg class="sidebar-icon sidebar-icon-open hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12H21M3 6H21M3 18H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <a href="{{LOGO_HREF}}" class="logo-link">
          <img src="{{LOGO_SRC}}" alt="{{LOGO_ALT}}" class="logo-image">
        </a>
        <h1 class="dashboard-title">{{DASHBOARD_TITLE}}</h1>
      </div>
      <div class="header-right">
        <nav class="header-nav">
          <button id="theme-toggle" class="nav-button">
            <svg class="theme-icon theme-icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="5" stroke-width="2"/>
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke-width="2"/>
            </svg>
            <svg class="theme-icon theme-icon-dark hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" stroke-width="2"/>
            </svg>
          </button>
          <div class="user-info">
            <button class="user-button">
              <svg class="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke-width="2"/>
                <circle cx="12" cy="7" r="4" stroke-width="2"/>
              </svg>
              <span class="user-name">{{USER_NAME}}</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  </header>

  <div class="dashboard-body">
    <aside id="sidebar" class="sidebar">
      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <ul class="nav-list">
            {{NAVIGATION_ITEMS}}
          </ul>
        </nav>
        <div class="sidebar-footer">
          {{SIDEBAR_FOOTER}}
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div class="page-header">
        <div class="page-title-section">
          <h2 class="page-title">{{PAGE_TITLE}}</h2>
          <p class="page-description">{{PAGE_DESCRIPTION}}</p>
        </div>
        <div class="page-actions">
          {{PAGE_ACTIONS}}
        </div>
      </div>
      {{CONTENT_WIDGETS}}
    </main>
  </div>

  <div id="modal-container">
    {{MODALS}}
  </div>

  <script src="./dashboard-controller.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const config = {{DASHBOARD_CONFIG}};
      const dashboard = new DashboardController(config);
      dashboard.init();
    });
  </script>
</body>
</html>`;
  }
  
  /**
   * Validate configuration
   */
  validateConfig(config) {
    if (!config.title) {
      throw new Error('Dashboard title is required');
    }
    
    if (!config.id) {
      config.id = this.generateId('dashboard');
    }
    
    if (!this.themes.has(config.theme)) {
      console.warn(`Theme '${config.theme}' not found, using default`);
      config.theme = 'default';
    }
    
    return true;
  }
  
  /**
   * Generate unique ID
   */
  generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Deep merge objects
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  /**
   * Save dashboard configuration as file
   */
  saveDashboard(dashboard, filename) {
    const { html, css, config } = dashboard;
    
    // Create downloadable files
    const files = {
      [`${filename}.html`]: html,
      [`${filename}-theme.css`]: css,
      [`${filename}-config.json`]: JSON.stringify(config, null, 2)
    };
    
    return files;
  }
  
  /**
   * Get all available themes
   */
  getAvailableThemes() {
    return Array.from(this.themes.values());
  }
  
  /**
   * Get theme by ID
   */
  getTheme(id) {
    return this.themes.get(id);
  }
}

// Quick configuration presets for common dashboard types
class DashboardPresets {
  static recyclingDashboard() {
    return {
      title: "스마트 재활용 분리수거 통합관제 대시보드",
      theme: "recycling",
      pageTitle: "스마트 재활용 분리수거 통합관제 대시보드",
      pageDescription: "울산광역시 중구 스마트 재활용 분리수거 시스템을 통합 관리합니다.",
      navigation: [
        { id: "dashboard", label: "대시보드", icon: "dashboard", active: true }
      ],
      widgets: [
        {
          type: "kpi",
          title: "수거기 현황",
          size: "large",
          content: {
            kpis: [
              { label: "총 수거기", value: "43", icon: "home", iconColor: "blue" },
              { label: "정상 작동", value: "38", icon: "chart", iconColor: "green" },
              { label: "점검 필요", value: "4", icon: "settings", iconColor: "orange" },
              { label: "오류", value: "1", icon: "report", iconColor: "red" }
            ]
          }
        },
        {
          type: "chart",
          title: "오늘의 수거량 (kg)",
          size: "medium",
          content: { height: "300px" }
        }
      ],
      pageActions: [
        {
          label: "보고서 생성",
          type: "primary", 
          icon: "report",
          id: "open-report-menu-btn"
        }
      ]
    };
  }
  
  static schoolDashboard() {
    return {
      title: "Smart School Integrated Dashboard",
      theme: "school",
      navigation: [
        { id: "dashboard", label: "Dashboard", icon: "dashboard", active: true },
        { id: "environment", label: "Environment", icon: "chart" },
        {
          id: "safety",
          label: "Safety",
          icon: "settings",
          children: [
            { id: "fire-safety", label: "Fire Detection", icon: "report" },
            { id: "emergency-alert", label: "Emergency Alert", icon: "report" },
            { id: "danger-zone", label: "Danger Zone", icon: "report" }
          ]
        },
        { id: "access-control", label: "Access Control", icon: "users" },
        { id: "attendance", label: "Smart Attendance", icon: "users" }
      ]
    };
  }
  
  static industrialDashboard() {
    return {
      title: "AI 펌프카 통합 관제 대시보드",
      theme: "industrial",
      navigation: [
        { id: "dashboard", label: "대시보드", icon: "dashboard", active: true },
        { id: "live-control", label: "실시간 관제", icon: "chart" },
        { id: "boom-health", label: "붐 건전성 모니터링", icon: "settings" },
        {
          id: "ai-analysis",
          label: "AI 분석",
          icon: "chart",
          children: [
            { id: "predictive-maintenance", label: "예측 정비", icon: "settings" },
            { id: "performance-analysis", label: "성능 분석", icon: "chart" }
          ]
        }
      ]
    };
  }
  
  static securityDashboard() {
    return {
      title: "GASTRON 5대 가스 실시간 통합 관제 대시보드",
      theme: "security",
      navigation: [
        { id: "dashboard", label: "대시보드", icon: "dashboard", active: true }
      ],
      widgets: [
        {
          type: "kpi",
          title: "가스 감지 현황",
          size: "large", 
          content: {
            kpis: [
              { label: "CO", value: "0.2", unit: "ppm", iconColor: "green" },
              { label: "H2S", value: "1.5", unit: "ppm", iconColor: "orange" },
              { label: "CH4", value: "0.8", unit: "ppm", iconColor: "blue" },
              { label: "NH3", value: "2.1", unit: "ppm", iconColor: "red" }
            ]
          }
        }
      ]
    };
  }
}

// Export classes
window.DashboardGenerator = DashboardGenerator;
window.DashboardPresets = DashboardPresets;