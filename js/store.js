// Persistent Local Storage Store for Reactivity and Mock Backend

const STORAGE_KEYS = {
  USER: 'cs_portal_user',
  QUERIES: 'cs_portal_queries',
  FAVORITES: 'cs_portal_favorites',
  QUIZ_HISTORY: 'cs_portal_quiz_history',
  NOTIFICATIONS: 'cs_portal_notifications',
  THEME: 'cs_portal_theme'
};

const DEFAULT_QUERIES = [
  {
    id: 'q-101',
    studentName: 'Aravind Nair',
    className: 'XII',
    section: 'A',
    email: 'aravind.nair@gmail.com',
    phone: '9845621456',
    subject: 'Doubt',
    message: 'Can you please explain why index is out of range in this code: list1 = [1, 2, 3]; print(list1[3])? I thought Python indexes start from 1.',
    date: '2026-07-14T08:30:00Z',
    status: 'pending',
    attachment: null
  },
  {
    id: 'q-102',
    studentName: 'Sneha Joseph',
    className: 'XII',
    section: 'B',
    email: 'sneha.j@yahoo.com',
    phone: '',
    subject: 'Request Notes',
    message: 'Is there a simplified cheat sheet for MySQL Joins (Inner, Left, Right)? We have a unit test coming up this Friday.',
    date: '2026-07-13T15:45:00Z',
    status: 'pending',
    attachment: null
  },
  {
    id: 'q-103',
    studentName: 'Rohit Sharma',
    className: 'XI',
    section: 'C',
    email: 'rohit.sharma@outlook.com',
    phone: '8123456789',
    subject: 'Report Error',
    message: 'In Chapter 2 notes (Functions), under parameter passing section, the code snippet for local scope has a typo on line 4.',
    date: '2026-07-12T10:15:00Z',
    status: 'resolved',
    replyMessage: 'Thanks Rohit! I have updated the typo in Chapter 2 notes.',
    dateResolved: '2026-07-12T14:30:00Z',
    attachment: null
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'n-1',
    content: 'New study materials added for <strong>SQL & Databases</strong>.',
    time: 'Just now',
    unread: true
  },
  {
    id: 'n-2',
    content: 'CBSE Sample Papers for 2026 are now available in the Question Bank.',
    time: '2 hours ago',
    unread: true
  }
];

class AppStore {
  constructor() {
    this.listeners = {};
    
    // Initialize State
    this.state = {
      user: this._load(STORAGE_KEYS.USER, {
        username: 'Guest User',
        role: 'Student',
        xp: 120,
        loggedIn: false
      }),
      queries: this._load(STORAGE_KEYS.QUERIES, DEFAULT_QUERIES),
      favorites: this._load(STORAGE_KEYS.FAVORITES, { notes: [], programs: [] }),
      quizHistory: this._load(STORAGE_KEYS.QUIZ_HISTORY, []),
      notifications: this._load(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS),
      theme: this._load(STORAGE_KEYS.THEME, 'dark')
    };
  }

  // LocalStorage Helpers
  _load(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error loading key ${key} from localStorage`, e);
      return defaultValue;
    }
  }

  _save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving key ${key} to localStorage`, e);
    }
  }

  // Pub/Sub System
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  publish(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // State Getters
  getUser() { return this.state.user; }
  getQueries() { return this.state.queries; }
  getFavorites() { return this.state.favorites; }
  getQuizHistory() { return this.state.quizHistory; }
  getNotifications() { return this.state.notifications; }
  getTheme() { return this.state.theme; }

  // Actions
  setTheme(theme) {
    this.state.theme = theme;
    this._save(STORAGE_KEYS.THEME, theme);
    this.publish('themeChanged', theme);
  }

  login(username, role = 'Student') {
    // If username is "teacher_cbse" we can elevate role to Teacher
    const finalRole = (username.toLowerCase() === 'admin' || username.toLowerCase() === 'teacher_cbse') ? 'Teacher' : 'Student';
    this.state.user = {
      username: username || 'Student',
      role: finalRole,
      xp: this.state.user.xp || 120,
      loggedIn: true
    };
    this._save(STORAGE_KEYS.USER, this.state.user);
    this.publish('userChanged', this.state.user);
  }

  logout() {
    this.state.user = {
      username: 'Guest User',
      role: 'Student',
      xp: 0,
      loggedIn: false
    };
    this._save(STORAGE_KEYS.USER, this.state.user);
    this.publish('userChanged', this.state.user);
  }

  addXP(amount) {
    this.state.user.xp += amount;
    this._save(STORAGE_KEYS.USER, this.state.user);
    this.publish('userChanged', this.state.user);
  }

  // Favorites Actions
  toggleFavorite(type, id) {
    const list = this.state.favorites[type] || [];
    const index = list.indexOf(id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
      this.addXP(10); // Reward 10 XP for bookmarking!
    }
    this.state.favorites[type] = list;
    this._save(STORAGE_KEYS.FAVORITES, this.state.favorites);
    this.publish('favoritesChanged', this.state.favorites);
  }

  isFavorite(type, id) {
    return (this.state.favorites[type] || []).includes(id);
  }

  // Student Query Actions
  addQuery(queryData) {
    const newQuery = {
      id: `q-${Date.now()}`,
      studentName: queryData.studentName,
      className: queryData.className,
      section: queryData.section,
      email: queryData.email,
      phone: queryData.phone || '',
      subject: queryData.subject,
      message: queryData.message,
      date: new Date().toISOString(),
      status: 'pending',
      attachment: queryData.attachment || null
    };
    this.state.queries.unshift(newQuery);
    this._save(STORAGE_KEYS.QUERIES, this.state.queries);
    this.publish('queriesChanged', this.state.queries);
    
    // Add dynamic notification for student queries (simulating realtime push)
    this.addNotification(`Your query about "<strong>${queryData.subject}</strong>" was received successfully!`);
    this.addXP(15); // Reward 15 XP for engaging
    return newQuery;
  }

  updateQueryStatus(id, updateObj) {
    this.state.queries = this.state.queries.map(q => {
      if (q.id === id) {
        return { ...q, ...updateObj, dateResolved: new Date().toISOString() };
      }
      return q;
    });
    this._save(STORAGE_KEYS.QUERIES, this.state.queries);
    this.publish('queriesChanged', this.state.queries);
  }

  deleteQuery(id) {
    this.state.queries = this.state.queries.filter(q => q.id !== id);
    this._save(STORAGE_KEYS.QUERIES, this.state.queries);
    this.publish('queriesChanged', this.state.queries);
  }

  // Quiz Score Actions
  saveQuizScore(quizId, quizTitle, score, total, maxTimerVal, timerSpent) {
    const newRecord = {
      id: `history-${Date.now()}`,
      quizId,
      quizTitle,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      timerSpent,
      maxTimerVal,
      date: new Date().toISOString()
    };
    this.state.quizHistory.unshift(newRecord);
    this._save(STORAGE_KEYS.QUIZ_HISTORY, this.state.quizHistory);
    this.publish('quizHistoryChanged', this.state.quizHistory);
    
    // Reward XP proportional to performance
    const earnedXP = score * 20;
    this.addXP(earnedXP);
    
    return newRecord;
  }

  // Notifications Actions
  addNotification(content) {
    const newNotif = {
      id: `n-${Date.now()}`,
      content,
      time: 'Just now',
      unread: true
    };
    this.state.notifications.unshift(newNotif);
    this._save(STORAGE_KEYS.NOTIFICATIONS, this.state.notifications);
    this.publish('notificationsChanged', this.state.notifications);
  }

  clearNotifications() {
    this.state.notifications = [];
    this._save(STORAGE_KEYS.NOTIFICATIONS, []);
    this.publish('notificationsChanged', []);
  }

  markAllNotificationsRead() {
    this.state.notifications = this.state.notifications.map(n => ({ ...n, unread: false }));
    this._save(STORAGE_KEYS.NOTIFICATIONS, this.state.notifications);
    this.publish('notificationsChanged', this.state.notifications);
  }
}

export const store = new AppStore();
