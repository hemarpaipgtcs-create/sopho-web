// About Page View Module

class AboutView {
  render() {
    const root = document.createElement('div');
    root.className = 'about-container';

    root.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 24px; margin-bottom: 6px;"><i data-lucide="info" class="text-accent" style="vertical-align: middle;"></i> About the Portal</h2>
        <p style="font-size: 13px; color: var(--text-secondary);">Introduction to the Computer Science Learning Portal for CBSE Board exams.</p>
      </div>

      <div class="glass-card" style="margin-bottom: 24px; padding: 24px;">
        <h3 style="margin-bottom: 12px;">Portal Mission</h3>
        <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 16px;">
          The <strong>CS Learn Portal</strong> is a comprehensive digital hub designed exclusively for CBSE Class XII Computer Science students. Our mission is to bridge the gap between classroom teaching and home studies by providing organized curriculum notes, interactive laboratories, real-time quizzes, and immediate queries resolution.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
          Built with an emphasis on rich modern aesthetics and responsive accessibility, students can review programming syntax on mobile screens or solve board examinations sample papers in comfortable desktop formats.
        </p>
      </div>

      <div class="grid-cols-3" style="gap: 20px; margin-bottom: 32px;">
        <div class="glass-card">
          <div style="font-size: 24px; color: var(--accent); margin-bottom: 10px;"><i data-lucide="zap"></i></div>
          <h4 style="margin-bottom: 6px;">Wasm Compiler</h4>
          <p style="font-size: 12px; color: var(--text-secondary);">Pyodide executes true Python scripts locally in the browser with zero remote setups.</p>
        </div>
        <div class="glass-card">
          <div style="font-size: 24px; color: var(--success); margin-bottom: 10px;"><i data-lucide="award"></i></div>
          <h4 style="margin-bottom: 6px;">Gamified Metrics</h4>
          <p style="font-size: 12px; color: var(--text-secondary);">Earn Experience Points (XP) for coding, reading chapters, and finishing MCQ tests.</p>
        </div>
        <div class="glass-card">
          <div style="font-size: 24px; color: var(--warning); margin-bottom: 10px;"><i data-lucide="check-circle-2"></i></div>
          <h4 style="margin-bottom: 6px;">Admin Panel</h4>
          <p style="font-size: 12px; color: var(--text-secondary);">Simulates email notifications, ticket resolution logs, and CSV query sheet builders.</p>
        </div>
      </div>

      <div class="section-card">
        <h3 style="font-size: 15px; margin-bottom: 12px;">Disclaimers & Terms</h3>
        <div style="font-size: 12px; color: var(--text-secondary); display:flex; flex-direction:column; gap:12px; line-height:1.6;">
          <p>
            <strong>Disclaimer:</strong> This website is an educational tool designed for CBSE curriculum support. All sample papers, board exam guidelines, and syllabus notes are compiled based on resources published on the CBSE Academic portal. We do not claim official partnership with CBSE.
          </p>
          <p>
            <strong>Copyright:</strong> &copy; 2026 CS Learn Portal. Student notes, question keys, and interactive programs are freely open for school educational distributions.
          </p>
        </div>
      </div>
    `;

    return root;
  }

  afterRender() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

export default AboutView;
