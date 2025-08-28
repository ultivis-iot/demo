# Dashboard Component System - Usage Examples

## 🚀 Quick Start

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="./components/dashboard-components.css">
</head>
<body>
  <script src="./components/dashboard-controller.js"></script>
  <script src="./components/dashboard-generator.js"></script>
</body>
</html>
```

### Generate a Dashboard

```javascript
// Initialize generator
const generator = new DashboardGenerator();

// Create recycling dashboard
const dashboard = generator.createDashboard(DashboardPresets.recyclingDashboard());

// Write to file or insert into DOM
document.body.innerHTML = dashboard.html;

// Initialize controller
const controller = new DashboardController(dashboard.config);
controller.init();
```

## 📋 Configuration Examples

### Custom Recycling Dashboard

```javascript
const recyclingConfig = {
  title: "울산 중구 스마트 재활용 분리수거 대시보드",
  theme: "recycling",
  pageTitle: "스마트 재활용 분리수거 통합관제",
  pageDescription: "울산광역시 중구 스마트 재활용 분리수거 시스템 통합 관리",
  
  logo: {
    src: "../assets/logo-nav.png",
    alt: "울산 중구 로고", 
    href: "../index.html"
  },
  
  user: {
    name: "관제 매니저"
  },
  
  navigation: [
    {
      id: "dashboard",
      label: "대시보드", 
      icon: "dashboard",
      active: true
    }
  ],
  
  widgets: [
    {
      type: "kpi",
      title: "수거기 현황",
      size: "large",
      content: {
        kpis: [
          {
            label: "총 수거기",
            value: "43",
            icon: "home",
            iconColor: "blue"
          },
          {
            label: "정상 작동", 
            value: "38",
            icon: "chart",
            iconColor: "green"
          },
          {
            label: "점검 필요",
            value: "4", 
            icon: "settings",
            iconColor: "orange"
          },
          {
            label: "오류",
            value: "1",
            icon: "report", 
            iconColor: "red"
          }
        ]
      }
    },
    {
      type: "chart",
      title: "오늘의 수거량 (kg)",
      size: "medium",
      content: {
        height: "300px"
      }
    },
    {
      type: "map",
      title: "수거기 위치 및 상태",
      size: "large",
      content: {
        height: "420px"
      }
    }
  ],
  
  pageActions: [
    {
      label: "보고서 생성",
      type: "primary",
      icon: "report",
      id: "open-report-menu-btn"
    }
  ],
  
  modals: [
    {
      id: "report-modal",
      title: "운영 보고서",
      content: "<div id='report-modal-body'></div>",
      actions: [
        {
          label: "다운로드",
          type: "primary",
          onclick: "window.print()"
        },
        {
          label: "닫기",
          type: "secondary", 
          onclick: "dashboard.closeModal('report-modal')"
        }
      ]
    }
  ]
};

const dashboard = generator.createDashboard(recyclingConfig);
```

### School Dashboard Configuration

```javascript
const schoolConfig = {
  title: "Smart School Integrated Dashboard",
  theme: "school",
  
  navigation: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "dashboard", 
      active: true
    },
    {
      id: "environment", 
      label: "Environment",
      icon: "chart"
    },
    {
      id: "safety",
      label: "Safety Management",
      icon: "settings",
      children: [
        { id: "fire-safety", label: "Fire Detection", icon: "report" },
        { id: "emergency-alert", label: "Emergency Alert", icon: "report" },
        { id: "danger-zone", label: "Danger Zone", icon: "report" }
      ]
    },
    {
      id: "access-control",
      label: "Access Control", 
      icon: "users"
    },
    {
      id: "attendance",
      label: "Smart Attendance",
      icon: "users"
    }
  ],
  
  widgets: [
    {
      type: "kpi",
      title: "School Status",
      size: "large",
      content: {
        kpis: [
          { label: "Students Present", value: "1,250", iconColor: "green" },
          { label: "Staff On-Site", value: "89", iconColor: "blue" },
          { label: "Classroom Temp", value: "22°C", iconColor: "orange" },
          { label: "Air Quality", value: "Good", iconColor: "green" }
        ]
      }
    },
    {
      type: "chart", 
      title: "Attendance Trends",
      size: "medium",
      content: { height: "300px" }
    },
    {
      type: "table",
      title: "Recent Alerts", 
      size: "medium",
      content: {
        headers: ["Time", "Type", "Location", "Status"],
        rows: [
          ["09:15", "Fire Alarm", "Building A", "Resolved"],
          ["08:45", "Access Denied", "Main Gate", "Investigating"],
          ["08:30", "Temperature Alert", "Lab 201", "Resolved"]
        ]
      }
    }
  ]
};
```

### Industrial Dashboard Configuration

```javascript
const industrialConfig = {
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
  ],
  
  widgets: [
    {
      type: "kpi",
      title: "펌프카 현황",
      size: "large",
      content: {
        kpis: [
          { label: "가동 대수", value: "12", iconColor: "blue" },
          { label: "정상 작동", value: "11", iconColor: "green" },
          { label: "점검 중", value: "1", iconColor: "orange" },
          { label: "평균 효율", value: "94%", iconColor: "blue" }
        ]
      }
    },
    {
      type: "chart",
      title: "실시간 붐 압력",
      size: "medium", 
      content: { height: "320px" }
    },
    {
      type: "custom",
      title: "위치 추적",
      size: "large",
      content: {
        html: '<div id="truck-map" style="height: 380px; background: #f5f5f5; border-radius: 8px;"></div>'
      }
    }
  ]
};
```

### Security Dashboard Configuration

```javascript
const securityConfig = {
  title: "GASTRON 5대 가스 실시간 통합 관제",
  theme: "security",
  
  widgets: [
    {
      type: "kpi",
      title: "가스 감지 현황",
      size: "xl",
      content: {
        kpis: [
          { label: "CO", value: "0.2", unit: "ppm", iconColor: "green" },
          { label: "H2S", value: "1.5", unit: "ppm", iconColor: "orange" },
          { label: "CH4", value: "0.8", unit: "ppm", iconColor: "blue" },
          { label: "NH3", value: "2.1", unit: "ppm", iconColor: "red" },
          { label: "SO2", value: "0.5", unit: "ppm", iconColor: "green" }
        ]
      }
    },
    {
      type: "custom",
      title: "가스 분포도",
      size: "large",
      content: {
        html: '<div id="gas-blueprint" style="height: 400px;"></div>'
      }
    },
    {
      type: "table",
      title: "위험 알림 이력",
      size: "medium",
      content: {
        headers: ["시간", "가스종류", "농도", "위치", "상태"],
        rows: [
          ["14:23", "H2S", "2.1 ppm", "Zone A", "경고"],
          ["13:45", "CO", "0.8 ppm", "Zone B", "정상"],
          ["12:30", "NH3", "1.9 ppm", "Zone C", "주의"]
        ]
      }
    }
  ],
  
  pageActions: [
    {
      label: "비상대응",
      type: "primary",
      onclick: "handleEmergency()"
    },
    {
      label: "보고서",
      type: "secondary",
      onclick: "generateReport()"
    }
  ]
};
```

## 🎨 Custom Theme Creation

### Create New Theme

```javascript
// Register custom theme
generator.registerTheme('corporate', {
  name: 'Corporate Blue',
  colors: {
    primary: '#1e40af',
    primaryLight: '#eff6ff',
    primaryDark: '#1e3a8a',
    accent: '#f59e0b'
  }
});

// Use custom theme
const config = {
  title: "Corporate Dashboard",
  theme: "corporate",
  // ... rest of config
};
```

### Advanced Theme with Custom CSS

```javascript
generator.registerTheme('neon', {
  name: 'Neon Dark',
  colors: {
    primary: '#00ff88',
    primaryLight: '#001a0f',
    primaryDark: '#00cc6a',
    accent: '#ff0080'
  },
  customCSS: `
    [data-theme="neon"] {
      --bg-primary: #0a0a0a;
      --bg-secondary: #111111;
      --text-primary: #00ff88;
      --border-color: #333333;
    }
    
    [data-theme="neon"] .widget {
      border: 1px solid #00ff88;
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
    }
  `
});
```

## 🛠 Advanced Customization

### Custom Widget Types

```javascript
// Extend DashboardGenerator for custom widgets
class CustomDashboardGenerator extends DashboardGenerator {
  generateWidget(widget) {
    if (widget.type === 'temperature-gauge') {
      return this.generateTemperatureGauge(widget);
    }
    return super.generateWidget(widget);
  }
  
  generateTemperatureGauge(widget) {
    return `
      <div class="widget" data-widget-type="temperature-gauge">
        <div class="widget-header">
          <h3 class="widget-title">${widget.title}</h3>
        </div>
        <div class="widget-content">
          <div class="temperature-gauge" 
               data-value="${widget.content.value}"
               data-max="${widget.content.max || 100}">
            <canvas id="gauge-${widget.id}"></canvas>
          </div>
        </div>
      </div>
    `;
  }
}
```

### Custom Controller Extensions

```javascript
// Extend controller for custom functionality
class CustomDashboardController extends DashboardController {
  initializeComponents() {
    super.initializeComponents();
    this.initializeTemperatureGauges();
  }
  
  initializeTemperatureGauges() {
    const gauges = document.querySelectorAll('[data-widget-type="temperature-gauge"]');
    gauges.forEach(gauge => {
      // Initialize custom gauge visualization
      this.createTemperatureGauge(gauge);
    });
  }
  
  createTemperatureGauge(element) {
    // Custom gauge implementation
  }
}
```

### Event Handling

```javascript
// Listen to dashboard events
dashboard.on('navigate', (event) => {
  console.log('Navigated to:', event.detail.pageId);
});

dashboard.on('themeChanged', (event) => {
  console.log('Theme changed to:', event.detail.theme);
});

dashboard.on('widgetUpdated', (event) => {
  console.log('Widget updated:', event.detail.widgetId);
});

// Update widgets programmatically
dashboard.updateWidget('widget-1', {
  value: 25,
  status: 'normal'
});
```

## 🎯 Real-world Integration

### With Chart.js

```javascript
// Custom chart configuration
const chartWidget = {
  type: "chart",
  title: "시간대별 수거량",
  size: "large",
  content: {
    height: "350px",
    chartConfig: {
      type: 'line',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
          label: '수거량 (kg)',
          data: [12, 5, 23, 45, 67, 34],
          borderColor: '#26c6da',
          backgroundColor: 'rgba(38, 198, 218, 0.1)',
          fill: true
        }]
      }
    }
  }
};
```

### With Leaflet Maps

```javascript
// Map widget with Leaflet integration
const mapWidget = {
  type: "map",
  title: "수거기 위치 현황", 
  size: "large",
  content: {
    height: "420px",
    mapConfig: {
      center: [35.558, 129.319],
      zoom: 14,
      markers: [
        { lat: 35.560, lng: 129.320, status: "normal", name: "수거기 #1" },
        { lat: 35.555, lng: 129.315, status: "warning", name: "수거기 #2" }
      ]
    }
  }
};
```

### Dynamic Data Updates

```javascript
// Real-time data simulation
setInterval(() => {
  // Update KPI values
  dashboard.updateWidget('kpi-widget', {
    'total-machines': Math.floor(Math.random() * 50),
    'operational': Math.floor(Math.random() * 45)
  });
  
  // Update chart data
  const newData = generateRandomData();
  dashboard.updateWidget('chart-widget', {
    datasets: [{
      data: newData
    }]
  });
}, 5000);
```

## 📱 Responsive Considerations

### Mobile-Optimized Layouts

```javascript
const mobileConfig = {
  title: "Mobile Dashboard",
  layout: {
    grid: "grid-cols-1 md:grid-cols-2 lg:grid-cols-12",
    gap: "gap-4"
  },
  widgets: [
    {
      type: "kpi",
      size: "small", // Will stack on mobile
      // ...
    }
  ]
};
```

### Accessibility Features

```javascript
const accessibleConfig = {
  features: {
    darkMode: true,
    highContrast: true,
    keyboardNavigation: true,
    screenReader: true
  }
};
```

## 🔧 Build and Deploy

### Save Generated Dashboard

```javascript
const dashboard = generator.createDashboard(config);
const files = generator.saveDashboard(dashboard, 'my-dashboard');

// files contains:
// - my-dashboard.html
// - my-dashboard-theme.css  
// - my-dashboard-config.json
```

### Integration with Build Tools

```bash
# Copy component files to your project
cp -r components/ your-project/src/components/

# Include in your build process
# webpack.config.js
module.exports = {
  entry: './src/components/dashboard-controller.js',
  // ...
};
```

이 예제들을 통해 다양한 스타일의 대시보드를 쉽게 만들고 커스터마이징할 수 있습니다!