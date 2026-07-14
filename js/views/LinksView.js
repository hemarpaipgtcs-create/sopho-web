// Useful Links & Resources View Module

class LinksView {
  render() {
    const root = document.createElement('div');
    root.className = 'links-container';

    const linkGroups = [
      {
        title: 'CBSE & Official Portals',
        icon: 'graduation-cap',
        links: [
          { name: 'CBSE Academic', url: 'https://cbseacademic.nic.in', desc: 'Syllabus, sample papers, and curriculum sheets.' },
          { name: 'NCERT eBooks', url: 'https://ncert.nic.in/textbook.php', desc: 'Direct access to official CS Class XI & XII books.' },
          { name: 'Diksha Portal', url: 'https://diksha.gov.in', desc: 'Government-led digital infrastructure for study guides.' },
          { name: 'SWAYAM', url: 'https://swayam.gov.in', desc: 'Online courses and certifications on computer applications.' },
          { name: 'SWAYAM Prabha', url: 'https://www.swayamprabha.gov.in', desc: 'Free educational DTH channels telecasting tutorials.' },
          { name: 'NPTEL', url: 'https://nptel.ac.in', desc: 'High-quality engineering syllabus lectures by IITs.' }
        ]
      },
      {
        title: 'Python Training & Manuals',
        icon: 'code-2',
        links: [
          { name: 'Python Official Docs', url: 'https://docs.python.org/3/', desc: 'The definitive syntax reference manual.' },
          { name: 'W3Schools Python', url: 'https://www.w3schools.com/python/', desc: 'Beginner-friendly code editors and tutorials.' },
          { name: 'Programiz', url: 'https://www.programiz.com/python-programming', desc: 'Interactive explanations with compiler exercises.' },
          { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/python-programming-language/', desc: 'Comprehensive algorithms, structures, and code tests.' },
          { name: 'Real Python', url: 'https://realpython.com', desc: 'Deep-dive developer guides and best practices.' }
        ]
      },
      {
        title: 'SQL & Database Training',
        icon: 'database',
        links: [
          { name: 'MySQL Documentation', url: 'https://dev.mysql.com/doc/', desc: 'Official MySQL Server administration guides.' },
          { name: 'SQLBolt', url: 'https://sqlbolt.com', desc: 'Interactive client SQL browser exercises.' },
          { name: 'W3Schools SQL', url: 'https://www.w3schools.com/sql/', desc: 'Cheat sheet commands for database queries.' }
        ]
      },
      {
        title: 'Competitive Coding Hubs',
        icon: 'terminal',
        links: [
          { name: 'HackerRank', url: 'https://www.hackerrank.com', desc: 'Solve core algorithmic topics to earn coding badges.' },
          { name: 'LeetCode', url: 'https://leetcode.com', desc: 'Standard technical interview problem sheets.' },
          { name: 'CodeChef', url: 'https://www.codechef.com', desc: 'Participate in monthly programming contests.' },
          { name: 'Coding Ninjas', url: 'https://www.codingninjas.com', desc: 'Curated resource paths for competitive placement.' }
        ]
      },
      {
        title: 'AI Assistants & Creative tools',
        icon: 'bot',
        links: [
          { name: 'ChatGPT', url: 'https://chatgpt.com', desc: 'General-purpose AI conversational assistant.' },
          { name: 'Google Gemini', url: 'https://gemini.google.com', desc: 'Advanced multimodal logical model.' },
          { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', desc: 'Productivity AI assistant integrated with Windows.' },
          { name: 'Canva', url: 'https://www.canva.com', desc: 'Create infographics and PPTs for practical projects.' },
          { name: 'Gamma AI', url: 'https://gamma.app', desc: 'Generate complete slides and documents using AI.' }
        ]
      },
      {
        title: 'Developer Utilities',
        icon: 'git-branch',
        links: [
          { name: 'GitHub', url: 'https://github.com', desc: 'Host code, manage repositories, and review open-source projects.' },
          { name: 'Stack Overflow', url: 'https://stackoverflow.com', desc: 'The largest Q&A community for programming bugs.' },
          { name: 'Replit', url: 'https://replit.com', desc: 'Collaborative, multi-language online workspace.' }
        ]
      }
    ];

    let sectionsHtml = '';
    linkGroups.forEach(group => {
      let cardsHtml = '';
      group.links.forEach(l => {
        cardsHtml += `
          <div class="link-card" onclick="window.open('${l.url}', '_blank')">
            <div class="link-icon-container">
              <i data-lucide="${group.icon}"></i>
            </div>
            <div class="link-info">
              <h4>${l.name}</h4>
              <p>${l.desc}</p>
            </div>
          </div>
        `;
      });

      sectionsHtml += `
        <div class="section-card" style="margin-bottom: 32px;">
          <h3 style="font-size: 15px; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
            <i data-lucide="${group.icon}" class="text-accent" style="vertical-align: text-bottom; margin-right: 6px;"></i> ${group.title}
          </h3>
          <div class="links-grid">
            ${cardsHtml}
          </div>
        </div>
      `;
    });

    root.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 24px; margin-bottom: 6px;"><i data-lucide="external-link" class="text-accent" style="vertical-align: middle;"></i> Useful Links & Resources</h2>
        <p style="font-size: 13px; color: var(--text-secondary);">Direct references to trusted portals, coding playgrounds, documentation references, and AI assets.</p>
      </div>

      ${sectionsHtml}
    `;

    return root;
  }

  afterRender() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

export default LinksView;
