// CBSE Class XII Computer Science Quizzes Dataset

export const quizzes = [
  {
    id: 'quiz-python-basics',
    title: 'Python Basics & Revision Quiz',
    chapter: 'Class XI Revision',
    timeLimit: 120, // 2 minutes (in seconds)
    xpReward: 100,
    questions: [
      {
        q: 'Which of the following is an IMMUTABLE data type in Python?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        answer: 2, // Tuple
        explanation: 'Tuples, strings, and numbers are immutable in Python, meaning their values cannot be altered once created. Lists, dictionaries, and sets are mutable.'
      },
      {
        q: 'What is the output of values[-2:] if values = [10, 20, 30, 40, 50]?',
        options: ['[40, 50]', '[30, 40, 50]', '[10, 20]', '[30, 40]'],
        answer: 0, // [40, 50]
        explanation: 'Negative indexing starts from the end. values[-2] is 40. Slicing with [-2:] grabs everything from index -2 to the end of the list, producing [40, 50].'
      },
      {
        q: 'Which operator in Python is used for floor division?',
        options: ['/', '//', '%', '**'],
        answer: 1, // //
        explanation: 'The // operator performs floor division, which divides the numbers and rounds down the result to the nearest integer.'
      }
    ]
  },
  {
    id: 'quiz-functions',
    title: 'Working with Functions Quiz',
    chapter: 'Functions',
    timeLimit: 180, // 3 minutes
    xpReward: 120,
    questions: [
      {
        q: 'What error is raised if a function is called with fewer positional arguments than defined without defaults?',
        options: ['ValueError', 'TypeError', 'SyntaxError', 'NameError'],
        answer: 1, // TypeError
        explanation: 'Failing to supply required positional parameters results in a TypeError, as Python cannot map arguments to the parameters.'
      },
      {
        q: 'To modify a global variable inside a local function scope, which keyword is required?',
        options: ['global', 'local', 'def', 'extern'],
        answer: 0, // global
        explanation: 'The global keyword informs Python that you wish to refer to and modify the global instance of the variable rather than shadowing it with a local copy.'
      },
      {
        q: 'What will be the output of: def f(x, y=2): return x*y; print(f(y=3, x=4))?',
        options: ['8', '12', '6', 'TypeError'],
        answer: 1, // 12
        explanation: 'Here, we pass values using keyword arguments: x=4 and y=3. The function calculates x*y which is 4*3 = 12. The default value for y (2) is ignored.'
      }
    ]
  },
  {
    id: 'quiz-files',
    title: 'File Handling & Navigation Quiz',
    chapter: 'File Handling',
    timeLimit: 240, // 4 minutes
    xpReward: 150,
    questions: [
      {
        q: 'Which mode opens a text file for reading and writing, with cursor placed at the beginning of the file?',
        options: ["'r'", "'r+'", "'w+'", "'a+'"],
        answer: 1, // 'r+'
        explanation: "'r+' opens for reading and writing, keeping the cursor at the start. 'w+' also opens for both but truncates (deletes) existing content first. 'a+' places the cursor at the end."
      },
      {
        q: 'What function does the pickle module use to serialize a Python object into a binary file?',
        options: ['pickle.load()', 'pickle.write()', 'pickle.dump()', 'pickle.save()'],
        answer: 2, // pickle.dump()
        explanation: 'pickle.dump(obj, file) writes the serialized object stream to a file. pickle.load(file) reads it back.'
      },
      {
        q: 'Which index reference value in seek(offset, reference) represents relative seek from the end of the file?',
        options: ['0', '1', '2', '-1'],
        answer: 2, // 2
        explanation: 'In the seek method, reference 0 stands for the start of the file, 1 stands for the current position, and 2 stands for the end of the file.'
      }
    ]
  },
  {
    id: 'quiz-sql',
    title: 'MySQL Commands & Relational Queries',
    chapter: 'MySQL',
    timeLimit: 180, // 3 minutes
    xpReward: 150,
    questions: [
      {
        q: 'Which of the following is a DDL (Data Definition Language) command?',
        options: ['SELECT', 'INSERT', 'UPDATE', 'ALTER TABLE'],
        answer: 3, // ALTER TABLE
        explanation: 'DDL commands define or change schema structures. ALTER TABLE is DDL. SELECT, INSERT, and UPDATE are DML commands which manipulate records.'
      },
      {
        q: 'Which query is correct to find employees whose commission is not defined/empty?',
        options: [
          'SELECT * FROM EMP WHERE COMM = NULL;',
          'SELECT * FROM EMP WHERE COMM IS NULL;',
          'SELECT * FROM EMP WHERE COMM IS EMPTY;',
          'SELECT * FROM EMP WHERE COMM = EMPTY;'
        ],
        answer: 1, // IS NULL
        explanation: 'Null is a state representing missing data. In SQL, comparison operators like = or != do not work with NULL; we must use IS NULL or IS NOT NULL.'
      },
      {
        q: 'Which clause is used to filter groups created by the GROUP BY clause?',
        options: ['WHERE', 'HAVING', 'GROUP FILTER', 'LIKE'],
        answer: 1, // HAVING
        explanation: 'The WHERE clause filters individual rows before grouping, whereas the HAVING clause filters grouped sets after the GROUP BY execution.'
      }
    ]
  }
];
