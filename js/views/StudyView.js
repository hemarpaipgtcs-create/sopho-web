// Study Materials Notes View Module

import { chapters } from '../data/chapters.js';
import { store } from '../store.js';

class StudyView {
  constructor(initialChapterId) {
    // Determine initially active chapter (from URL parameters or first item)
    this.activeChapterId = initialChapterId || chapters[0].id;
  }

  render() {
    const root = document.createElement('div');
    root.className = 'study-container';

    // Build sidebar listing
    let sidebarHtml = '';
    chapters.forEach(c => {
      const activeClass = c.id === this.activeChapterId ? 'active' : '';
      sidebarHtml += `<div class="chapter-menu-item ${activeClass}" data-id="${c.id}">${c.title}</div>`;
    });

    root.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 24px; margin-bottom: 6px;"><i data-lucide="book-open" class="text-accent" style="vertical-align: middle;"></i> Study Materials</h2>
        <p style="font-size: 13px; color: var(--text-secondary);">Access detailed, chapter-wise notes compiled according to the latest CBSE Class XII Syllabus.</p>
      </div>

      <div class="study-layout">
        
        <!-- Left Chapters Sidebar -->
        <aside class="study-chapters-menu" id="study-chapters-list">
          <div class="nav-section-label" style="margin: 0 0 10px 0;">Chapters</div>
          ${sidebarHtml}
        </aside>

        <!-- Right Reading Panel -->
        <div class="glass-card study-viewer-card" id="study-content-panel">
          <!-- Dynamically populated -->
        </div>

      </div>
    `;

    return root;
  }

  afterRender() {
    this.renderChapterContent();

    // Bind sidebar clicks
    const menuItems = document.querySelectorAll('.chapter-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Remove active class from previous
        menuItems.forEach(i => i.classList.remove('active'));
        
        // Add to active
        e.target.classList.add('active');
        
        this.activeChapterId = e.target.getAttribute('data-id');
        this.renderChapterContent();
        
        // Update hash quietly without trigger full page reload, or update URL state
        window.history.replaceState(null, null, `#/study/${this.activeChapterId}`);
      });
    });
  }

  renderChapterContent() {
    const panel = document.getElementById('study-content-panel');
    if (!panel) return;

    const chapter = chapters.find(c => c.id === this.activeChapterId) || chapters[0];
    const isBookmarked = store.isFavorite('notes', chapter.id);
    const starIcon = isBookmarked ? 'star-off' : 'star';
    const starColor = isBookmarked ? '#f59e0b' : 'currentColor';
    const fillValue = isBookmarked ? '#f59e0b' : 'none';

    panel.innerHTML = `
      <div class="chapter-content-head">
        <div>
          <h2>${chapter.title}</h2>
          <div class="chapter-meta">
            <span><i data-lucide="tag" style="width: 13px; height: 13px; vertical-align: text-bottom;"></i> ${chapter.category}</span>
            <span><i data-lucide="clock" style="width: 13px; height: 13px; vertical-align: text-bottom;"></i> ${chapter.readingTime} read</span>
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="header-action-btn" id="btn-favorite-chapter" title="Bookmark Chapter" aria-label="Bookmark Chapter">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${fillValue}" stroke="${starColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-download-pdf"><i data-lucide="download"></i> PDF Notes</button>
        </div>
      </div>
      
      <div class="chapter-content-body">
        <p style="font-size: 15px; font-weight: 500; color: var(--text-primary); margin-bottom: 20px; font-style: italic;">
          ${chapter.summary}
        </p>
        ${chapter.content}
      </div>
    `;

    // Re-trigger icon updates in reader panel
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Bookmark Toggle Listener
    const favBtn = document.getElementById('btn-favorite-chapter');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        store.toggleFavorite('notes', chapter.id);
        
        // Re-render to update star state
        this.renderChapterContent();
        
        // Re-trigger global notifications alert count if bookmark rewards XP
        const xpDisp = document.getElementById('user-xp-display');
        if (xpDisp) {
          xpDisp.textContent = `${store.getUser().xp} XP`;
        }
      });
    }

    // Download PDF Action handler
    const dlBtn = document.getElementById('btn-download-pdf');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        alert(`Downloading offline PDF Notes for "${chapter.title}"... This simulates generating a PDF package containing the notes.`);
      });
    }
  }
}

export default StudyView;
