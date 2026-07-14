// Client-side Hash Router for Single Page Application

class AppRouter {
  constructor(appViewContainerId) {
    this.container = document.getElementById(appViewContainerId);
    this.routes = {};
    this.activeRoute = null;

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouting());
  }

  // Register route with layout view class
  register(routePath, ViewClass) {
    this.routes[routePath] = ViewClass;
  }

  // Route resolver
  handleRouting() {
    let hash = window.location.hash || '#/home';
    
    // Normalize hash paths (e.g. "#/study" -> "study")
    let route = hash.replace(/^#\//, '');
    
    // Handle parameters if any (e.g., "study/ch-functions")
    let params = null;
    if (route.includes('/')) {
      const parts = route.split('/');
      route = parts[0];
      params = parts.slice(1).join('/');
    }

    // Default route fallback
    if (!this.routes[route]) {
      window.location.hash = '#/home';
      return;
    }

    this.activeRoute = route;
    
    // Instantiate and render view
    const ViewClass = this.routes[route];
    const viewInstance = new ViewClass(params);
    
    // Clear and Append
    this.container.innerHTML = '';
    const element = viewInstance.render();
    if (element instanceof HTMLElement) {
      this.container.appendChild(element);
    } else {
      this.container.innerHTML = element;
    }

    // Post-render lifecycle hooks (initializers for charts, code editors, icons)
    if (viewInstance.afterRender && typeof viewInstance.afterRender === 'function') {
      viewInstance.afterRender();
    }

    // Sync Navigation Highlighting
    this.syncNavbarHighlight(route);

    // Auto-scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Initialize Lucide Icons globally for the new page DOM
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  syncNavbarHighlight(activeRoute) {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      const targetView = item.getAttribute('data-view');
      if (targetView === activeRoute) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Handle mobile sidebar collapse auto-close on navigate
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  }

  // Manually navigate
  navigateTo(routePath) {
    window.location.hash = `#/${routePath}`;
  }
}

export default AppRouter;
