// Admin Dashboard View Module

import { store } from '../store.js';

class AdminView {
  constructor() {
    this.filterSubject = 'All';
    this.filterClass = 'All';
    this.filterStatus = 'All';
    this.searchQuery = '';
  }

  render() {
    const root = document.createElement('div');
    root.className = 'admin-dashboard-container';

    root.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; margin-bottom: 6px;"><i data-lucide="shield-check" class="text-accent" style="vertical-align: middle;"></i> Administrator Workspace</h2>
          <p style="font-size: 13px; color: var(--text-secondary);">Manage student inquiries, send email responses, track ticket resolutions, and download records logs.</p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-export-csv"><i data-lucide="file-spreadsheet"></i> Export CSV Spreadsheet</button>
      </div>

      <!-- Metrics Row -->
      <div class="admin-metrics" id="admin-metrics-row">
        <!-- Dynamically populated -->
      </div>

      <!-- Filter Bar -->
      <div class="section-card" style="margin-bottom: 24px; padding: 16px;">
        <div class="admin-filter-bar">
          <div class="admin-filters">
            
            <div style="display:flex; flex-direction:column; gap:4px;">
              <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Subject</span>
              <select id="admin-filter-subject" style="padding: 6px 12px; border-radius:4px; background:var(--bg-tertiary); border:1px solid var(--border-color); font-size:12px;">
                <option value="All">All Subjects</option>
                <option value="Doubt">Doubt</option>
                <option value="Request Notes">Request Notes</option>
                <option value="Report Error">Report Error</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style="display:flex; flex-direction:column; gap:4px;">
              <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Class</span>
              <select id="admin-filter-class" style="padding: 6px 12px; border-radius:4px; background:var(--bg-tertiary); border:1px solid var(--border-color); font-size:12px;">
                <option value="All">All Classes</option>
                <option value="XI">Class XI</option>
                <option value="XII">Class XII</option>
              </select>
            </div>

            <div style="display:flex; flex-direction:column; gap:4px;">
              <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Status</span>
              <select id="admin-filter-status" style="padding: 6px 12px; border-radius:4px; background:var(--bg-tertiary); border:1px solid var(--border-color); font-size:12px;">
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

          </div>

          <!-- Text Search Filter -->
          <div style="display:flex; flex-direction:column; gap:4px; min-width: 200px;">
            <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Search Student</span>
            <input type="text" id="admin-search-input" placeholder="Name or email..." style="padding: 6px 12px; border-radius:4px; background:var(--bg-tertiary); border:1px solid var(--border-color); font-size:12px;">
          </div>

        </div>
      </div>

      <!-- Ticket Queue Table -->
      <div class="section-card">
        <h3 style="font-size: 15px; margin-bottom: 12px;"><i data-lucide="inbox" class="text-accent" style="vertical-align: text-bottom;"></i> Active Student Query Queue</h3>
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Class / Sec</th>
                <th>Subject</th>
                <th>Message Snippet</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="admin-queries-table-body">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    return root;
  }

  afterRender() {
    this.renderMetrics();
    this.renderTableRows();

    // Bind Filter Controls
    const subSelect = document.getElementById('admin-filter-subject');
    const classSelect = document.getElementById('admin-filter-class');
    const statusSelect = document.getElementById('admin-filter-status');
    const searchField = document.getElementById('admin-search-input');

    subSelect.value = this.filterSubject;
    classSelect.value = this.filterClass;
    statusSelect.value = this.filterStatus;
    searchField.value = this.searchQuery;

    subSelect.addEventListener('change', (e) => { this.filterSubject = e.target.value; this.renderTableRows(); });
    classSelect.addEventListener('change', (e) => { this.filterClass = e.target.value; this.renderTableRows(); });
    statusSelect.addEventListener('change', (e) => { this.filterStatus = e.target.value; this.renderTableRows(); });
    searchField.addEventListener('input', (e) => { this.searchQuery = e.target.value.trim().toLowerCase(); this.renderTableRows(); });

    // Bind Export Button
    document.getElementById('btn-export-csv').addEventListener('click', () => this.exportQueriesToCsv());

    // Listen for state changes
    this.unsubscribeQueries = store.subscribe('queriesChanged', () => {
      this.renderMetrics();
      this.renderTableRows();
    });
  }

  renderMetrics() {
    const row = document.getElementById('admin-metrics-row');
    if (!row) return;

    const list = store.getQueries();
    const total = list.length;
    const pending = list.filter(q => q.status === 'pending').length;
    const resolved = list.filter(q => q.status === 'resolved').length;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 100;

    row.innerHTML = `
      <div class="metric-card">
        <div class="metric-icon"><i data-lucide="mail"></i></div>
        <div class="metric-info">
          <span class="metric-value">${total}</span>
          <span class="metric-label">Total Queries</span>
        </div>
      </div>
      <div class="metric-card warning">
        <div class="metric-icon"><i data-lucide="clock"></i></div>
        <div class="metric-info">
          <span class="metric-value">${pending}</span>
          <span class="metric-label">Pending Doubts</span>
        </div>
      </div>
      <div class="metric-card success">
        <div class="metric-icon"><i data-lucide="check-square"></i></div>
        <div class="metric-info">
          <span class="metric-value">${resolved}</span>
          <span class="metric-label">Resolved Tickets</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon"><i data-lucide="percent"></i></div>
        <div class="metric-info">
          <span class="metric-value">${rate}%</span>
          <span class="metric-label">Resolution Rate</span>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderTableRows() {
    const tbody = document.getElementById('admin-queries-table-body');
    if (!tbody) return;

    const list = store.getQueries();
    
    // Filter
    const filtered = list.filter(q => {
      const matchSubject = this.filterSubject === 'All' || q.subject === this.filterSubject;
      const matchClass = this.filterClass === 'All' || q.className === this.filterClass;
      const matchStatus = this.filterStatus === 'All' || q.status === this.filterStatus;
      const matchText = this.searchQuery === '' || 
        q.studentName.toLowerCase().includes(this.searchQuery) || 
        q.email.toLowerCase().includes(this.searchQuery) ||
        q.message.toLowerCase().includes(this.searchQuery);
        
      return matchSubject && matchClass && matchStatus && matchText;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding: 24px;">No student queries match the selected filters.</td></tr>`;
      return;
    }

    let html = '';
    filtered.forEach(q => {
      const dateStr = new Date(q.date).toLocaleDateString();
      const statusClass = q.status === 'pending' ? 'status-badge pending' : 'status-badge resolved';
      const msgSnippet = q.message.length > 50 ? q.message.substring(0, 50) + '...' : q.message;
      
      const fileBadge = q.attachment ? `
        <div style="font-size:10px; color:var(--accent); margin-top:2px; display:flex; align-items:center; gap:2px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paperclip"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          <span>${q.attachment}</span>
        </div>
      ` : '';

      html += `
        <tr id="query-row-${q.id}">
          <td style="color:var(--text-muted); font-size:11px;">${dateStr}</td>
          <td>
            <div style="font-weight:600;">${q.studentName}</div>
            <div style="font-size:11px; color:var(--text-muted);">${q.email}</div>
          </td>
          <td>Class ${q.className}-${q.section}</td>
          <td><span class="challenge-badge">${q.subject}</span></td>
          <td>
            <div title="${q.message}" style="max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${msgSnippet}</div>
            ${fileBadge}
          </td>
          <td><span class="${statusClass}">${q.status}</span></td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-secondary btn-sm btn-action-view" data-id="${q.id}" style="padding: 4px 8px; font-size:11px;" title="View & Reply"><i data-lucide="eye" style="width:13px; height:13px;"></i></button>
              <button class="btn btn-outline btn-sm btn-action-delete" data-id="${q.id}" style="padding: 4px 8px; font-size:11px; color:var(--danger); border-color:var(--border-color);" title="Delete Query"><i data-lucide="trash-2" style="width:13px; height:13px;"></i></button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Bind action buttons
    tbody.querySelectorAll('.btn-action-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openReplyModal(id);
      });
    });

    tbody.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm("Are you sure you want to delete this query permanently?")) {
          store.deleteQuery(id);
        }
      });
    });
  }

  openReplyModal(queryId) {
    const q = store.getQueries().find(item => item.id === queryId);
    if (!q) return;

    const modal = document.getElementById('global-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = modal.querySelector('#close-modal-btn');

    modalTitle.innerHTML = `<i data-lucide="mail-open" class="text-accent" style="vertical-align:text-bottom;"></i> Reply to ${q.studentName}`;
    
    const fileHtml = q.attachment ? `
      <div style="background:var(--bg-primary); padding:10px; border-radius:4px; margin-bottom:16px; border:1px solid var(--border-color); font-size:12px;">
        <strong>Attachment:</strong> <a href="#" style="color:var(--accent); text-decoration:underline;">${q.attachment}</a> (Mock Download)
      </div>
    ` : '';

    const replySection = q.status === 'resolved' ? `
      <div style="background-color: var(--success-muted); padding: 12px 16px; border-left: 3px solid var(--success); border-radius: 4px; font-size: 13px;">
        <strong>Resolved Output Message:</strong>
        <p style="margin-top: 4px; font-style:italic;">"${q.replyMessage}"</p>
        <span style="font-size:10px; color:var(--text-muted); display:block; margin-top:4px;">Resolved on: ${new Date(q.dateResolved).toLocaleString()}</span>
      </div>
    ` : `
      <form id="admin-reply-form" onsubmit="return false;">
        <div class="form-group">
          <label for="admin-reply-text">Email Response Content *</label>
          <textarea id="admin-reply-text" required placeholder="Type your answer, solution notes, or directions here..." style="width:100%; height:120px; font-size:13px;"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-sm" style="width:100%; margin-top:10px;">Send Response via EmailJS</button>
      </form>
    `;

    modalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-muted);">
          <span>Class: <strong>${q.className}-${q.section}</strong></span>
          <span>Submitted: <strong>${new Date(q.date).toLocaleString()}</strong></span>
        </div>
        <div style="background-color: var(--bg-tertiary); padding: 12px 16px; border-radius: 4px; font-size: 13px; line-height: 1.5;">
          <strong>Student Question:</strong>
          <p style="margin-top: 4px; color:var(--text-primary); white-space:pre-wrap;">${q.message}</p>
        </div>
        ${fileHtml}
      </div>
      
      ${replySection}
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    // Close Modal Listeners
    const closeModal = () => {
      modal.classList.add('hidden');
      modalBody.innerHTML = '';
    };

    closeBtn.onclick = closeModal;
    
    // Also close modal when clicking overlay
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    // Bind Reply Form Submit
    const replyForm = document.getElementById('admin-reply-form');
    if (replyForm) {
      replyForm.addEventListener('submit', () => {
        const text = document.getElementById('admin-reply-text').value.trim();
        
        // Save reply in store
        store.updateQueryStatus(q.id, {
          status: 'resolved',
          replyMessage: text
        });

        alert(`Email Sent Successfully!\n\nTo: ${q.email}\nSubject: Re: CS Learn support - ${q.subject}\n\nMessage body:\n"${text}"`);
        closeModal();
      });
    }
  }

  exportQueriesToCsv() {
    const list = store.getQueries();
    if (list.length === 0) {
      alert("No queries available to export.");
      return;
    }

    // Build CSV Content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,Date,Student Name,Class,Section,Email,Phone,Subject,Message,Status\n';

    list.forEach(q => {
      // Escape commas and quotes
      const nameEscaped = `"${q.studentName.replace(/"/g, '""')}"`;
      const msgEscaped = `"${q.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const subEscaped = `"${q.subject.replace(/"/g, '""')}"`;
      
      const row = [
        q.id,
        q.date,
        nameEscaped,
        q.className,
        q.section,
        q.email,
        q.phone || '',
        subEscaped,
        msgEscaped,
        q.status
      ].join(',');
      
      csvContent += row + '\n';
    });

    // Dynamic Download trigger
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Queries_Log_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default AdminView;
