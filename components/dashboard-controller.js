/**
 * Dashboard Controller
 * Manages dashboard state, components, and interactions
 */

class DashboardController {
  constructor(config = {}) {
    this.config = {
      theme: 'default',
      sidebarOpen: true,
      persistState: true,
      animations: true,
      ...config
    };
    
    this.state = {
      sidebarOpen: this.config.sidebarOpen,
      currentTheme: this.config.theme,
      activeNavItem: null,
      modals: new Set(),
      accordions: new Map()
    };
    
    this.elements = {};
    this.charts = new Map();
    this.widgets = new Map();
    
    // Bind methods
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
    this.handleAccordionClick = this.handleAccordionClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  
  /**
   * Initialize the dashboard
   */
  init() {
    this.cacheElements();
    this.loadPersistedState();
    this.setupEventListeners();
    this.initializeComponents();
    this.applyTheme();
    this.updateSidebarState();
    
    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    console.log('Dashboard Controller initialized');
  }
  
  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      sidebar: document.getElementById('sidebar'),
      sidebarToggle: document.getElementById('sidebar-toggle'),
      themeToggle: document.getElementById('theme-toggle'),
      mainContent: document.querySelector('.main-content'),
      navItems: document.querySelectorAll('.nav-item'),
      accordionButtons: document.querySelectorAll('[id^="accordion-"]'),
      modalOverlays: document.querySelectorAll('.modal-overlay'),
      modalCloseButtons: document.querySelectorAll('.modal-close')
    };
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Sidebar toggle
    if (this.elements.sidebarToggle) {
      this.elements.sidebarToggle.addEventListener('click', this.toggleSidebar);
    }
    
    // Theme toggle
    if (this.elements.themeToggle) {
      this.elements.themeToggle.addEventListener('click', this.toggleTheme);
    }
    
    // Navigation items
    this.elements.navItems.forEach(item => {
      item.addEventListener('click', this.handleNavClick);
    });
    
    // Accordion buttons
    this.elements.accordionButtons.forEach(button => {
      button.addEventListener('click', this.handleAccordionClick);
    });
    
    // Modal close buttons
    this.elements.modalCloseButtons.forEach(button => {
      button.addEventListener('click', this.handleModalClose);
    });
    
    // Modal overlay clicks
    this.elements.modalOverlays.forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay.id);
        }
      });
    });
    
    // Window resize
    window.addEventListener('resize', this.handleResize);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
      
      // Toggle sidebar with Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        this.toggleSidebar();
      }
    });
  }
  
  /**
   * Initialize components
   */
  initializeComponents() {
    this.initializeAccordions();
    this.initializeWidgets();
    this.setupMobileDetection();
  }
  
  /**
   * Initialize accordion functionality
   */
  initializeAccordions() {
    this.elements.accordionButtons.forEach(button => {
      const accordionId = button.id;
      const submenu = document.getElementById(accordionId.replace('accordion-', '') + '-submenu');
      
      if (submenu) {
        // Set initial state
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        this.state.accordions.set(accordionId, isExpanded);
        this.updateAccordionState(button, submenu, isExpanded, false);
      }
    });
  }
  
  /**
   * Initialize widgets
   */
  initializeWidgets() {
    const widgets = document.querySelectorAll('.widget[data-widget-id]');
    widgets.forEach(widget => {
      const widgetId = widget.dataset.widgetId;
      const widgetType = widget.dataset.widgetType || 'default';
      
      this.widgets.set(widgetId, {
        element: widget,
        type: widgetType,
        initialized: false
      });
      
      // Initialize specific widget types
      if (widgetType === 'chart') {
        this.initializeChart(widget);
      }
    });
  }
  
  /**
   * Initialize chart widget
   */
  initializeChart(widget) {
    const canvas = widget.querySelector('.chart-canvas');
    if (canvas && typeof Chart !== 'undefined') {
      const chartId = canvas.id;
      const chartConfig = this.getChartConfig(chartId);
      
      if (chartConfig) {
        try {
          const chart = new Chart(canvas.getContext('2d'), chartConfig);
          this.charts.set(chartId, chart);
          
          const widgetData = this.widgets.get(widget.dataset.widgetId);
          if (widgetData) {
            widgetData.initialized = true;
            widgetData.chart = chart;
          }
        } catch (error) {
          console.error(`Error initializing chart ${chartId}:`, error);
        }
      }
    }
  }
  
  /**
   * Get chart configuration (override this method for custom charts)
   */
  getChartConfig(chartId) {
    // Default chart configuration
    return {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
  }
  
  /**
   * Setup mobile detection
   */
  setupMobileDetection() {
    this.updateMobileState();
    
    // Close sidebar on mobile when clicking nav items
    if (this.isMobile()) {
      this.elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
          if (this.state.sidebarOpen) {
            this.toggleSidebar();
          }
        });
      });
    }
  }
  
  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;
    this.updateSidebarState();
    this.persistState();
  }
  
  /**
   * Update sidebar state
   */
  updateSidebarState(animate = true) {
    const { sidebar, sidebarToggle } = this.elements;
    
    if (!sidebar) return;
    
    // Update sidebar classes
    if (this.state.sidebarOpen) {
      sidebar.classList.remove('collapsed');
      sidebar.classList.add('open');
    } else {
      sidebar.classList.add('collapsed');
      sidebar.classList.remove('open');
    }
    
    // Update toggle button icons
    if (sidebarToggle) {
      const closeIcon = sidebarToggle.querySelector('.sidebar-icon-close');
      const openIcon = sidebarToggle.querySelector('.sidebar-icon-open');
      
      if (closeIcon && openIcon) {
        if (this.state.sidebarOpen) {
          closeIcon.classList.remove('hidden');
          openIcon.classList.add('hidden');
        } else {
          closeIcon.classList.add('hidden');
          openIcon.classList.remove('hidden');
        }
      }
    }
    
    // Update ARIA attributes
    if (sidebarToggle) {
      sidebarToggle.setAttribute('aria-expanded', this.state.sidebarOpen.toString());
    }
    
    // Trigger resize event for charts
    setTimeout(() => {
      this.resizeCharts();
    }, this.config.animations ? 300 : 0);
  }
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    const themes = ['default', 'dark', 'industrial', 'medical', 'security'];
    const currentIndex = themes.indexOf(this.state.currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    this.setTheme(nextTheme);
  }
  
  /**
   * Set theme
   */
  setTheme(themeName) {
    this.state.currentTheme = themeName;
    this.applyTheme();
    this.persistState();
    
    // Emit theme change event
    this.emit('themeChanged', { theme: themeName });
  }
  
  /**
   * Apply theme
   */
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.state.currentTheme);
    
    // Update theme toggle icons
    const themeToggle = this.elements.themeToggle;
    if (themeToggle) {
      const lightIcon = themeToggle.querySelector('.theme-icon-light');
      const darkIcon = themeToggle.querySelector('.theme-icon-dark');
      
      if (lightIcon && darkIcon) {
        if (this.state.currentTheme === 'dark') {
          lightIcon.classList.add('hidden');
          darkIcon.classList.remove('hidden');
        } else {
          lightIcon.classList.remove('hidden');
          darkIcon.classList.add('hidden');
        }
      }
    }
  }
  
  /**
   * Handle navigation click
   */
  handleNavClick(event) {
    const navItem = event.currentTarget;
    const pageId = navItem.dataset.pageId;
    
    if (!pageId) return;
    
    // Update active state
    this.setActiveNavItem(pageId);
    
    // Emit navigation event
    this.emit('navigate', { pageId, element: navItem });
  }
  
  /**
   * Set active navigation item
   */
  setActiveNavItem(pageId) {
    // Remove active class from all nav items
    this.elements.navItems.forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to selected item
    const activeItem = document.querySelector(`[data-page-id="${pageId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
      this.state.activeNavItem = pageId;
    }
    
    this.persistState();
  }
  
  /**
   * Handle accordion click
   */
  handleAccordionClick(event) {
    const button = event.currentTarget;
    const accordionId = button.id;
    const submenuId = accordionId.replace('accordion-', '') + '-submenu';
    const submenu = document.getElementById(submenuId);
    
    if (!submenu) return;
    
    const isExpanded = !this.state.accordions.get(accordionId);
    this.state.accordions.set(accordionId, isExpanded);
    
    this.updateAccordionState(button, submenu, isExpanded);
    this.persistState();
  }
  
  /**
   * Update accordion state
   */
  updateAccordionState(button, submenu, isExpanded, animate = true) {
    // Update button attributes
    button.setAttribute('aria-expanded', isExpanded.toString());
    button.setAttribute('data-state', isExpanded ? 'open' : 'closed');
    
    // Update arrow icon
    const arrow = button.querySelector('.accordion-arrow');
    if (arrow) {
      if (isExpanded) {
        arrow.classList.add('expanded');
      } else {
        arrow.classList.remove('expanded');
      }
    }
    
    // Update submenu
    if (isExpanded) {
      submenu.style.maxHeight = submenu.scrollHeight + 'px';
    } else {
      submenu.style.maxHeight = '0';
    }
  }
  
  /**
   * Open modal
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      this.state.modals.add(modalId);
      
      // Focus first focusable element
      const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) {
        focusable.focus();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      this.emit('modalOpened', { modalId });
    }
  }
  
  /**
   * Close modal
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      this.state.modals.delete(modalId);
      
      // Restore body scroll if no modals are open
      if (this.state.modals.size === 0) {
        document.body.style.overflow = '';
      }
      
      this.emit('modalClosed', { modalId });
    }
  }
  
  /**
   * Close all modals
   */
  closeAllModals() {
    Array.from(this.state.modals).forEach(modalId => {
      this.closeModal(modalId);
    });
  }
  
  /**
   * Handle modal close button click
   */
  handleModalClose(event) {
    const modal = event.currentTarget.closest('.modal-overlay');
    if (modal) {
      this.closeModal(modal.id);
    }
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    this.updateMobileState();
    this.resizeCharts();
  }
  
  /**
   * Update mobile state
   */
  updateMobileState() {
    const wasMobile = this.state.isMobile;
    this.state.isMobile = this.isMobile();
    
    // Handle mobile/desktop transition
    if (wasMobile !== this.state.isMobile) {
      if (this.state.isMobile) {
        this.state.sidebarOpen = false;
      } else {
        this.state.sidebarOpen = this.config.sidebarOpen;
      }
      this.updateSidebarState();
    }
  }
  
  /**
   * Check if current viewport is mobile
   */
  isMobile() {
    return window.innerWidth < 768;
  }
  
  /**
   * Resize all charts
   */
  resizeCharts() {
    this.charts.forEach(chart => {
      try {
        chart.resize();
      } catch (error) {
        console.warn('Error resizing chart:', error);
      }
    });
  }
  
  /**
   * Load persisted state
   */
  loadPersistedState() {
    if (!this.config.persistState) return;
    
    try {
      const saved = localStorage.getItem('dashboard-state');
      if (saved) {
        const state = JSON.parse(saved);
        
        // Restore theme
        if (state.currentTheme) {
          this.state.currentTheme = state.currentTheme;
        }
        
        // Restore sidebar state (only on desktop)
        if (state.sidebarOpen !== undefined && !this.isMobile()) {
          this.state.sidebarOpen = state.sidebarOpen;
        }
        
        // Restore active nav item
        if (state.activeNavItem) {
          setTimeout(() => {
            this.setActiveNavItem(state.activeNavItem);
          }, 0);
        }
        
        // Restore accordion states
        if (state.accordions) {
          Object.entries(state.accordions).forEach(([id, expanded]) => {
            this.state.accordions.set(id, expanded);
          });
        }
      }
    } catch (error) {
      console.warn('Error loading persisted state:', error);
    }
  }
  
  /**
   * Persist current state
   */
  persistState() {
    if (!this.config.persistState) return;
    
    try {
      const state = {
        currentTheme: this.state.currentTheme,
        sidebarOpen: this.state.sidebarOpen,
        activeNavItem: this.state.activeNavItem,
        accordions: Object.fromEntries(this.state.accordions)
      };
      
      localStorage.setItem('dashboard-state', JSON.stringify(state));
    } catch (error) {
      console.warn('Error persisting state:', error);
    }
  }
  
  /**
   * Event emitter
   */
  emit(eventName, data = {}) {
    const event = new CustomEvent(`dashboard:${eventName}`, {
      detail: data
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Add event listener
   */
  on(eventName, callback) {
    document.addEventListener(`dashboard:${eventName}`, callback);
  }
  
  /**
   * Remove event listener
   */
  off(eventName, callback) {
    document.removeEventListener(`dashboard:${eventName}`, callback);
  }
  
  /**
   * Update widget data
   */
  updateWidget(widgetId, data) {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      if (widget.type === 'chart' && widget.chart) {
        this.updateChart(widget.chart, data);
      } else {
        this.updateGenericWidget(widget.element, data);
      }
      
      this.emit('widgetUpdated', { widgetId, data });
    }
  }
  
  /**
   * Update chart data
   */
  updateChart(chart, data) {
    if (data.labels) {
      chart.data.labels = data.labels;
    }
    
    if (data.datasets) {
      chart.data.datasets = data.datasets;
    }
    
    chart.update();
  }
  
  /**
   * Update generic widget
   */
  updateGenericWidget(element, data) {
    Object.entries(data).forEach(([key, value]) => {
      const target = element.querySelector(`[data-field="${key}"]`);
      if (target) {
        if (typeof value === 'object') {
          Object.assign(target.style, value);
        } else {
          target.textContent = value;
        }
      }
    });
  }
  
  /**
   * Destroy dashboard
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    
    // Destroy charts
    this.charts.forEach(chart => {
      chart.destroy();
    });
    
    // Clear state
    this.state.modals.clear();
    this.state.accordions.clear();
    this.charts.clear();
    this.widgets.clear();
    
    console.log('Dashboard Controller destroyed');
  }
}

// Utility functions for dashboard creation
class DashboardBuilder {
  static createNavItem(config) {
    const { id, label, icon, href = '#', active = false, children = [] } = config;
    
    let navHtml = `
      <div class="nav-item ${active ? 'active' : ''}" 
           data-page-id="${id}" 
           title="${label}">
        <div class="nav-icon">${icon}</div>
        <span class="nav-label">${label}</span>`;
    
    if (children.length > 0) {
      navHtml += `
        <svg class="accordion-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 9L12 15L18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="submenu accordion-content" style="max-height: 0;">
        <ul class="submenu-list">
          ${children.map(child => `
            <li>
              <div class="nav-item" data-page-id="${child.id}" title="${child.label}">
                <div class="nav-icon">${child.icon}</div>
                <span class="nav-label">${child.label}</span>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>`;
    } else {
      navHtml += '</div>';
    }
    
    return navHtml;
  }
  
  static createKPIWidget(config) {
    const { 
      title, 
      value, 
      unit = '', 
      label, 
      icon, 
      iconColor = 'blue',
      trend = null 
    } = config;
    
    return `
      <div class="widget" data-widget-type="kpi">
        <div class="widget-header">
          <h3 class="widget-title">${title}</h3>
        </div>
        <div class="widget-content">
          <div class="kpi-widget">
            <div class="kpi-icon-container">
              <div class="kpi-icon ${iconColor}">
                ${icon}
              </div>
            </div>
            <div class="kpi-content">
              <p class="kpi-label">${label}</p>
              <p class="kpi-value">
                ${value}
                <span class="kpi-unit">${unit}</span>
              </p>
              ${trend ? `<div class="kpi-trend">${trend}</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  static createChartWidget(config) {
    const { id, title, type = 'line', height = '300px' } = config;
    
    return `
      <div class="widget" data-widget-type="chart" data-widget-id="${id}">
        <div class="widget-header">
          <h3 class="widget-title">${title}</h3>
        </div>
        <div class="widget-content">
          <div class="chart-container" style="height: ${height};">
            <canvas id="chart-${id}" class="chart-canvas"></canvas>
          </div>
        </div>
      </div>
    `;
  }
}

// Theme configurations
const DashboardThemes = {
  default: {
    name: 'Default',
    primary: '#0075ff',
    primaryLight: '#e5f1ff',
    primaryDark: '#0056cc'
  },
  dark: {
    name: 'Dark',
    primary: '#0075ff',
    primaryLight: '#1a365d',
    primaryDark: '#4299e1'
  },
  industrial: {
    name: 'Industrial',
    primary: '#26c6da',
    primaryLight: '#b2ebf2',
    primaryDark: '#00acc1'
  },
  medical: {
    name: 'Medical',
    primary: '#4caf50',
    primaryLight: '#e8f5e8',
    primaryDark: '#388e3c'
  },
  security: {
    name: 'Security',
    primary: '#f44336',
    primaryLight: '#ffebee',
    primaryDark: '#d32f2f'
  }
};

// Export for use in other scripts
window.DashboardController = DashboardController;
window.DashboardBuilder = DashboardBuilder;
window.DashboardThemes = DashboardThemes;