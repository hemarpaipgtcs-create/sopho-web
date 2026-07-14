// Programming Lab & Live Compiler View Module

import { programs, outputQuestions, debuggingQuestions, vivaQuestions, practicalFiles } from '../data/programs.js';
import { store } from '../store.js';

let pyodideInstance = null;
let pyodidePromise = null;

class CodingView {
  constructor() {
    this.activeTab = 'programs'; // default tab
    this.selectedProgramId = programs[0].id;
    this.compilerConsole = null;
    this.codeEditor = null;
    this.isRunning = false;
  }

  render() {
    const root = document.createElement('div');
    root.className = 'coding-container';

    root.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; margin-bottom: 6px;"><i data-lucide="code-2" class="text-accent" style="vertical-align: middle;"></i> Programming Lab</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Write, edit, and run Python programs directly in your browser. Practice board output queries and viva concepts.</p>
        </div>
        <div class="xp-counter-badge" id="compiler-status-badge" style="background-color: var(--warning-muted); color: var(--warning); border-color: rgba(245, 158, 11, 0.2);">
          <i data-lucide="loader" class="animate-spin"></i>
          <span>Compiler: Loading...</span>
        </div>
      </div>

      <!-- Lab Navigation Tabs -->
      <div class="lab-tabs">
        <div class="lab-tab active" data-tab="programs">Python Programs</div>
        <div class="lab-tab" data-tab="outputs">Output Questions</div>
        <div class="lab-tab" data-tab="debugging">Debugging Practice</div>
        <div class="lab-tab" data-tab="viva">Viva & Practical Info</div>
      </div>

      <!-- Workspace Area -->
      <div class="coding-workspace">
        
        <!-- Left: Code Editor -->
        <div class="editor-pane">
          <div class="editor-head">
            <span><i data-lucide="file-code" class="text-accent"></i> Editor (Python 3)</span>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm" id="btn-clear-editor" title="Reset/Clear Code"><i data-lucide="rotate-ccw"></i></button>
              <button class="btn btn-primary btn-sm" id="btn-run-code"><i data-lucide="play"></i> Run Code</button>
            </div>
          </div>
          <div class="editor-body">
            <textarea id="lab-code-editor" spellcheck="false" autocomplete="off"></textarea>
          </div>
        </div>

        <!-- Right: Terminal Console -->
        <div class="console-pane">
          <div class="console-head">
            <span><i data-lucide="terminal"></i> Console Output</span>
            <button class="btn btn-secondary btn-sm" id="btn-clear-console" style="padding: 4px 8px; font-size: 10px;">Clear</button>
          </div>
          <div class="console-body" id="lab-console-output">Preparing terminal console...</div>
        </div>

      </div>

      <!-- Tab Content Area -->
      <div id="lab-tab-details-container">
        <!-- Rendered based on active tab -->
      </div>
    `;

    return root;
  }

  afterRender() {
    this.compilerConsole = document.getElementById('lab-console-output');
    this.codeEditor = document.getElementById('lab-code-editor');

    // Bind tab clicks
    const tabs = document.querySelectorAll('.lab-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.activeTab = e.target.getAttribute('data-tab');
        this.renderTabDetails();
      });
    });

    // Populate initial program code
    this.loadProgram(this.selectedProgramId);

    // Initial load tab details
    this.renderTabDetails();

    // Editor clear btn
    document.getElementById('btn-clear-editor').addEventListener('click', () => {
      if(confirm("Are you sure you want to reset the editor? All changes will be lost.")) {
        this.loadProgram(this.selectedProgramId);
      }
    });

    // Console clear btn
    document.getElementById('btn-clear-console').addEventListener('click', () => {
      this.compilerConsole.textContent = '>>> ';
    });

    // Run code trigger
    document.getElementById('btn-run-code').addEventListener('click', () => this.runPythonCode());

    // Load Pyodide async
    this.initPyodide();
  }

  async initPyodide() {
    const statusBadge = document.getElementById('compiler-status-badge');
    
    if (pyodideInstance) {
      this.updateStatus(statusBadge, 'ready');
      return;
    }

    if (!window.loadPyodide) {
      // Offline fallback
      this.updateStatus(statusBadge, 'offline');
      this.compilerConsole.textContent = '>>> Connection offline. Running compiler in simulation mode.\n>>> Type code and click Run.';
      return;
    }

    this.compilerConsole.textContent = 'Initializing Python Pyodide runtime (WebAssembly)...\n';

    try {
      if (!pyodidePromise) {
        pyodidePromise = window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
        });
      }
      pyodideInstance = await pyodidePromise;
      this.updateStatus(statusBadge, 'ready');
      this.compilerConsole.textContent += '>>> Python 3 initialized successfully.\n>>> Write code and click [Run Code].\n>>> ';
    } catch (err) {
      console.error(err);
      this.updateStatus(statusBadge, 'error');
      this.compilerConsole.textContent = '>>> Failed to initialize WebAssembly Python compiler.\n>>> Switching to offline fallback sandbox.\n>>> ';
    }
  }

  updateStatus(badge, state) {
    if (!badge) return;
    
    if (state === 'ready') {
      badge.style.backgroundColor = 'var(--success-muted)';
      badge.style.color = 'var(--success)';
      badge.style.borderColor = 'rgba(16, 185, 129, 0.2)';
      badge.innerHTML = '<i data-lucide="check-circle-2"></i> <span>Compiler: Ready</span>';
    } else if (state === 'offline' || state === 'error') {
      badge.style.backgroundColor = 'var(--danger-muted)';
      badge.style.color = 'var(--danger)';
      badge.style.borderColor = 'rgba(239, 68, 68, 0.2)';
      badge.innerHTML = '<i data-lucide="alert-triangle"></i> <span>Compiler: Mock mode</span>';
    }
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  async runPythonCode() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    const runBtn = document.getElementById('btn-run-code');
    runBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Running...';
    if (window.lucide) window.lucide.createIcons();

    this.compilerConsole.textContent += `\nExecuting script...\n`;
    const userCode = this.codeEditor.value;

    // Acknowledge compiler activity with XP points (maximum 5 times per session to prevent farming)
    let codingXpCount = parseInt(sessionStorage.getItem('coding_xp_reward') || '0');
    if (codingXpCount < 5) {
      store.addXP(10);
      sessionStorage.setItem('coding_xp_reward', String(codingXpCount + 1));
      const xpDisp = document.getElementById('user-xp-display');
      if (xpDisp) xpDisp.textContent = `${store.getUser().xp} XP`;
    }

    if (pyodideInstance) {
      try {
        // Intercept stdout
        await pyodideInstance.runPythonAsync(`
          import sys
          import io
          sys.stdout = io.StringIO()
          sys.stderr = io.StringIO()
        `);
        
        await pyodideInstance.runPythonAsync(userCode);
        
        const stdout = await pyodideInstance.runPythonAsync('sys.stdout.getvalue()');
        const stderr = await pyodideInstance.runPythonAsync('sys.stderr.getvalue()');
        
        if (stderr) {
          this.compilerConsole.textContent += stderr;
        } else if (stdout) {
          this.compilerConsole.textContent += stdout;
        } else {
          this.compilerConsole.textContent += '>>> (Script finished execution with no output)';
        }
      } catch (err) {
        this.compilerConsole.textContent += `\nTraceback (most recent call last):\n${err.message}\n`;
      }
    } else {
      // Simulate client execution using regex or basic JavaScript logic
      this.compilerConsole.textContent += '>>> [Mock Output Engine]\n';
      
      // Simple parse print statements in code
      const lines = userCode.split('\n');
      let outputs = [];
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('print(')) {
          // Extract text inside brackets
          const match = trimmed.match(/print\((.*)\)/);
          if (match && match[1]) {
            const inner = match[1];
            // If simple string
            if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
              outputs.push(inner.substring(1, inner.length - 1));
            } else {
              outputs.push(`[Variable evaluation simulated: ${inner}]`);
            }
          }
        }
      });
      
      if (outputs.length > 0) {
        this.compilerConsole.textContent += outputs.join('\n') + '\n';
      } else {
        this.compilerConsole.textContent += '>>> Processed. To view true runtime compilation outputs, please connect online to fetch the Pyodide compiler.\n';
      }
    }
    
    this.compilerConsole.textContent += '\n>>> ';
    this.compilerConsole.scrollTop = this.compilerConsole.scrollHeight;

    runBtn.innerHTML = '<i data-lucide="play"></i> Run Code';
    if (window.lucide) window.lucide.createIcons();
    this.isRunning = false;
  }

  loadProgram(programId) {
    this.selectedProgramId = programId;
    const prog = programs.find(p => p.id === programId) || programs[0];
    if (this.codeEditor) {
      this.codeEditor.value = prog.code;
    }
  }

  renderTabDetails() {
    const container = document.getElementById('lab-tab-details-container');
    if (!container) return;

    if (this.activeTab === 'programs') {
      // Render programs list
      let cards = '';
      programs.forEach(p => {
        cards += `
          <div class="preset-card-item" data-id="${p.id}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <h4>${p.title}</h4>
              <span class="challenge-badge">${p.difficulty}</span>
            </div>
            <p>${p.description}</p>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="section-card">
          <h3 style="font-size: 15px; margin-bottom: 12px;">Choose CBSE Board Laboratory Program</h3>
          <div class="grid-cols-2" style="gap: 16px;">
            ${cards}
          </div>
        </div>
      `;

      // Bind click triggers to card items
      container.querySelectorAll('.preset-card-item').forEach(card => {
        card.addEventListener('click', (e) => {
          const id = card.getAttribute('data-id');
          this.loadProgram(id);
          // Highlight active
          container.querySelectorAll('.preset-card-item').forEach(c => c.style.borderColor = 'var(--border-color)');
          card.style.borderColor = 'var(--accent)';
          // Scroll to editor
          document.querySelector('.editor-pane').scrollIntoView({ behavior: 'smooth' });
        });
      });

    } else if (this.activeTab === 'outputs') {
      // Render output questions
      let items = '';
      outputQuestions.forEach((q, idx) => {
        let optHtml = '';
        q.options.forEach((opt, oIdx) => {
          optHtml += `
            <button class="quiz-option" data-qidx="${idx}" data-oidx="${oIdx}">
              <span class="option-letter">${String.fromCharCode(65 + oIdx)}</span>
              <span><code>${opt}</code></span>
            </button>
          `;
        });

        items += `
          <div class="glass-card" style="margin-bottom: 20px; padding: 20px;" id="output-q-${idx}">
            <h4 style="margin-bottom: 8px;">Question ${idx+1}: ${q.title}</h4>
            <pre style="background-color: var(--code-bg); padding: 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 13px; margin-bottom: 16px; overflow-x: auto;">${q.question}</pre>
            <div class="quiz-options-list" style="margin-bottom: 12px;">
              ${optHtml}
            </div>
            <div class="quiz-explanation-box hidden" id="explain-${idx}">
              <strong>Explanation:</strong>
              <p style="margin-top: 4px;">${q.explanation}</p>
            </div>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="section-card">
          <h3 style="font-size: 15px; margin-bottom: 12px;">Output Prediction Practicals</h3>
          ${items}
        </div>
      `;

      // Bind output option clicks
      container.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const qIdx = parseInt(btn.getAttribute('data-qidx'));
          const oIdx = parseInt(btn.getAttribute('data-oidx'));
          const q = outputQuestions[qIdx];
          const chosenOpt = q.options[oIdx];
          const expBox = document.getElementById(`explain-${qIdx}`);
          
          // Disable choices in this block
          const optBlock = btn.parentElement.querySelectorAll('.quiz-option');
          optBlock.forEach(b => {
            b.classList.remove('selected', 'correct', 'incorrect');
            b.disabled = true;
          });

          if (chosenOpt === q.answer) {
            btn.classList.add('correct');
            store.addXP(10);
            const xpDisp = document.getElementById('user-xp-display');
            if (xpDisp) xpDisp.textContent = `${store.getUser().xp} XP`;
          } else {
            btn.classList.add('incorrect');
            // Highlight correct one
            optBlock.forEach((b, idx) => {
              if (q.options[idx] === q.answer) {
                b.classList.add('correct');
              }
            });
          }

          // Show explanation
          expBox.classList.remove('hidden');
        });
      });

    } else if (this.activeTab === 'debugging') {
      // Render debugging questions
      let items = '';
      debuggingQuestions.forEach((q, idx) => {
        items += `
          <div class="glass-card" style="margin-bottom: 20px; padding: 20px;">
            <h4 style="margin-bottom: 6px;">Exercise ${idx+1}: ${q.title}</h4>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">${q.description}</p>
            <pre style="background-color: var(--code-bg); padding: 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 13px; margin-bottom: 16px; border-left: 3px solid var(--danger); overflow-x: auto;">${q.buggyCode}</pre>
            <button class="btn btn-secondary btn-sm" id="btn-debug-solve-${idx}">Reveal Correct Code</button>
            
            <div class="quiz-explanation-box hidden" id="dbg-solve-box-${idx}" style="margin-top: 16px; border-left-color: var(--success);">
              <strong>Solution & Fixes:</strong>
              <div style="margin-top: 6px; white-space: pre-wrap;">${q.solution}</div>
            </div>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="section-card">
          <h3 style="font-size: 15px; margin-bottom: 12px;">CBSE Code Debugging Questions</h3>
          ${items}
        </div>
      `;

      debuggingQuestions.forEach((q, idx) => {
        document.getElementById(`btn-debug-solve-${idx}`).addEventListener('click', (e) => {
          const solveBox = document.getElementById(`dbg-solve-box-${idx}`);
          if (solveBox.classList.contains('hidden')) {
            solveBox.classList.remove('hidden');
            e.target.textContent = 'Hide Solution';
          } else {
            solveBox.classList.add('hidden');
            e.target.textContent = 'Reveal Correct Code';
          }
        });
      });

    } else if (this.activeTab === 'viva') {
      // Render Viva questions and Practical file notes
      let qa = '';
      vivaQuestions.forEach((v, idx) => {
        qa += `
          <div style="border-bottom: 1px solid var(--border-color); padding: 12px 0;">
            <h4 style="font-size: 13px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" class="viva-question-q" data-idx="${idx}">
              <span>Q${idx+1}: ${v.q}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            </h4>
            <p class="hidden" id="viva-a-${idx}" style="font-size: 12px; color: var(--text-secondary); margin-top: 8px; line-height: 1.5; padding-left: 12px; border-left: 2px solid var(--accent);">${v.a}</p>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="grid-cols-2" style="align-items: start;">
          <div class="section-card">
            <h3 style="font-size: 15px; margin-bottom: 12px;"><i data-lucide="clipboard-list" class="text-accent" style="vertical-align: text-bottom;"></i> Board Practical Guidelines</h3>
            <div>${practicalFiles.details}</div>
          </div>
          <div class="section-card">
            <h3 style="font-size: 15px; margin-bottom: 12px;"><i data-lucide="help-circle" class="text-accent" style="vertical-align: text-bottom;"></i> Class XII Oral Viva Questions</h3>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${qa}
            </div>
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      // Bind viva accordions
      container.querySelectorAll('.viva-question-q').forEach(qNode => {
        qNode.addEventListener('click', () => {
          const idx = qNode.getAttribute('data-idx');
          const aNode = document.getElementById(`viva-a-${idx}`);
          aNode.classList.toggle('hidden');
          qNode.querySelector('svg').classList.toggle('rotate-180');
        });
      });
    }
  }
}

export default CodingView;
