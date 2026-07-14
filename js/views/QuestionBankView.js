// Question Bank & Downloads View Module

import { samplePapers, previousYearPapers, caseStudyQuestions, competencyQuestions } from '../data/questions.js';

class QuestionBankView {
  constructor() {
    this.activeTab = 'papers';
  }

  render() {
    const root = document.createElement('div');
    root.className = 'qbank-container';

    root.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 24px; margin-bottom: 6px;"><i data-lucide="folder-git-2" class="text-accent" style="vertical-align: middle;"></i> Question Bank & Resources</h2>
        <p style="font-size: 13px; color: var(--text-secondary);">Browse, practice, and download CBSE Board Sample Papers, Chapter-wise Case Studies, and Competency-based problems.</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="lab-tabs">
        <div class="lab-tab active" data-tab="papers">Sample & Board Papers</div>
        <div class="lab-tab" data-tab="casestudies">Case Study Questions</div>
        <div class="lab-tab" data-tab="competency">Competency-Based Questions</div>
      </div>

      <div id="qbank-details-slot">
        <!-- Rendered dynamically -->
      </div>
    `;

    return root;
  }

  afterRender() {
    // Bind Tab Click Triggers
    const tabs = document.querySelectorAll('.lab-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.activeTab = e.target.getAttribute('data-tab');
        this.renderTabDetails();
      });
    });

    this.renderTabDetails();
  }

  renderTabDetails() {
    const slot = document.getElementById('qbank-details-slot');
    if (!slot) return;

    if (this.activeTab === 'papers') {
      // Build Sample Papers list rows
      let sampleRows = '';
      samplePapers.forEach(sp => {
        sampleRows += `
          <tr>
            <td style="font-weight: 500;">${sp.title}</td>
            <td><span class="challenge-badge" style="background-color: var(--accent-muted); color: var(--accent);">${sp.year}</span></td>
            <td>${sp.fileSize} (${sp.fileType})</td>
            <td style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm btn-paper-dl" data-name="${sp.title} (Question Paper)"><i data-lucide="download"></i> Paper</button>
              <button class="btn btn-outline btn-sm btn-paper-dl" data-name="${sp.title} (Marking Scheme)"><i data-lucide="check-square"></i> Scheme</button>
            </td>
          </tr>
        `;
      });

      // Build PYPs rows
      let pypRows = '';
      previousYearPapers.forEach(p => {
        pypRows += `
          <tr>
            <td style="font-weight: 500;">${p.title}</td>
            <td><span class="challenge-badge" style="background-color: var(--warning-muted); color: var(--warning);">${p.year}</span></td>
            <td>${p.fileSize} (${p.fileType})</td>
            <td>
              <button class="btn btn-secondary btn-sm btn-paper-dl" data-name="${p.title}"><i data-lucide="download"></i> Download</button>
            </td>
          </tr>
        `;
      });

      slot.innerHTML = `
        <div class="section-card" style="margin-bottom: 24px;">
          <h3 style="font-size: 15px; margin-bottom: 12px;"><i data-lucide="file-text" class="text-accent" style="vertical-align: text-bottom;"></i> CBSE Sample Papers</h3>
          <div class="admin-table-container">
            <table class="downloads-table">
              <thead>
                <tr>
                  <th>Paper Title</th>
                  <th>Year</th>
                  <th>Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${sampleRows}
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-card">
          <h3 style="font-size: 15px; margin-bottom: 12px;"><i data-lucide="archive" class="text-accent" style="vertical-align: text-bottom;"></i> Previous Year Board Papers</h3>
          <div class="admin-table-container">
            <table class="downloads-table">
              <thead>
                <tr>
                  <th>Paper Title</th>
                  <th>Year</th>
                  <th>Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${pypRows}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Bind dl alerts
      slot.querySelectorAll('.btn-paper-dl').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const name = btn.getAttribute('data-name');
          alert(`Downloading resource: ${name}... This triggers direct static file retrieval from our cloud repository.`);
        });
      });

    } else if (this.activeTab === 'casestudies') {
      // Build Case studies accordion list
      let cases = '';
      caseStudyQuestions.forEach((cs, idx) => {
        cases += `
          <div class="glass-card" style="margin-bottom: 24px; padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 16px;">
              <h3 style="font-size: 16px;">Case Study ${idx+1}: ${cs.title}</h3>
              <span class="challenge-badge" style="background-color: var(--success-muted); color: var(--success);">${cs.marks}</span>
            </div>
            <div class="chapter-content-body" style="margin-bottom: 16px;">
              ${cs.question}
            </div>
            
            <button class="btn btn-secondary btn-sm" id="btn-toggle-case-${idx}">Reveal Marking Scheme & Answer Keys</button>
            
            <div class="quiz-explanation-box hidden" id="case-answer-box-${idx}" style="margin-top: 16px; padding: 16px; border-left-color: var(--accent);">
              ${cs.markingScheme}
            </div>
          </div>
        `;
      });

      slot.innerHTML = `
        <div>
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">Case Study questions are worth 4-5 marks and typically test networking infrastructure topologies or complex MySQL operations.</p>
          ${cases}
        </div>
      `;

      caseStudyQuestions.forEach((cs, idx) => {
        document.getElementById(`btn-toggle-case-${idx}`).addEventListener('click', (e) => {
          const answerBox = document.getElementById(`case-answer-box-${idx}`);
          if (answerBox.classList.contains('hidden')) {
            answerBox.classList.remove('hidden');
            e.target.textContent = 'Hide Answer Keys';
          } else {
            answerBox.classList.add('hidden');
            e.target.textContent = 'Reveal Marking Scheme & Answer Keys';
          }
        });
      });

    } else if (this.activeTab === 'competency') {
      // Build Competency questions layout
      let compHtml = '';
      competencyQuestions.forEach((cq, idx) => {
        compHtml += `
          <div class="glass-card" style="margin-bottom: 20px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
              <h4>Problem ${idx+1}: ${cq.title}</h4>
              <span class="challenge-badge">${cq.marks}</span>
            </div>
            <div class="chapter-content-body" style="font-size: 13px;">
              ${cq.question}
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-toggle-comp-${idx}" style="margin-top: 12px;">Reveal Solution Notes</button>
            <div class="quiz-explanation-box hidden" id="comp-answer-box-${idx}" style="margin-top: 16px;">
              ${cq.markingScheme}
            </div>
          </div>
        `;
      });

      slot.innerHTML = `
        <div class="section-card">
          <h3 style="font-size: 15px; margin-bottom: 12px;">CBSE Competency-Based & Application Questions</h3>
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">These application-oriented problems test index ranges, recursion traces, parameter mutations, and math/random modules outputs.</p>
          ${compHtml}
        </div>
      `;

      competencyQuestions.forEach((cq, idx) => {
        document.getElementById(`btn-toggle-comp-${idx}`).addEventListener('click', (e) => {
          const answerBox = document.getElementById(`comp-answer-box-${idx}`);
          if (answerBox.classList.contains('hidden')) {
            answerBox.classList.remove('hidden');
            e.target.textContent = 'Hide Solution Notes';
          } else {
            answerBox.classList.add('hidden');
            e.target.textContent = 'Reveal Solution Notes';
          }
        });
      });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

export default QuestionBankView;
