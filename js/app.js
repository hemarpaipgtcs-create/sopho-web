// Main Application Boot Controller

import AppRouter from './router.js';
import { store } from './store.js';
import { initGlobalSearch } from './search.js';

// Import Views
import HomeView from './views/HomeView.js';
import StudyView from './views/StudyView.js';
import CodingView from './views/CodingView.js';
import QuestionBankView from './views/QuestionBankView.js';
import QuizView from './views/QuizView.js';
import LinksView from './views/LinksView.js';
import ContactView from './views/ContactView.js';
import AboutView from './views/AboutView.js';
import AdminView from './views/AdminView.js';

class AppController {
  constructor() {
    this.router = null;
    this.init();
  }

  init() {
    // 1. Initialize Routing
    this.router = new AppRouter('app-view');
    this.router.register('home', HomeView);
    this.router.register('study', StudyView);
    this.router.register('coding', CodingView);
    this.router.register('questions', QuestionBankView);
    this.router.register('quiz', QuizView);
    this.router.register('links', LinksView);
    this.router.register('contact', ContactView);
    this.router.register('about', AboutView);
    this.router.register('admin', AdminView);

    // Initial route load
    this.router.handleRouting();

    // 2. Initialize Layout Bindings & Events
    this.initTheme();
    this.initSidebarMobileToggle();
    this.initNotificationDropdown();
    this.initAuthModal();
    this.initDoubtChatbot();
    
    // 3. Initialize Global Search
    initGlobalSearch();

    // 4. Sync profile layout on start
    this.syncProfileLayout(store.getUser());
    store.subscribe('userChanged', (user) => this.syncProfileLayout(user));

    // Render notifications lists on start
    this.renderNotificationsList(store.getNotifications());
    store.subscribe('notificationsChanged', (notifs) => this.renderNotificationsList(notifs));
  }

  // --- Theme Toggle Controls ---
  initTheme() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const currentTheme = store.getTheme();
    
    // Set theme on html node
    document.documentElement.setAttribute('data-theme', currentTheme);

    toggleBtn.addEventListener('click', () => {
      const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      store.setTheme(nextTheme);
    });
  }

  // --- Mobile Sidebar Toggle ---
  initSidebarMobileToggle() {
    const mobileBtn = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('app-sidebar');

    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
      });

      // Close sidebar when clicking outside on mobile
      document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
        }
      });
    }
  }

  // --- Notification Badge & Tray Dropdown ---
  initNotificationDropdown() {
    const notifBtn = document.getElementById('notification-btn');
    const notifDropdown = document.getElementById('notification-dropdown');
    const clearBtn = document.getElementById('mark-all-read');

    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        notifDropdown.classList.add('hidden');
      });

      notifDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        store.markAllNotificationsRead();
        // Clear counts badge
        const badge = document.getElementById('notif-badge-count');
        if (badge) badge.classList.add('hidden');
      });
    }
  }

  renderNotificationsList(notifs) {
    const countBadge = document.getElementById('notif-badge-count');
    const listElement = document.getElementById('notification-list');
    
    if (!listElement) return;

    const unreadCount = notifs.filter(n => n.unread).length;
    if (unreadCount > 0 && countBadge) {
      countBadge.textContent = unreadCount;
      countBadge.classList.remove('hidden');
    } else if (countBadge) {
      countBadge.classList.add('hidden');
    }

    if (notifs.length === 0) {
      listElement.innerHTML = `<li style="padding:16px; text-align:center; color:var(--text-muted); font-size:12px;">No new alerts.</li>`;
      return;
    }

    let html = '';
    notifs.forEach(n => {
      const unreadClass = n.unread ? 'unread' : '';
      html += `
        <li class="notification-item ${unreadClass}">
          <span class="bullet"></span>
          <div class="notif-content">
            <p>${n.content}</p>
            <span class="time">${n.time}</span>
          </div>
        </li>
      `;
    });
    listElement.innerHTML = html;
  }

  // --- Authentication and Profiles Modal ---
  initAuthModal() {
    const profileTrigger = document.getElementById('profile-trigger');
    const modal = document.getElementById('global-modal');
    
    if (profileTrigger && modal) {
      profileTrigger.addEventListener('click', () => {
        const user = store.getUser();
        if (user.loggedIn) {
          if(confirm("Do you want to log out of the portal?")) {
            store.logout();
            this.router.navigateTo('home');
          }
        } else {
          this.openLoginModal();
        }
      });
    }
  }

  openLoginModal() {
    const modal = document.getElementById('global-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = modal.querySelector('#close-modal-btn');

    modalTitle.innerHTML = `<i data-lucide="user-check" class="text-accent" style="vertical-align:text-bottom;"></i> Student / Teacher Access`;
    modalBody.innerHTML = `
      <form id="auth-login-form" class="auth-form-container" onsubmit="return false;">
        <div style="background-color: var(--bg-tertiary); padding: 12px; border-radius:4px; font-size:11px; color:var(--text-secondary); line-height:1.4;">
          <strong>Roles Demonstration Guidelines:</strong><br>
          • Type standard student name to save quiz histories.<br>
          • Enter <strong>teacher_cbse</strong> or <strong>admin</strong> to unhide teacher-level databases!
        </div>
        <div class="form-group">
          <label for="auth-username">Username or Full Name *</label>
          <input type="text" id="auth-username" required placeholder="e.g. Rohan Das">
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;">Authorize Access</button>
      </form>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    // Modal close controls
    const closeModal = () => {
      modal.classList.add('hidden');
      modalBody.innerHTML = '';
    };

    closeBtn.onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };

    // Bind form submit
    const loginForm = document.getElementById('auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', () => {
        const nameVal = document.getElementById('auth-username').value.trim();
        if (nameVal) {
          store.login(nameVal);
          closeModal();
        }
      });
    }
  }

  syncProfileLayout(user) {
    const avatarText = document.getElementById('user-avatar-text');
    const displayName = document.getElementById('user-display-name');
    const displayRole = document.getElementById('user-display-role');
    const authIcon = document.getElementById('auth-action-icon');
    const xpDisplay = document.getElementById('user-xp-display');

    // Admin nav fields
    const adminLabels = document.querySelectorAll('.admin-only-label');
    const adminNavs = document.querySelectorAll('.admin-nav-item');

    if (user.loggedIn) {
      // Initials
      const initials = user.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      avatarText.textContent = initials;
      displayName.textContent = user.username;
      displayRole.textContent = user.role;
      authIcon.setAttribute('data-lucide', 'log-out');
      authIcon.title = 'Log Out';
      
      // Dynamic Role Visibility for Admin View
      if (user.role === 'Teacher') {
        adminLabels.forEach(el => el.classList.remove('hidden'));
        adminNavs.forEach(el => el.classList.remove('hidden'));
      } else {
        adminLabels.forEach(el => el.classList.add('hidden'));
        adminNavs.forEach(el => el.classList.add('hidden'));
      }
    } else {
      avatarText.textContent = 'GU';
      displayName.textContent = 'Guest User';
      displayRole.textContent = 'Student';
      authIcon.setAttribute('data-lucide', 'log-in');
      authIcon.title = 'Log In';

      adminLabels.forEach(el => el.classList.add('hidden'));
      adminNavs.forEach(el => el.classList.add('hidden'));
    }

    if (xpDisplay) {
      xpDisplay.textContent = `${user.xp} XP`;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- Float Ask a Doubt Chatbot ---
  initDoubtChatbot() {
    const trigger = document.getElementById('doubt-bot-trigger');
    const botCard = document.getElementById('doubt-bot-card');
    const closeBtn = document.getElementById('close-bot-btn');
    const inputField = document.getElementById('doubt-bot-input-field');
    const sendBtn = document.getElementById('send-doubt-btn');

    if (!trigger || !botCard) return;

    trigger.addEventListener('click', () => {
      botCard.classList.toggle('hidden');
      if (!botCard.classList.contains('hidden') && inputField) {
        inputField.focus();
      }
    });

    closeBtn.addEventListener('click', () => {
      botCard.classList.add('hidden');
    });

    // Bind sender actions
    const triggerSend = () => {
      const query = inputField.value.trim();
      if (query) {
        this.handleChatbotMessage(query);
        inputField.value = '';
      }
    };

    sendBtn.addEventListener('click', triggerSend);
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerSend();
    });

    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent;
        this.handleChatbotMessage(text);
      });
    });
  }

  handleChatbotMessage(userQuery) {
    const msgBox = document.getElementById('doubt-bot-messages');
    if (!msgBox) return;

    // 1. Append User Message
    const userMsgNode = document.createElement('div');
    userMsgNode.className = 'message user-message';
    userMsgNode.textContent = userQuery;
    msgBox.appendChild(userMsgNode);
    
    msgBox.scrollTop = msgBox.scrollHeight;

    // 2. Simulated typing indicators
    const typingNode = document.createElement('div');
    typingNode.className = 'message bot-message typing-indicator';
    typingNode.textContent = 'Analyzing doubt...';
    msgBox.appendChild(typingNode);
    msgBox.scrollTop = msgBox.scrollHeight;

    // 3. Process replies based on keywords
    setTimeout(() => {
      msgBox.removeChild(typingNode);

      const botReplyNode = document.createElement('div');
      botReplyNode.className = 'message bot-message';

      const normQuery = userQuery.toLowerCase();
      let replyHtml = '';

      if (normQuery.includes('recursion')) {
        replyHtml = `
          <strong>Recursion definition:</strong><br>
          Recursion is a programming technique where a function calls itself directly or indirectly to solve smaller sub-problems.
          <br><br>
          <strong>Requirements:</strong>
          1. Base Case: stops execution.
          2. Recursive Case: calls itself.
          <br><br>
          <strong>Code Example:</strong>
          <pre style="background:var(--code-bg); padding:6px; font-family:monospace; border-radius:4px; font-size:11px; margin-top:4px;">def fact(n):
    if n == 0 or n == 1:
        return 1  # Base Case
    return n * fact(n-1)  # Recursive</pre>
        `;
      } else if (normQuery.includes('list') && normQuery.includes('tuple')) {
        replyHtml = `
          <strong>List vs Tuple (CBSE Favorite 2-marker):</strong>
          <table style="width:100%; border-collapse:collapse; margin-top:6px; font-size:11px; text-align:left;">
            <tr>
              <th style="border-bottom:1px solid var(--border-color); padding:4px;">Feature</th>
              <th style="border-bottom:1px solid var(--border-color); padding:4px;">List</th>
              <th style="border-bottom:1px solid var(--border-color); padding:4px;">Tuple</th>
            </tr>
            <tr>
              <td style="padding:4px;">Mutability</td>
              <td style="padding:4px; color:var(--success);">Mutable</td>
              <td style="padding:4px; color:var(--danger);">Immutable</td>
            </tr>
            <tr>
              <td style="padding:4px;">Syntax</td>
              <td style="padding:4px;"><code>[1, 2]</code></td>
              <td style="padding:4px;"><code>(1, 2)</code></td>
            </tr>
          </table>
        `;
      } else if (normQuery.includes('stack') || normQuery.includes('push')) {
        replyHtml = `
          <strong>Python Stack Push (LIFO):</strong><br>
          Stacks add items using the list's <code>append()</code> method.
          <pre style="background:var(--code-bg); padding:6px; font-family:monospace; border-radius:4px; font-size:11px; margin-top:4px;">stack = []
def push(stk, val):
    stk.append(val)
    # LIFO stack behavior</pre>
        `;
      } else if (normQuery.includes('primary key') || normQuery.includes('key')) {
        replyHtml = `
          <strong>MySQL Primary Key constraint:</strong><br>
          A Primary Key is a database column constraint which uniquely identifies each tuple row in a table.
          <br><br>
          <strong>Rules:</strong>
          1. Cannot contain Null values.
          2. Must hold unique values.
          3. Only 1 Primary Key per table.
        `;
      } else {
        replyHtml = `
          I'm specialized in CBSE Class XI/XII Computer Science topics. Try asking about:
          <ul style="padding-left:16px; margin: 4px 0;">
            <li>"What is Recursion?"</li>
            <li>"Write Stack Push function"</li>
            <li>"Difference between list and tuple"</li>
            <li>"What is a primary key?"</li>
          </ul>
          Alternatively, submit a support ticket in the <a href="#/contact" style="color:var(--accent); text-decoration:underline;">Contact Screen</a>!
        `;
      }

      botReplyNode.innerHTML = replyHtml;
      msgBox.appendChild(botReplyNode);
      msgBox.scrollTop = msgBox.scrollHeight;
    }, 600);
  }
}

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
