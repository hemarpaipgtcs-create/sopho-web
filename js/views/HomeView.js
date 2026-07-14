// Home / Dashboard View Module

import { store } from '../store.js';

class HomeView {
  constructor() {
    this.user = store.getUser();
  }

  render() {
    const root = document.createElement('div');
    root.className = 'dashboard-container';
    
    const quotes = [
      { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
      { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { text: "Programs must be written for people to read, and only accidentally for machines to execute.", author: "Harold Abelson" },
      { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" }
    ];
    
    // Pick random quote
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    root.innerHTML = `
      <!-- Welcome Hero -->
      <div class="welcome-hero">
        <div class="welcome-info">
          <h1>Welcome back, <span class="text-accent" id="dash-username">${this.user.username}</span>!</h1>
          <p>Prepare for your CBSE Class XII Computer Science Board Exam with curated study notes, interactive Python playground, practice quizzes, and direct resources.</p>
        </div>
        <div class="welcome-graphics">
          <i data-lucide="graduation-cap"></i>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        
        <!-- Left Side Dashboard Panels -->
        <div class="dashboard-left">
          
          <!-- Daily Programming Challenge -->
          <div class="section-card code-challenge-widget glass-card highlight">
            <div class="card-title-bar">
              <h3><i data-lucide="code" class="text-accent"></i> Daily Python Challenge</h3>
              <span class="challenge-badge">15 XP</span>
            </div>
            <div class="challenge-body">
              <h4 style="font-size: 14px; margin-bottom: 6px;">Find the Output of the Code</h4>
              <p>Predict the final print output of this string slicing loop:</p>
              <div class="challenge-code">my_str = "KERALA"
for i in range(len(my_str)-1, -1, -2):
    print(my_str[i], end="")</div>
              <p style="font-size: 11px; color: var(--text-muted);">Tip: Indexing starts at 0. Step size is negative (descending by 2).</p>
            </div>
            <div style="display: flex; gap: 10px;">
              <a href="#/coding" class="btn btn-primary btn-sm">Open Editor</a>
              <button class="btn btn-secondary btn-sm" id="btn-show-hint">Reveal Hint</button>
            </div>
          </div>

          <!-- Shortcuts/Features Grid -->
          <div class="grid-cols-2">
            <div class="glass-card highlight" style="cursor: pointer;" onclick="window.location.hash='#/study'">
              <div style="font-size: 24px; margin-bottom: 12px; color: var(--accent);"><i data-lucide="book-open"></i></div>
              <h4 style="margin-bottom: 6px;">Syllabus Study Materials</h4>
              <p style="font-size: 12px; color: var(--text-secondary);">Chapter-wise notes covering exception handling, file streams, databases, and networks.</p>
            </div>
            <div class="glass-card highlight" style="cursor: pointer;" onclick="window.location.hash='#/quiz'">
              <div style="font-size: 24px; margin-bottom: 12px; color: var(--success);"><i data-lucide="award"></i></div>
              <h4 style="margin-bottom: 6px;">Chapter Quizzes</h4>
              <p style="font-size: 12px; color: var(--text-secondary);">Test your knowledge with board-level MCQs, score points, and earn certificates.</p>
            </div>
          </div>

        </div>

        <!-- Right Side Dashboard Panels -->
        <div class="dashboard-right">
          
          <!-- Quote of the Day -->
          <div class="section-card quote-widget glass-card">
            <blockquote>"${quote.text}"</blockquote>
            <cite>— ${quote.author}</cite>
          </div>

          <!-- Upcoming Milestones / Exams -->
          <div class="section-card">
            <div class="card-title-bar">
              <h3><i data-lucide="calendar" class="text-accent"></i> CBSE Board Milestones</h3>
            </div>
            <div class="exam-timeline">
              <div class="timeline-item active">
                <div class="timeline-date-node">Jan</div>
                <div class="timeline-content">
                  <h4>Practical File Submission</h4>
                  <p>Submit Python scripts and SQL outputs to external examiners.</p>
                </div>
              </div>
              <div class="timeline-item active">
                <div class="timeline-date-node">Feb</div>
                <div class="timeline-content">
                  <h4>School Board Practicals</h4>
                  <p>Includes Python coding + SQL queries test + oral Viva voce exam (30 Marks).</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-date-node">Mar</div>
                <div class="timeline-content">
                  <h4>Theory Board Exam</h4>
                  <p>Final 70-mark theory paper. Focus on stack, files, MySQL aggregation, networks.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Announcements Widget -->
          <div class="section-card">
            <div class="card-title-bar">
              <h3><i data-lucide="megaphone" class="text-accent"></i> Recent Updates</h3>
            </div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
              <li style="border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                <span class="challenge-badge" style="background-color: var(--success-muted); color: var(--success); margin-bottom: 4px; display: inline-block;">Syllabus</span>
                <p>Reduced syllabus guidelines for 2026. Data structures limited to Stack operations (Queue removed).</p>
              </li>
              <li>
                <span class="challenge-badge" style="margin-bottom: 4px; display: inline-block;">Portal</span>
                <p>Interactive client-side Python execution is now enabled. Run scripts in the Programming Lab.</p>
              </li>
            </ul>
          </div>

        </div>
      </div>
    `;

    return root;
  }

  afterRender() {
    // Hint button trigger listener
    const hintBtn = document.getElementById('btn-show-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        alert("Hint: The indices evaluated will be 5 ('A'), 3 ('A'), and 1 ('E'). So the letters print in reverse order: 'A A E'. Run this code in the Programming Lab to verify!");
      });
    }

    // Reactively update user name details if changed
    store.subscribe('userChanged', (newUser) => {
      const uText = document.getElementById('dash-username');
      if (uText) uText.textContent = newUser.username;
    });
  }
}

export default HomeView;
