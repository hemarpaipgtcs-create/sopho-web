// CBSE Class XII Computer Science Question Bank & Resources Data

export const samplePapers = [
  {
    id: 'sp-2026',
    title: 'CBSE Official Sample Question Paper 2025-26',
    year: '2026',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    downloadUrl: '#/downloads/sqp2026.pdf',
    markingSchemeUrl: '#/downloads/ms2026.pdf'
  },
  {
    id: 'sp-2025',
    title: 'CBSE Official Sample Question Paper 2024-25',
    year: '2025',
    fileSize: '1.1 MB',
    fileType: 'PDF',
    downloadUrl: '#/downloads/sqp2025.pdf',
    markingSchemeUrl: '#/downloads/ms2025.pdf'
  }
];

export const previousYearPapers = [
  {
    id: 'pyp-2025',
    title: 'CBSE Class XII CS Board Paper (All India)',
    year: '2025',
    fileSize: '950 KB',
    fileType: 'PDF',
    downloadUrl: '#/downloads/board2025.pdf'
  },
  {
    id: 'pyp-2024',
    title: 'CBSE Class XII CS Board Paper (Delhi Region)',
    year: '2024',
    fileSize: '890 KB',
    fileType: 'PDF',
    downloadUrl: '#/downloads/board2024.pdf'
  },
  {
    id: 'pyp-2023',
    title: 'CBSE Class XII CS Board Paper (All India)',
    year: '2023',
    fileSize: '1.0 MB',
    fileType: 'PDF',
    downloadUrl: '#/downloads/board2023.pdf'
  }
];

export const caseStudyQuestions = [
  {
    id: 'cs-1',
    title: 'Computer Networks - Setup Configuration',
    marks: '5 Marks',
    question: `
      <p><strong>Case Study Question:</strong></p>
      <p>Triveni Enterprises is planning to set up a new branch in Jaipur. The company has 4 main blocks/buildings: Admin, Accounts, Sales, and Support. The distance between these buildings and the number of computers are detailed below.</p>
      
      <p><strong>Distance between buildings:</strong></p>
      <ul>
        <li>Admin to Accounts: 50m</li>
        <li>Accounts to Sales: 150m</li>
        <li>Admin to Sales: 110m</li>
        <li>Sales to Support: 80m</li>
        <li>Admin to Support: 90m</li>
      </ul>
      
      <p><strong>Number of Computers in each block:</strong></p>
      <ul>
        <li>Admin: 110</li>
        <li>Accounts: 25</li>
        <li>Sales: 40</li>
        <li>Support: 15</li>
      </ul>
      
      <p><strong>Questions:</strong></p>
      <ol>
        <li>Suggest the layout of connections (cabling layout) between the buildings to configure the network cost-effectively.</li>
        <li>Suggest the building where the server should be installed with valid justification.</li>
        <li>Suggest the placement of the following devices with reasons: (a) Switch, (b) Repeater.</li>
        <li>The enterprise wants to connect their head office in Delhi to this Jaipur branch. Suggest a suitable wireless transmission media for this long-distance connection with high speed.</li>
      </ol>
    `,
    markingScheme: `
      <p><strong>Marking Scheme & Answers:</strong></p>
      <ol>
        <li><strong>Cabling Layout:</strong> Connect Admin to Accounts (50m), Admin to Support (90m), and Admin to Sales (110m). Total distance: 250m. (Cost-effective Star Topology).</li>
        <li><strong>Server placement:</strong> Server should be placed in the <strong>Admin Block</strong> because it houses the maximum number of computers (110 computers), minimizing overall network traffic and packet delays.</li>
        <li>
          <strong>Device Placement:</strong>
          <ul>
            <li><strong>Switch:</strong> Install in every block/building to aggregate local computers.</li>
            <li><strong>Repeater:</strong> Not strictly required since distances between connected blocks are below 100 meters (50m, 90m, 110m). If distance exceeds 100m, a repeater helps prevent signal loss.</li>
          </ul>
        </li>
        <li><strong>Long-distance Connection:</strong> <strong>Microwave</strong> or <strong>Satellite Link</strong>. Satellites are best for long-distance, high-bandwidth connections across cities/states.</li>
      </ol>
    `
  },
  {
    id: 'cs-2',
    title: 'MySQL - Relational Database Analysis',
    marks: '4 Marks',
    question: `
      <p><strong>Case Study Question:</strong></p>
      <p>Consider the table <strong>STORE</strong> in a relational database:</p>
      <table class="downloads-table" style="width: 100%; border: 1px solid var(--border-color); margin: 10px 0;">
        <thead>
          <tr>
            <th>ItemId</th>
            <th>ItemName</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>101</td>
            <td>Notebook</td>
            <td>45</td>
            <td>120</td>
            <td>Stationery</td>
          </tr>
          <tr>
            <td>102</td>
            <td>Gel Pen</td>
            <td>15</td>
            <td>250</td>
            <td>Stationery</td>
          </tr>
          <tr>
            <td>103</td>
            <td>Calculator</td>
            <td>350</td>
            <td>15</td>
            <td>Electronics</td>
          </tr>
          <tr>
            <td>104</td>
            <td>Desk Lamp</td>
            <td>450</td>
            <td>8</td>
            <td>Electronics</td>
          </tr>
        </tbody>
      </table>
      
      <p>Write SQL queries for the following requirements:</p>
      <ol>
        <li>Display the details of all items whose Price is between 15 and 300.</li>
        <li>Display the Category along with the total quantity of items in that category.</li>
        <li>Increase the price of all "Stationery" category items by 10%.</li>
        <li>Display ItemName in uppercase, sorted alphabetically.</li>
      </ol>
    `,
    markingScheme: `
      <p><strong>Marking Scheme & Answers:</strong></p>
      <ol>
        <li><code>SELECT * FROM STORE WHERE Price BETWEEN 15 AND 300;</code></li>
        <li><code>SELECT Category, SUM(Qty) FROM STORE GROUP BY Category;</code></li>
        <li><code>UPDATE STORE SET Price = Price * 1.10 WHERE Category = 'Stationery';</code></li>
        <li><code>SELECT UPPER(ItemName) FROM STORE ORDER BY ItemName ASC;</code></li>
      </ol>
    `
  }
];

export const competencyQuestions = [
  {
    id: 'comp-1',
    title: 'Random Module Function Mapping',
    marks: '2 Marks',
    question: `
      <p>What are the minimum and maximum values that can be generated by the following code snippet?</p>
      <pre>import random
values = [10, 20, 30, 40, 50]
index = random.randint(1, 3) + 1
print(values[index])</pre>
    `,
    markingScheme: `
      <p><strong>Answer & Explanation:</strong></p>
      <ul>
        <li><code>random.randint(1, 3)</code> generates random integers: 1, 2, or 3.</li>
        <li>Adding 1 yields the value range of <code>index</code>: (1+1) to (3+1) &rArr; <strong>2 to 4</strong>.</li>
        <li>Indices of values list map to:
          <ul>
            <li>values[2] = 30</li>
            <li>values[3] = 40</li>
            <li>values[4] = 50</li>
          </ul>
        </li>
        <li><strong>Minimum Value:</strong> 30</li>
        <li><strong>Maximum Value:</strong> 50</li>
      </ul>
    `
  }
];
