// MCQ Practice & Certificate Generator View Module

import { quizzes } from '../data/quizzes.js';
import { store } from '../store.js';

class QuizView {
  constructor() {
    this.activeQuiz = null;
    this.currentQuestionIdx = 0;
    this.selectedOptions = {}; // { qIdx: optionIdx }
    this.timerInterval = null;
    this.timeLeft = 0;
    this.secondsSpent = 0;
    this.isSubmitted = false;
  }

  render() {
    const root = document.createElement('div');
    root.className = 'quiz-viewport-container';

    // Check if a quiz is currently active
    if (!this.activeQuiz) {
      // Render selection menu
      let cards = '';
      quizzes.forEach(q => {
        cards += `
          <div class="quiz-card glass-card highlight">
            <div class="quiz-card-meta">
              <span><i data-lucide="help-circle" style="width:12px;height:12px;vertical-align:middle;"></i> ${q.questions.length} Questions</span>
              <span><i data-lucide="clock" style="width:12px;height:12px;vertical-align:middle;"></i> ${q.timeLimit / 60} mins</span>
            </div>
            <h4>${q.title}</h4>
            <p style="font-size:12px; color:var(--text-secondary);">Tag: ${q.chapter}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
              <span class="challenge-badge" style="background-color: var(--success-muted); color: var(--success);">${q.xpReward} XP</span>
              <button class="btn btn-primary btn-sm btn-start-quiz" data-id="${q.id}">Start Quiz</button>
            </div>
          </div>
        `;
      });

      // Build history summary
      let historyRows = '';
      const history = store.getQuizHistory();
      if (history.length > 0) {
        history.forEach(h => {
          const statusClass = h.percentage >= 75 ? 'status-badge resolved' : 'status-badge pending';
          const statusText = h.percentage >= 75 ? 'Passed' : 'Failed';
          historyRows += `
            <tr>
              <td>${h.quizTitle}</td>
              <td>${h.score}/${h.total} (${h.percentage}%)</td>
              <td>${h.timerSpent}s</td>
              <td><span class="${statusClass}">${statusText}</span></td>
            </tr>
          `;
        });
      } else {
        historyRows = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No attempts yet. Complete a quiz to see your history!</td></tr>`;
      }

      root.innerHTML = `
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 24px; margin-bottom: 6px;"><i data-lucide="trophy" class="text-accent" style="vertical-align: middle;"></i> MCQ Practice Portal</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Practice chapter-wise assessments mapped to standard CBSE Class XII boards. Score 75% or higher to earn a certificate.</p>
        </div>

        <div class="quiz-grid">
          ${cards}
        </div>

        <!-- Quiz Attempts History Table -->
        <div class="section-card" style="margin-top: 32px;">
          <h3 style="font-size: 15px; margin-bottom: 12px;"><i data-lucide="history" class="text-accent" style="vertical-align: text-bottom;"></i> Quiz Score History</h3>
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Quiz Topic</th>
                  <th>Score (Percentage)</th>
                  <th>Time Taken</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${historyRows}
              </tbody>
            </table>
          </div>
        </div>
      `;

    } else {
      // Render active simulator
      root.appendChild(this.renderActiveQuizSimulator());
    }

    return root;
  }

  afterRender() {
    if (!this.activeQuiz) {
      // Bind Start Buttons
      const startBtns = document.querySelectorAll('.btn-start-quiz');
      startBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          this.startQuizSession(id);
        });
      });
    } else {
      this.bindSimulatorEvents();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  startQuizSession(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    this.activeQuiz = quiz;
    this.currentQuestionIdx = 0;
    this.selectedOptions = {};
    this.timeLeft = quiz.timeLimit;
    this.secondsSpent = 0;
    this.isSubmitted = false;

    // Refresh route contents
    const container = document.getElementById('app-view');
    container.innerHTML = '';
    container.appendChild(this.renderActiveQuizSimulator());
    this.bindSimulatorEvents();
    
    // Start countdown
    this.startTimer();
    
    if (window.lucide) window.lucide.createIcons();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.secondsSpent++;
      
      const timerVal = document.getElementById('quiz-timer-value');
      if (timerVal) {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        timerVal.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        if (this.timeLeft <= 10) {
          timerVal.parentElement.style.color = 'var(--danger)';
        }
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        alert("Time is up! Submitting your answers automatically.");
        this.submitQuiz();
      }
    }, 1000);
  }

  renderActiveQuizSimulator() {
    const card = document.createElement('div');
    card.className = 'section-card quiz-simulator-card glass-card';

    const totalQ = this.activeQuiz.questions.length;
    const q = this.activeQuiz.questions[this.currentQuestionIdx];
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    const initialProgress = ((this.currentQuestionIdx + 1) / totalQ) * 100;

    let optionItems = '';
    q.options.forEach((opt, idx) => {
      const selectedClass = this.selectedOptions[this.currentQuestionIdx] === idx ? 'selected' : '';
      optionItems += `
        <button class="quiz-option ${selectedClass}" data-index="${idx}">
          <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
          <span>${opt}</span>
        </button>
      `;
    });

    const isLast = this.currentQuestionIdx === totalQ - 1;
    const nextBtnText = isLast ? 'Finish & Submit' : 'Next Question';
    const nextBtnIcon = isLast ? 'check-square' : 'chevron-right';

    card.innerHTML = `
      <div class="quiz-sim-header">
        <div>
          <h3 style="font-size: 16px;">${this.activeQuiz.title}</h3>
          <span style="font-size: 11px; color: var(--text-muted);">Question ${this.currentQuestionIdx + 1} of ${totalQ}</span>
        </div>
        <div class="quiz-sim-timer">
          <i data-lucide="clock"></i>
          <span id="quiz-timer-value">${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div class="quiz-sim-progress">
        <div class="quiz-progress-bar" id="quiz-progress-bar-el" style="width: ${initialProgress}%;"></div>
      </div>

      <div class="quiz-sim-question">
        <h3 style="font-weight: 500;">${q.q}</h3>
        <div class="quiz-options-list">
          ${optionItems}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
        <button class="btn btn-secondary btn-sm" id="btn-quiz-prev" ${this.currentQuestionIdx === 0 ? 'disabled' : ''}><i data-lucide="chevron-left"></i> Previous</button>
        <button class="btn btn-primary btn-sm" id="btn-quiz-next">${nextBtnText} <i data-lucide="${nextBtnIcon}"></i></button>
      </div>
    `;

    return card;
  }

  bindSimulatorEvents() {
    if (this.isSubmitted) return;

    // Option selections
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        const index = parseInt(opt.getAttribute('data-index'));
        this.selectedOptions[this.currentQuestionIdx] = index;
        
        // Toggle selected styling
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });

    // Prev Button
    const prevBtn = document.getElementById('btn-quiz-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentQuestionIdx > 0) {
          this.currentQuestionIdx--;
          this.updateQuestionLayout();
        }
      });
    }

    // Next Button
    const nextBtn = document.getElementById('btn-quiz-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalQ = this.activeQuiz.questions.length;
        
        if (this.currentQuestionIdx < totalQ - 1) {
          this.currentQuestionIdx++;
          this.updateQuestionLayout();
        } else {
          // Submit
          this.submitQuiz();
        }
      });
    }
  }

  updateQuestionLayout() {
    const totalQ = this.activeQuiz.questions.length;
    const q = this.activeQuiz.questions[this.currentQuestionIdx];
    const progressBar = document.getElementById('quiz-progress-bar-el');
    
    // Update progress bar width
    if (progressBar) {
      progressBar.style.width = `${((this.currentQuestionIdx + 1) / totalQ) * 100}%`;
    }

    // Update index labels
    const label = document.querySelector('.quiz-sim-header span');
    if (label) label.textContent = `Question ${this.currentQuestionIdx + 1} of ${totalQ}`;

    // Update question text
    const qTitle = document.querySelector('.quiz-sim-question h3');
    if (qTitle) qTitle.textContent = q.q;

    // Update choices list
    const optionsList = document.querySelector('.quiz-options-list');
    if (optionsList) {
      let optionItems = '';
      q.options.forEach((opt, idx) => {
        const selectedClass = this.selectedOptions[this.currentQuestionIdx] === idx ? 'selected' : '';
        optionItems += `
          <button class="quiz-option ${selectedClass}" data-index="${idx}">
            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
            <span>${opt}</span>
          </button>
        `;
      });
      optionsList.innerHTML = optionItems;
    }

    // Prev state control
    const prevBtn = document.getElementById('btn-quiz-prev');
    if (prevBtn) prevBtn.disabled = this.currentQuestionIdx === 0;

    // Next state control
    const nextBtn = document.getElementById('btn-quiz-next');
    if (nextBtn) {
      const isLast = this.currentQuestionIdx === totalQ - 1;
      nextBtn.innerHTML = isLast ? 'Finish & Submit <i data-lucide="check-square"></i>' : 'Next Question <i data-lucide="chevron-right"></i>';
    }

    this.bindSimulatorEvents();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  submitQuiz() {
    clearInterval(this.timerInterval);
    this.isSubmitted = true;

    // Calculate score
    let score = 0;
    const total = this.activeQuiz.questions.length;
    this.activeQuiz.questions.forEach((q, idx) => {
      if (this.selectedOptions[idx] === q.answer) {
        score++;
      }
    });

    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 75;

    // Save record
    store.saveQuizScore(this.activeQuiz.id, this.activeQuiz.title, score, total, this.activeQuiz.timeLimit, this.secondsSpent);

    // Refresh layout view with results
    const container = document.getElementById('app-view');
    container.innerHTML = '';
    
    const resultsCard = document.createElement('div');
    resultsCard.className = 'section-card quiz-simulator-card glass-card';
    
    // Build Review answers html
    let reviewHtml = '';
    this.activeQuiz.questions.forEach((q, idx) => {
      const userSel = this.selectedOptions[idx] !== undefined ? q.options[this.selectedOptions[idx]] : 'Not Answered';
      const isCorrect = this.selectedOptions[idx] === q.answer;
      const statusIcon = isCorrect ? 'check-circle-2' : 'alert-circle';
      const statusColor = isCorrect ? 'var(--success)' : 'var(--danger)';

      reviewHtml += `
        <div style="border-bottom:1px solid var(--border-color); padding: 16px 0;">
          <h4 style="font-size:13px; display:flex; align-items:flex-start; gap:8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${statusIcon}" style="margin-top:2px; flex-shrink:0;"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>
            <span>Q${idx+1}: ${q.q}</span>
          </h4>
          <p style="font-size:11px; margin-top:6px; color: var(--text-secondary);">Your Answer: <strong style="color:${statusColor};">${userSel}</strong></p>
          <p style="font-size:11px; color: var(--success);">Correct Answer: <strong>${q.options[q.answer]}</strong></p>
          <div class="quiz-explanation-box" style="margin-top:10px; margin-bottom:0;">
            <strong>Explanation:</strong> ${q.explanation}
          </div>
        </div>
      `;
    });

    resultsCard.innerHTML = `
      <div style="text-align: center; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);">
        <div style="font-size: 48px; margin-bottom: 12px;">
          ${passed ? '<span class="text-accent">&#127881;</span>' : '<span style="color:var(--danger)">&#128078;</span>'}
        </div>
        <h2>Quiz Completed!</h2>
        <p style="font-size: 14px; margin-top: 6px; color: var(--text-secondary);">Your score: <strong style="font-size:18px; color:var(--accent);">${score} / ${total}</strong> (${percentage}%)</p>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Time spent: ${this.secondsSpent} seconds | Bonus: +${score * 20} XP added!</p>
        
        <div style="margin-top: 20px; display: flex; justify-content: center; gap: 12px;">
          <button class="btn btn-secondary btn-sm" id="btn-quiz-retry">Try Again</button>
          <button class="btn btn-primary btn-sm" id="btn-quiz-close">Return to Portal</button>
        </div>
      </div>

      <!-- Certificate Display segment -->
      ${passed ? `
        <div class="section-card" style="background-color:var(--bg-primary); margin-bottom:24px; text-align:center;">
          <h3 style="font-size:14px; margin-bottom:12px;"><i data-lucide="award" class="text-accent" style="vertical-align:text-bottom;"></i> E-Certificate Earned!</h3>
          <p style="font-size:11px; color:var(--text-secondary); margin-bottom:16px;">Congratulations! You passed with high scores. Download your certification of excellence.</p>
          <div class="certificate-preview-box">
            <canvas id="certificate-canvas" width="800" height="560"></canvas>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-download-cert"><i data-lucide="download"></i> Download PNG Certificate</button>
        </div>
      ` : ''}

      <div class="section-card">
        <h3 style="font-size:14px; margin-bottom:12px;"><i data-lucide="file-check-2" class="text-accent" style="vertical-align:text-bottom;"></i> Question-by-Question Review</h3>
        ${reviewHtml}
      </div>
    `;

    container.appendChild(resultsCard);

    // Update XP display in Header
    const xpDisp = document.getElementById('user-xp-display');
    if (xpDisp) xpDisp.textContent = `${store.getUser().xp} XP`;

    // Retry and Exit Bindings
    document.getElementById('btn-quiz-retry').addEventListener('click', () => {
      this.startQuizSession(this.activeQuiz.id);
    });

    document.getElementById('btn-quiz-close').addEventListener('click', () => {
      this.activeQuiz = null;
      window.location.hash = '#/quiz';
    });

    // Draw Certificate canvas if passed
    if (passed) {
      this.drawCertificate(percentage);
      document.getElementById('btn-download-cert').addEventListener('click', () => this.downloadCertificatePng());
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  drawCertificate(scorePercentage) {
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 1. Draw solid background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 560);

    // 2. Draw outer dark-blue border
    ctx.strokeStyle = '#0b0f19';
    ctx.lineWidth = 14;
    ctx.strokeRect(15, 15, 770, 530);

    // 3. Draw inner gold border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, 744, 504);

    // 4. Draw corner gold decorations (decorative angles)
    ctx.fillStyle = '#f59e0b';
    const corners = [
      [28, 28, 40, 40], // top-left
      [732, 28, 40, 40], // top-right
      [28, 492, 40, 40], // bottom-left
      [732, 492, 40, 40] // bottom-right
    ];

    // 5. Draw Header Emblem
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 20px Outfit, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CS LEARN ACADEMY', 400, 90);

    // 6. Draw certificate titles
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 36px Outfit, Inter, sans-serif';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 400, 160);

    ctx.fillStyle = '#6b7280';
    ctx.font = 'italic 16px Inter, sans-serif';
    ctx.fillText('This certificate is proudly awarded to', 400, 220);

    // 7. Student Name
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 30px Outfit, Inter, sans-serif';
    ctx.fillText(store.getUser().username, 400, 270);

    // Draw line under name
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(250, 290);
    ctx.lineTo(550, 290);
    ctx.stroke();

    // 8. Body explanation
    ctx.fillStyle = '#4b5563';
    ctx.font = '14px Inter, sans-serif';
    const text1 = `for demonstrating exceptional competency in the examination:`;
    const text2 = `"${this.activeQuiz.title}"`;
    const text3 = `held on ${new Date().toLocaleDateString()} securing an overall score of ${scorePercentage}%.`;
    ctx.fillText(text1, 400, 330);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(text2, 400, 360);
    ctx.fillStyle = '#4b5563';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(text3, 400, 390);

    // 9. Signatures and Date labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('DATE ISSUED', 220, 480);
    ctx.fillText('ACADEMY DIRECTOR', 580, 480);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(new Date().toLocaleDateString(), 220, 460);
    
    // Draw signature scribble
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(520, 455);
    ctx.bezierCurveTo(540, 440, 560, 470, 580, 450);
    ctx.bezierCurveTo(600, 430, 620, 465, 640, 445);
    ctx.stroke();

    // 10. Draw Gold Stamp Emblem
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(400, 460, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('SEAL', 400, 463);
  }

  downloadCertificatePng() {
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${store.getUser().username.replace(/\s+/g, '_')}_CBSE_CS_Certificate.png`;
    link.href = dataUrl;
    link.click();
  }
}

export default QuizView;
