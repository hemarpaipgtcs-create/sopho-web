// CBSE Class XII Computer Science Practical Lab Data

export const programs = [
  {
    id: 'pr-bubble-sort',
    title: 'Bubble Sort Algorithm',
    category: 'Python Programs',
    difficulty: 'Easy',
    description: 'Write a Python program to sort a list of numbers using the Bubble Sort algorithm.',
    code: `def bubble_sort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        # Last i elements are already in place
        for j in range(0, n-i-1):
            # Traverse the array from 0 to n-i-1
            # Swap if the element found is greater than the next element
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Test list
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original List:", numbers)
sorted_numbers = bubble_sort(numbers)
print("Sorted List:  ", sorted_numbers)
`
  },
  {
    id: 'pr-text-file',
    title: 'Text File Word Counter',
    category: 'Python Programs',
    difficulty: 'Medium',
    description: 'Write a Python script that reads a text file and counts the total number of words starting with the letter "A" or "a".',
    code: `import os

# Create sample text file
with open("sample.txt", "w") as f:
    f.write("Apple banana Apricot apple tree. An intelligent student learns computer science.")

def count_words(filename):
    count = 0
    if not os.path.exists(filename):
        print("File doesn't exist.")
        return 0
        
    with open(filename, "r") as file:
        data = file.read()
        words = data.split()
        for word in words:
            # Clean symbols from words
            cleaned_word = word.strip(".,!?").lower()
            if cleaned_word.startswith('a'):
                count += 1
    return count

total = count_words("sample.txt")
print("Total words starting with A/a:", total)
# Clean up
if os.path.exists("sample.txt"):
    os.remove("sample.txt")
`
  },
  {
    id: 'pr-binary-file',
    title: 'Binary File Search',
    category: 'Python Programs',
    difficulty: 'Hard',
    description: 'Write a program to insert student records (roll, name, marks) into a binary file student.dat and search for a roll number entered by the user.',
    code: `import pickle
import os

# Write records to binary file
def write_records():
    students = [
        {"roll": 1, "name": "Aditya", "marks": 85},
        {"roll": 2, "name": "Bhavya", "marks": 94},
        {"roll": 3, "name": "Chetan", "marks": 78}
    ]
    with open("student.dat", "wb") as f:
        for s in students:
            pickle.dump(s, f)
    print("Dummy records created successfully.")

# Search in binary file
def search_roll(roll_no):
    found = False
    if not os.path.exists("student.dat"):
        print("Database file missing.")
        return
        
    with open("student.dat", "rb") as f:
        try:
            while True:
                student = pickle.load(f)
                if student["roll"] == roll_no:
                    print("Record Found!")
                    print(f"Name: {student['name']}, Marks: {student['marks']}")
                    found = True
                    break
        except EOFError:
            pass # End of File reached
            
    if not found:
        print("Student record not found.")

# Main flow
write_records()
search_roll(2)
# Clean up
if os.path.exists("student.dat"):
    os.remove("student.dat")
`
  },
  {
    id: 'pr-stack',
    title: 'LIFO Stack implementation',
    category: 'Python Programs',
    difficulty: 'Medium',
    description: 'Create a LIFO stack in Python using list structure to implement push, pop, and display operations for student names.',
    code: `def push_stack(stk, name):
    stk.append(name)
    print(f"Pushed '{name}' to stack.")

def pop_stack(stk):
    if len(stk) == 0:
        return "Underflow"
    return stk.pop()

def display_stack(stk):
    if len(stk) == 0:
        print("Stack is Empty.")
        return
    print("--- Stack Status (Top First) ---")
    for i in range(len(stk)-1, -1, -1):
        print(f"| {stk[i]} |")
    print("--------------------------------")

# Test Run
my_stack = []
push_stack(my_stack, "Arjun")
push_stack(my_stack, "Bobby")
push_stack(my_stack, "Charu")
display_stack(my_stack)

popped = pop_stack(my_stack)
print("Popped item:", popped)
display_stack(my_stack)
`
  }
];

export const outputQuestions = [
  {
    id: 'op-1',
    title: 'Loop and Range Slicing',
    question: `What will be the output of the following Python code?
\`\`\`python
s = "Welcome"
for i in range(1, len(s), 2):
    print(s[i], end="#")
\`\`\`
`,
    options: ['e#l#o#e', 'e#c#m#', 'W#l#o#e', 'e#l#o#'],
    answer: 'e#c#m#',
    explanation: `The length of the string "Welcome" is 7.
range(1, 7, 2) generates index values: 1, 3, and 5.
Indices mapping:
s[1] = 'e'
s[3] = 'c'
s[5] = 'm'
With end="#", the characters are printed adjacent, resulting in: e#c#m#`
  },
  {
    id: 'op-2',
    title: 'Mutable Default Arguments',
    question: `What will be the output of the following Python code?
\`\`\`python
def append_item(val, list_arg=[]):
    list_arg.append(val)
    return list_arg

print(append_item(10), end=" & ")
print(append_item(20))
\`\`\`
`,
    options: ['[10] & [20]', '[10] & [10, 20]', '[10, 20] & [20]', '[10] & [10]'],
    answer: '[10] & [10, 20]',
    explanation: `In Python, default arguments are evaluated once when the function is defined.
If the argument is mutable (like a list), the same list object is shared across subsequent calls that rely on the default values.
First print appends 10 to default list: [10].
Second print appends 20 to the SAME default list: [10, 20].`
  }
];

export const debuggingQuestions = [
  {
    id: 'dbg-1',
    title: 'File Reading Bug',
    description: 'Find and fix the 3 errors in this function which counts lines starting with "T".',
    buggyCode: `def countlines():
    f = open("data.txt", 'r')
    lines = f.readline()  # Error 1
    count = 0
    for line in lines:
        if line[0] = 'T': # Error 2
            count++        # Error 3
    print("Count:", count)
    f.close()`,
    solution: `Correct version of the code:
\`\`\`python
def countlines():
    f = open("data.txt", 'r')
    lines = f.readlines()  # FIX 1: readlines() to get a list of lines, not just first line
    count = 0
    for line in lines:
        if len(line) > 0 and line[0] == 'T': # FIX 2: use comparison ==, check length
            count += 1                       # FIX 3: python doesn't support ++
    print("Count:", count)
    f.close()
\`\`\`
`
  }
];

export const practicalFiles = {
  details: `
    <h3>CBSE CS Practical File Outline</h3>
    <p>Every Class XII CBSE Computer Science student is required to submit a practical file containing at least <strong>20 Python programs</strong>, <strong>5 SQL command sets</strong>, and <strong>2 Python-database integrated programs</strong>.</p>
    
    <h3>Evaluation Guidelines (Total Marks: 30)</h3>
    <table class="downloads-table" style="width:100%; border: 1px solid var(--border-color);">
      <thead>
        <tr>
          <th>Evaluation Parameter</th>
          <th>Marks Allocated</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Lab Test (Python program + SQL Queries)</td>
          <td>12 Marks</td>
        </tr>
        <tr>
          <td>Report File + Student Project</td>
          <td>7 Marks</td>
        </tr>
        <tr>
          <td>Project Showcase / Presentation</td>
          <td>8 Marks</td>
        </tr>
        <tr>
          <td>Viva Voce (Oral Test)</td>
          <td>3 Marks</td>
        </tr>
      </tbody>
    </table>
  `
};

export const vivaQuestions = [
  {
    q: 'What is the purpose of the pickling module in Python binary files?',
    a: 'Pickling is the process of converting a Python object hierarchy (like a list, dictionary, or tuple) into a byte stream so it can be saved to a binary file. Unpickling is the inverse operation, converting a byte stream back into Python objects.'
  },
  {
    q: 'What is the difference between tell() and seek() methods?',
    a: 'tell() returns the current position of the file pointer (cursor) in terms of bytes from the beginning. seek(offset, reference) changes the file pointer position to the specified offset relative to the reference point (0 for start, 1 for current, 2 for end).'
  },
  {
    q: 'What does a Cursor object do in Python-database connectivity?',
    a: 'A cursor is a database controller object used to execute SQL queries. It manages the context of the query and fetches row results returned from the database using fetchone(), fetchall(), or fetchmany().'
  },
  {
    q: 'Why do we need to call connection.commit() when modifying SQL records?',
    a: 'commit() is required to save changes (like INSERT, UPDATE, or DELETE) permanently to the database table. By default, changes are not saved automatically until committed, maintaining transaction integrity.'
  },
  {
    q: 'What is the default argument in a Python function?',
    a: 'Default arguments are parameters that take a default value specified in the function signature if no value is passed for that parameter during the function call.'
  }
];
