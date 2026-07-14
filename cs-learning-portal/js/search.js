// Global Search Utility for CS Learning Portal

import { chapters } from './data/chapters.js';
import { programs, outputQuestions, debuggingQuestions } from './data/programs.js';
import { samplePapers, previousYearPapers, caseStudyQuestions } from './data/questions.js';
import { quizzes } from './data/quizzes.js';

class GlobalSearch {
  constructor() {
    this.input = document.getElementById('global-search-input');
    this.dropdown = document.getElementById('search-results-dropdown');
    this.clearBtn = document.getElementById('clear-search-btn');
    this.selectedIndex = -1;
    this.resultItems = [];

    if (this.input) {
      this.initEvents();
    }
  }

  initEvents() {
    // Input typing
    this.input.addEventListener('input', () => this.handleSearch());
    
    // Toggle focus dropdown display
    this.input.addEventListener('focus', () => {
      if (this.input.value.trim().length > 0) {
        this.dropdown.classList.remove('hidden');
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.dropdown.classList.add('hidden');
      }
    });

    // Clear button
    this.clearBtn.addEventListener('click', () => {
      this.input.value = '';
      this.clearBtn.classList.add('hidden');
      this.dropdown.classList.add('hidden');
      this.dropdown.innerHTML = '';
      this.input.focus();
    });

    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => this.handleKeyboardNav(e));
  }

  handleSearch() {
    const query = this.input.value.trim().toLowerCase();
    
    if (query.length === 0) {
      this.clearBtn.classList.add('hidden');
      this.dropdown.classList.add('hidden');
      this.dropdown.innerHTML = '';
      return;
    }

    this.clearBtn.classList.remove('hidden');
    this.dropdown.classList.remove('hidden');
    this.selectedIndex = -1;
    
    // Grouped Results
    const results = {
      notes: [],
      programs: [],
      papers: [],
      quizzes: []
    };

    // 1. Search Chapters
    chapters.forEach(c => {
      if (c.title.toLowerCase().includes(query) || c.summary.toLowerCase().includes(query)) {
        results.notes.push({
          title: c.title,
          category: `Study Notes (${c.category})`,
          hash: `#/study/${c.id}`,
          icon: 'book-open'
        });
      }
    });

    // 2. Search Programs / Lab
    programs.forEach(p => {
      if (p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
        results.programs.push({
          title: p.title,
          category: `Coding Lab (${p.category})`,
          hash: `#/coding`, // Navigates to coding section
          icon: 'code-2'
        });
      }
    });
    outputQuestions.forEach(q => {
      if (q.title.toLowerCase().includes(query)) {
        results.programs.push({
          title: `Output Pred: ${q.title}`,
          category: `Coding Lab (Output)`,
          hash: `#/coding`,
          icon: 'terminal'
        });
      }
    });

    // 3. Search Question Papers & Cases
    samplePapers.forEach(p => {
      if (p.title.toLowerCase().includes(query)) {
        results.papers.push({
          title: p.title,
          category: `Question Bank (Sample Paper)`,
          hash: `#/questions`,
          icon: 'file-text'
        });
      }
    });
    previousYearPapers.forEach(p => {
      if (p.title.toLowerCase().includes(query)) {
        results.papers.push({
          title: p.title,
          category: `Question Bank (Board Paper)`,
          hash: `#/questions`,
          icon: 'archive'
        });
      }
    });
    caseStudyQuestions.forEach(c => {
      if (c.title.toLowerCase().includes(query)) {
        results.papers.push({
          title: `Case Study: ${c.title}`,
          category: `Question Bank (Case Study)`,
          hash: `#/questions`,
          icon: 'folder-git-2'
        });
      }
    });

    // 4. Search Quizzes
    quizzes.forEach(q => {
      if (q.title.toLowerCase().includes(query) || q.chapter.toLowerCase().includes(query)) {
        results.quizzes.push({
          title: q.title,
          category: `Quizzes (${q.chapter})`,
          hash: `#/quiz`,
          icon: 'trophy'
        });
      }
    });

    this.renderResults(results);
  }

  renderResults(results) {
    this.dropdown.innerHTML = '';
    let hasResults = false;
    let html = '';

    const categories = [
      { key: 'notes', title: 'Study Notes' },
      { key: 'programs', title: 'Python Programs' },
      { key: 'papers', title: 'Exam Question Bank' },
      { key: 'quizzes', title: 'Practice Quizzes' }
    ];

    categories.forEach(cat => {
      const items = results[cat.key];
      if (items.length > 0) {
        hasResults = true;
        html += `<div class="search-group-header">${cat.title}</div>`;
        items.forEach(item => {
          html += `
            <div class="search-result-item" data-hash="${item.hash}">
              <i data-lucide="${item.icon}"></i>
              <div class="search-result-info">
                <span>${item.title}</span>
                <span class="search-result-category">${item.category}</span>
              </div>
            </div>
          `;
        });
      }
    });

    if (!hasResults) {
      this.dropdown.innerHTML = `<div class="no-results-msg">No results matching your query.</div>`;
      this.resultItems = [];
      return;
    }

    this.dropdown.innerHTML = html;
    
    // Compile elements for keyboards
    this.resultItems = Array.from(this.dropdown.querySelectorAll('.search-result-item'));
    
    // Bind click events to items
    this.resultItems.forEach(item => {
      item.addEventListener('click', () => {
        const hash = item.getAttribute('data-hash');
        window.location.hash = hash;
        this.input.value = '';
        this.clearBtn.classList.add('hidden');
        this.dropdown.classList.add('hidden');
      });
    });

    // Redraw Lucide Icons in dropdown
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  handleKeyboardNav(e) {
    if (this.dropdown.classList.contains('hidden') || this.resultItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.resultItems.length;
      this.highlightItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + this.resultItems.length) % this.resultItems.length;
      this.highlightItem();
    } else if (e.key === 'Enter') {
      if (this.selectedIndex > -1 && this.resultItems[this.selectedIndex]) {
        e.preventDefault();
        this.resultItems[this.selectedIndex].click();
      }
    } else if (e.key === 'Escape') {
      this.dropdown.classList.add('hidden');
      this.input.blur();
    }
  }

  highlightItem() {
    this.resultItems.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.style.backgroundColor = 'var(--bg-tertiary)';
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.style.backgroundColor = 'transparent';
      }
    });
  }
}

export function initGlobalSearch() {
  new GlobalSearch();
}
