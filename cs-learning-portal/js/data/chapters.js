// CBSE Class XII Computer Science Study Materials Chapter Notes Data

export const chapters = [
  {
    id: 'ch-xi-rev',
    title: 'Class XI Python Revision',
    category: 'Class XI Revision',
    readingTime: '15 mins',
    summary: 'A fast-paced review of core Python topics covered in Class XI, including variables, data types, control flow, loops, strings, lists, tuples, and dictionaries.',
    content: `
      <h3>Introduction to Python Basics</h3>
      <p>Python is a high-level, interpreted, interactive and object-oriented scripting language. Let's quickly review the vital blocks from Class XI.</p>
      
      <h3>Data Types in Python</h3>
      <p>Python has standard data types to store data in variables:</p>
      <ul>
        <li><strong>Numbers:</strong> <code>int</code>, <code>float</code>, <code>complex</code>.</li>
        <li><strong>Sequence:</strong> <code>str</code> (string), <code>list</code>, <code>tuple</code>.</li>
        <li><strong>Mapping:</strong> <code>dict</code> (dictionary).</li>
        <li><strong>None:</strong> Represents empty values.</li>
        <li><strong>Set:</strong> Unordered collection of unique items.</li>
      </ul>

      <h3>Mutability vs Immutability</h3>
      <p>This is a favorite CBSE board concept:</p>
      <ul>
        <li><strong>Mutable types</strong> can have their values modified in-place. Example: <code>list</code>, <code>dict</code>, <code>set</code>.</li>
        <li><strong>Immutable types</strong> cannot change their value once created. Example: <code>int</code>, <code>float</code>, <code>str</code>, <code>tuple</code>.</li>
      </ul>
      
      <pre># Mutable Demonstration
my_list = [10, 20, 30]
my_list[1] = 99  # Valid! my_list is now [10, 99, 30]

# Immutable Demonstration
my_tuple = (10, 20, 30)
my_tuple[1] = 99 # Raises TypeError!</pre>

      <h3>Conditional Flow & Iteration</h3>
      <p>Python relies on indentation for nesting. Loops are written as <code>for</code> and <code>while</code> statements:</p>
      <pre># Finding sum of even numbers in a list
numbers = [1, 2, 3, 4, 5, 6]
sum_evens = 0
for num in numbers:
    if num % 2 == 0:
        sum_evens += num
print("Sum of evens:", sum_evens) # Output: 12</pre>

      <h3>String and List Operations</h3>
      <p>Remember that indexing starts at <code>0</code> and negative indexing starts at <code>-1</code> from the end. Slicing formula: <code>list[start:stop:step]</code>.</p>
      <pre>text = "CBSE Board 2026"
print(text[-4:])  # Output: 2026
print(text[0:4])   # Output: CBSE</pre>
    `
  },
  {
    id: 'ch-functions',
    title: 'Working with Functions',
    category: 'Functions',
    readingTime: '12 mins',
    summary: 'Mastering functions in Python: user-defined functions, parameter passing (positional, default, keyword), scope of variables (local vs global), and libraries.',
    content: `
      <h3>What is a Function?</h3>
      <p>A function is a named block of organized, reusable code that is used to perform a single, related action. Functions provide better modularity for your application and a high degree of code reusing.</p>
      
      <h3>Defining and Calling a Function</h3>
      <p>We use the keyword <code>def</code> followed by the function name and parentheses containing parameters.</p>
      <pre>def greet(name):
    """Docstring explaining the function"""
    return "Hello " + name + "!"

# Function call
message = greet("Class XII")
print(message)  # Output: Hello Class XII!</pre>

      <h3>Types of Arguments in Python</h3>
      <p>Python supports multiple argument passing protocols during function execution:</p>
      <ol>
        <li><strong>Positional Arguments:</strong> Arguments passed in correct positional order.</li>
        <li><strong>Default Arguments:</strong> Parameters that take a default value if no argument is passed during call.</li>
        <li><strong>Keyword Arguments:</strong> Caller identifies arguments by parameter name.</li>
      </ol>
      <pre># Default Argument Example
def calculate_interest(principal, rate=0.08, time=1):
    return principal * rate * time

print(calculate_interest(10000))          # rate=0.08, time=1
print(calculate_interest(10000, 0.10, 2))  # overriding defaults
print(calculate_interest(time=3, principal=5000)) # Keyword arguments</pre>

      <h3>Scope of Variables (Local vs Global)</h3>
      <p>A variable defined inside a function has a <strong>Local Scope</strong>, whereas a variable defined outside has a <strong>Global Scope</strong>.</p>
      <p>To modify a global variable inside a function, we must explicitly declare it with the <code>global</code> keyword.</p>
      <pre>x = 10  # Global variable

def update_val():
    global x
    x = 20  # Modifies global x

update_val()
print(x) # Output: 20</pre>
    `
  },
  {
    id: 'ch-exception',
    title: 'Exception Handling',
    category: 'Exception Handling',
    readingTime: '8 mins',
    summary: 'Learn how to handle runtime errors gracefully in Python using try, except, else, and finally blocks, along with assertions.',
    content: `
      <h3>Introduction to Exceptions</h3>
      <p>An exception is an event, which occurs during the execution of a program, that disrupts the normal flow of the program's instructions. When a Python script encounters a situation that it cannot cope with, it raises an exception.</p>
      
      <h3>The try-except Block</h3>
      <p>We wrap risky operations inside a <code>try</code> block. If an error occurs, control shifts to the matched <code>except</code> block.</p>
      <pre>try:
    num1 = int(input("Enter number: "))
    num2 = int(input("Enter divisor: "))
    result = num1 / num2
    print("Result:", result)
except ZeroDivisionError:
    print("Error: Cannot divide by zero!")
except ValueError:
    print("Error: Please enter integers only!")</pre>

      <h3>Else and Finally Clauses</h3>
      <ul>
        <li><strong>else:</strong> Executes only if no exception is raised in the <code>try</code> block.</li>
        <li><strong>finally:</strong> Always executes, regardless of whether an exception occurred or was handled. Often used for cleanup tasks like closing files.</li>
      </ul>
      <pre>try:
    f = open("data.txt", "r")
except FileNotFoundError:
    print("File not found!")
else:
    print(f.read())
    f.close()
finally:
    print("Resource allocation complete.")</pre>
    `
  },
  {
    id: 'ch-file-handling',
    title: 'File Handling in Python',
    category: 'File Handling',
    readingTime: '20 mins',
    summary: 'Detailed explanation of Text files, Binary files (using pickle module), and CSV files (using csv module) with open, read, write, and seek operations.',
    content: `
      <h3>File Types in CBSE Class XII</h3>
      <p>You need to study three primary categories of files in Python:</p>
      <ol>
        <li><strong>Text Files:</strong> Human-readable characters (terminated by EOL/newline).</li>
        <li><strong>Binary Files:</strong> Raw bytes representing objects like lists or dicts (utilizes <code>pickle</code> serialization).</li>
        <li><strong>CSV Files:</strong> Comma-separated values representing spreadsheets (utilizes <code>csv</code> reader/writer).</li>
      </ol>

      <h3>1. Text File Operations</h3>
      <p>Modes: <code>'r'</code> (read), <code>'w'</code> (write/overwrite), <code>'a'</code> (append).</p>
      <pre># Writing to a text file
with open("student.txt", "w") as file:
    file.write("Anoop,XII,A\\n")
    file.write("Divya,XII,B\\n")

# Reading from a text file
with open("student.txt", "r") as file:
    lines = file.readlines()
    for line in lines:
        print(line.strip())</pre>

      <h3>2. Binary Files (Pickle Module)</h3>
      <p>We use <code>pickle.dump(obj, file)</code> to write and <code>pickle.load(file)</code> to read objects.</p>
      <pre>import pickle

# Serializing a dictionary object
data = {"roll": 1, "name": "Abhishek", "marks": 95}
with open("marks.dat", "wb") as f:
    pickle.dump(data, f)

# Deserializing
with open("marks.dat", "rb") as f:
    student = pickle.load(f)
    print(student["name"]) # Output: Abhishek</pre>

      <h3>3. CSV Files</h3>
      <p>Uses <code>csv.writer()</code> and <code>csv.reader()</code> blocks.</p>
      <pre>import csv

# Writing to CSV
with open("grades.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Roll", "Subject", "Grade"])
    writer.writerow([1, "Computer Science", "A1"])

# Reading from CSV
with open("grades.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row) # Output: ['Roll', 'Subject', 'Grade']</pre>

      <h3>File Navigation: seek() and tell()</h3>
      <ul>
        <li><code>tell()</code> returns the current cursor position in bytes.</li>
        <li><code>seek(offset, reference)</code> repositions the cursor. Reference values: 0 (start), 1 (current), 2 (end).</li>
      </ul>
    `
  },
  {
    id: 'ch-mysql',
    title: 'MySQL & Databases',
    category: 'MySQL',
    readingTime: '18 mins',
    summary: 'Learn Relational Database concepts, Structured Query Language (SQL), DDL vs DML commands, constraints, aggregate functions, and Python-MySQL Connectivity.',
    content: `
      <h3>Database Concepts</h3>
      <p>A database is an organized collection of data. A Relational Database Management System (RDBMS) stores data in tables (relations) consisting of rows (tuples) and columns (attributes).</p>
      
      <h3>Key Concepts</h3>
      <ul>
        <li><strong>Primary Key:</strong> Unique attribute identifying each tuple in a table. Cannot contain Null.</li>
        <li><strong>Candidate Key:</strong> Minimal set of attributes that can uniquely identify tuples.</li>
        <li><strong>Foreign Key:</strong> An attribute referencing the primary key of another table to maintain referential integrity.</li>
      </ul>

      <h3>SQL Commands Classifications</h3>
      <ul>
        <li><strong>DDL (Data Definition Language):</strong> Alters table structures. Commands: <code>CREATE TABLE</code>, <code>ALTER TABLE</code>, <code>DROP TABLE</code>.</li>
        <li><strong>DML (Data Manipulation Language):</strong> Manages data values. Commands: <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>, <code>SELECT</code>.</li>
      </ul>

      <h3>Essential SELECT Queries</h3>
      <pre>-- Filter and order students
SELECT name, marks FROM student 
WHERE marks >= 90 AND section = 'A'
ORDER BY marks DESC;

-- Group by and aggregate functions (SUM, AVG, COUNT, MIN, MAX)
SELECT section, COUNT(*), AVG(marks) 
FROM student 
GROUP BY section
HAVING COUNT(*) > 5;</pre>

      <h3>Python-MySQL Connectivity</h3>
      <p>Using the <code>mysql.connector</code> package to execute SQL scripts from Python:</p>
      <pre>import mysql.connector

# Establish Connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="school"
)

cursor = conn.cursor()
cursor.execute("SELECT * FROM student")
records = cursor.fetchall()
for row in records:
    print(row)

conn.close()</pre>
    `
  },
  {
    id: 'ch-networks',
    title: 'Computer Networks',
    category: 'Computer Networks',
    readingTime: '15 mins',
    summary: 'Introduction to networking, transmission media, network topologies, network devices (hub, switch, router, gateway), internet protocols, and cybersecurity.',
    content: `
      <h3>Types of Networks</h3>
      <ul>
        <li><strong>PAN:</strong> Personal Area Network (Bluetooth - range ~10m).</li>
        <li><strong>LAN:</strong> Local Area Network (School campus - range ~1km).</li>
        <li><strong>MAN:</strong> Metropolitan Area Network (Across a city - range ~50km).</li>
        <li><strong>WAN:</strong> Wide Area Network (Global/Internet).</li>
      </ul>

      <h3>Transmission Media</h3>
      <p>Guided (Wired) vs Unguided (Wireless):</p>
      <ul>
        <li><strong>Twisted Pair Cable:</strong> Standard LAN cabling. Vulnerable to noise.</li>
        <li><strong>Coaxial Cable:</strong> Cable TV networks. Higher bandwidth.</li>
        <li><strong>Optical Fiber:</strong> Transmits data as light pulses. Speed of light, zero noise, high cost.</li>
        <li><strong>Wireless:</strong> Radio waves, Micro waves, Infrared waves.</li>
      </ul>

      <h3>Topologies</h3>
      <p>Geometric arrangement of nodes:</p>
      <ul>
        <li><strong>Star:</strong> Central switch connects all nodes. Easy to set up, but if switch fails, entire network crashes.</li>
        <li><strong>Bus:</strong> Single main backbone cable. Cheap, but cable failure downs everything.</li>
        <li><strong>Tree:</strong> Hierarchical combination of star and bus. Highly scalable.</li>
      </ul>

      <h3>Key Network Devices</h3>
      <ul>
        <li><strong>Switch:</strong> Intelligent local device forwarding packets to specific target MAC addresses.</li>
        <li><strong>Router:</strong> Forwards packets between different networks (routes traffic).</li>
        <li><strong>Gateway:</strong> Interface connecting two completely different network protocol systems.</li>
      </ul>

      <h3>Network Protocols</h3>
      <p>HTTP, HTTPS, TCP/IP, SMTP, POP3, FTP, VoIP.</p>
    `
  },
  {
    id: 'ch-rev-notes',
    title: 'Quick Revision Notes',
    category: 'Revision Notes',
    readingTime: '10 mins',
    summary: 'The ultimate board-exam cheat sheet. Quick tables, direct formulas, standard functions definitions, and syntax structures for last-minute CBSE preparation.',
    content: `
      <h3>Board Exam Cheat Sheet</h3>
      <p>Keep these formulas and standard codes at the tip of your fingers before entering the exam hall.</p>
      
      <h3>File Mode Quick Reference</h3>
      <table class="downloads-table" style="width: 100%; border: 1px solid var(--border-color); margin-top: 10px;">
        <thead>
          <tr>
            <th>Mode</th>
            <th>Type</th>
            <th>Cursor Position</th>
            <th>Behavior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>'r' / 'rb'</code></td>
            <td>Read</td>
            <td>Beginning</td>
            <td>Fails if file does not exist.</td>
          </tr>
          <tr>
            <td><code>'w' / 'wb'</code></td>
            <td>Write</td>
            <td>Beginning</td>
            <td>Creates if missing. Overwrites if present.</td>
          </tr>
          <tr>
            <td><code>'a' / 'ab'</code></td>
            <td>Append</td>
            <td>End</td>
            <td>Creates if missing. Preserves data, appends at end.</td>
          </tr>
        </tbody>
      </table>

      <h3>Stack Implementation Blueprint (Standard 4-Marker Question)</h3>
      <pre># Standard implementation of List-based LIFO Stack
stack = []

def push(item):
    stack.append(item)
    print("Item pushed successfully.")

def pop():
    if len(stack) == 0:
        return "Underflow"
    else:
        return stack.pop()

def peek():
    if len(stack) == 0:
        return "Underflow"
    return stack[-1]</pre>

      <h3>Must-Know SQL Queries</h3>
      <ul>
        <li>Check for Null: <code>SELECT * FROM emp WHERE commission IS NULL;</code> (Never use <code>= NULL</code>)</li>
        <li>Pattern Match: <code>SELECT * FROM emp WHERE name LIKE 'A%';</code> (Matches starting with A)</li>
        <li>Aggregates count: <code>COUNT(*)</code> counts all rows, <code>COUNT(comm)</code> counts only non-null values of commission column.</li>
      </ul>
    `
  }
];
