// Contact & Support Form View Module

import { store } from '../store.js';

class ContactView {
  render() {
    const root = document.createElement('div');
    root.className = 'contact-container';

    root.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 24px; margin-bottom: 6px;"><i data-lucide="help-circle" class="text-accent" style="vertical-align: middle;"></i> Contact & support</h2>
        <p style="font-size: 13px; color: var(--text-secondary);">Submit your doubts, requests for notes, or feedback. The admin will reply directly via email.</p>
      </div>

      <div class="contact-grid">
        
        <!-- Left: Form -->
        <div class="section-card contact-form-container glass-card">
          <h3 style="font-size: 15px; margin-bottom: 20px;"><i data-lucide="mail" class="text-accent" style="vertical-align: text-bottom;"></i> Student Query Form</h3>
          
          <form id="student-contact-form" onsubmit="return false;">
            
            <div class="form-group">
              <label for="student-name">Student Full Name *</label>
              <input type="text" id="student-name" required placeholder="e.g. Rahul Sharma">
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label for="student-class">Class *</label>
                <select id="student-class" required>
                  <option value="">Select Class</option>
                  <option value="XI">Class XI</option>
                  <option value="XII" selected>Class XII</option>
                </select>
              </div>
              <div class="form-group">
                <label for="student-section">Section *</label>
                <input type="text" id="student-section" required placeholder="e.g. A" maxlength="2">
              </div>
            </div>

            <div class="form-group-row">
              <div class="form-group">
                <label for="student-email">Email Address *</label>
                <input type="email" id="student-email" required placeholder="e.g. rahul@gmail.com">
              </div>
              <div class="form-group">
                <label for="student-phone">Phone Number (Optional)</label>
                <input type="tel" id="student-phone" placeholder="e.g. 9876543210">
              </div>
            </div>

            <div class="form-group">
              <label for="query-subject">Subject Type *</label>
              <select id="query-subject" required>
                <option value="">Select Topic</option>
                <option value="Doubt">Academic Doubt</option>
                <option value="Request Notes">Request Notes</option>
                <option value="Report Error">Report Error</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="query-message">Message Details *</label>
              <textarea id="query-message" required placeholder="Describe your doubt or request in detail..."></textarea>
            </div>

            <div class="form-group">
              <label for="query-file">Attachment Upload (Optional)</label>
              <input type="file" id="query-file" style="padding: 8px 10px; font-size:12px;">
              <span style="font-size:10px; color:var(--text-muted); margin-top:2px;">Supports images, PDFs, ZIP files (Max 5MB).</span>
            </div>

            <button type="submit" class="btn btn-primary" id="btn-submit-contact" style="width: 100%; margin-top: 10px;">
              <i data-lucide="send"></i> Submit Query
            </button>

          </form>
        </div>

        <!-- Right: FAQ Info -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div class="section-card">
            <h3 style="font-size: 15px; margin-bottom: 12px;"><i data-lucide="info" class="text-accent" style="vertical-align: text-bottom;"></i> Submission Workflow</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 12px; color: var(--text-secondary);">
              <li style="display: flex; gap: 10px;">
                <span class="timeline-date-node" style="width:24px; height:24px; font-size:10px; border-width:1px;">1</span>
                <div>
                  <strong>Form Verification</strong>
                  <p>Client validates correct input types, active mail structures, and attachment dimensions.</p>
                </div>
              </li>
              <li style="display: flex; gap: 10px;">
                <span class="timeline-date-node" style="width:24px; height:24px; font-size:10px; border-width:1px;">2</span>
                <div>
                  <strong>Firebase Database Sync</strong>
                  <p>Stores message payload as a document inside the queries collection.</p>
                </div>
              </li>
              <li style="display: flex; gap: 10px;">
                <span class="timeline-date-node" style="width:24px; height:24px; font-size:10px; border-width:1px;">3</span>
                <div>
                  <strong>EmailJS API Trigger</strong>
                  <p>Sends instantaneous notification containing details directly to the teacher's inbox.</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="section-card" style="background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);">
            <h3 style="font-size: 14px; margin-bottom: 6px;"><i data-lucide="help-circle" class="text-accent" style="vertical-align: text-bottom;"></i> FAQs</h3>
            <div style="font-size: 12px; display:flex; flex-direction:column; gap:10px; color:var(--text-secondary);">
              <div>
                <strong>Q: How long does the teacher take to respond?</strong>
                <p>A: Typically within 24 hours, sent straight back to your email.</p>
              </div>
              <div>
                <strong>Q: Can I upload Python code files?</strong>
                <p>A: Yes, you can upload python scripts (.py) or screenshot captures of errors.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    return root;
  }

  afterRender() {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    const form = document.getElementById('student-contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processFormSubmission();
      });
    }
  }

  processFormSubmission() {
    const studentName = document.getElementById('student-name').value.trim();
    const className = document.getElementById('student-class').value;
    const section = document.getElementById('student-section').value.trim().toUpperCase();
    const email = document.getElementById('student-email').value.trim();
    const phone = document.getElementById('student-phone').value.trim();
    const subject = document.getElementById('query-subject').value;
    const message = document.getElementById('query-message').value.trim();
    const fileEl = document.getElementById('query-file');

    let attachmentName = null;
    if (fileEl && fileEl.files.length > 0) {
      attachmentName = fileEl.files[0].name;
    }

    // Save ticket in store database
    const payload = {
      studentName,
      className,
      section,
      email,
      phone,
      subject,
      message,
      attachment: attachmentName
    };

    const submitBtn = document.getElementById('btn-submit-contact');
    submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Submitting...';
    if (window.lucide) window.lucide.createIcons();
    submitBtn.disabled = true;

    // Simulate database network lag (600ms)
    setTimeout(() => {
      store.addQuery(payload);
      
      alert(`Success! Query submitted successfully.\n\n[Workflow Executed]\n1. Payload written to client-side localStorage state.\n2. Emulated EmailJS trigger notifying: mailto:cbseteacher@cslearn.edu\n3. Awarded +15 XP bonus!`);
      
      // Reset form
      form.reset();
      
      // Reset button
      submitBtn.innerHTML = '<i data-lucide="send"></i> Submit Query';
      submitBtn.disabled = false;
      if (window.lucide) window.lucide.createIcons();

      // Update XP Counter in Header
      const xpDisp = document.getElementById('user-xp-display');
      if (xpDisp) xpDisp.textContent = `${store.getUser().xp} XP`;
    }, 600);
  }
}

export default ContactView;
