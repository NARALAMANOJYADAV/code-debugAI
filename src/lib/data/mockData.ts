export interface Example {
  id: number;
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptanceRate: string;
  companies: string[];
  description: string;
  constraints: string[];
  examples: Example[];
  editorial: string;
  codeTemplates: {
    [key: string]: string;
  };
}

export const mockProblems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    acceptanceRate: '49.8%',
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
    
You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        id: 1,
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        id: 2,
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    editorial: `An efficient approach is to use a Hash Map. We iterate through the array and store each element's value and index. For each element, we check if its complement (target - current_value) is already present in the map. If it is, we have found a pair and return their indices. Time complexity: O(N), Space complexity: O(N).`,
    codeTemplates: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your Python code here\n    pass`,
      javascript: `function twoSum(nums, target) {\n    // Write your JavaScript code here\n    return [];\n}`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Write your C++ code here\n        return {};\n    }\n};`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your Java code here\n        return new int[0];\n    }\n}`
    }
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    acceptanceRate: '41.2%',
    companies: ['Meta', 'Netflix', 'Google', 'Apple'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 <= s.length <= 10^4',
      "s consists of parentheses only: '()[]{}'"
    ],
    examples: [
      {
        id: 1,
        input: 's = "()"',
        output: 'true'
      },
      {
        id: 2,
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        id: 3,
        input: 's = "(]"',
        output: 'false'
      }
    ],
    editorial: `Use a stack data structure. Iterate through each character in the string. If it is an opening bracket, push it onto the stack. If it is a closing bracket, check if the stack is not empty and the top of the stack matches the matching opening bracket. If it matches, pop it. Otherwise, return false. At the end, if stack is empty, return true. Time complexity: O(N), Space complexity: O(N).`,
    codeTemplates: {
      python: `def isValid(s: str) -> bool:\n    # Write Python code here\n    pass`,
      javascript: `function isValid(s) {\n    // Write JavaScript code here\n    return false;\n}`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    bool isValid(std::string s) {\n        // Write C++ code here\n        return false;\n    }\n};`
    }
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    acceptanceRate: '33.8%',
    companies: ['Amazon', 'Google', 'Adobe', 'Uber'],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    examples: [
      {
        id: 1,
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        id: 2,
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    editorial: `Use the sliding window technique with a hash map/set. Maintain a window defined by two pointers, \`left\` and \`right\`. As you slide \`right\` to the right, store indices of characters. If a duplicate is found, shrink the window by moving \`left\` to the right of the previous occurrence. Keep track of the maximum length of window. Time: O(N), Space: O(min(M, N)) where M is alphabet size.`,
    codeTemplates: {
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    # Write Python code here\n    pass`,
      javascript: `function lengthOfLongestSubstring(s) {\n    // Write JavaScript code here\n    return 0;\n}`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(std::string s) {\n        return 0;\n    }\n};`
    }
  },
  {
    id: 4,
    title: '3Sum',
    difficulty: 'Medium',
    category: 'Arrays',
    acceptanceRate: '32.1%',
    companies: ['Facebook', 'Google', 'Amazon'],
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    examples: [
      {
        id: 1,
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'The distinct triplets are [-1,0,1] and [-1,-1,2].'
      }
    ],
    editorial: `Sort the array first. Loop through the array, selecting a fixed element \`nums[i]\`. Use two pointers (\`left = i + 1\`, \`right = len - 1\`) to find pairs that sum to \`-nums[i]\`. Skip duplicates for the fixed element and two-pointer increments to ensure unique triplets. Time: O(N^2), Space: O(log N) or O(N) depending on sorting implementation.`,
    codeTemplates: {
      python: `def threeSum(nums: list[int]) -> list[list[int]]:\n    # Write Python code here\n    pass`
    }
  },
  {
    id: 5,
    title: 'Edit Distance',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    acceptanceRate: '52.4%',
    companies: ['Google', 'Microsoft', 'Oracle'],
    description: `Given two strings \`word1\` and \`word2\`, return *the minimum number of operations required to convert \`word1\` to \`word2\`*.

You have the following three operations permitted on a word:
- Insert a character
- Delete a character
- Replace a character`,
    constraints: [
      '0 <= word1.length, word2.length <= 500',
      'word1 and word2 consist of lowercase English letters.'
    ],
    examples: [
      {
        id: 1,
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation: 'horse -> rorse (replace), rorse -> rose (remove), rose -> ros (remove)'
      }
    ],
    editorial: `Define dp[i][j] as the edit distance between word1[0...i-1] and word2[0...j-1]. If word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1]. Otherwise, dp[i][j] = 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)). Time: O(M * N), Space: O(M * N).`,
    codeTemplates: {
      python: `def minDistance(word1: str, word2: str) -> int:\n    # Write Python code here\n    pass`
    }
  }
];

export interface RoadmapNode {
  id: string;
  label: string;
  status: 'locked' | 'unlocked' | 'completed';
  description: string;
  resources: string[];
  codeSnippet?: string;
}

export interface RoadmapTrack {
  id: string;
  title: string;
  description: string;
  nodes: RoadmapNode[];
}

export const mockRoadmaps: RoadmapTrack[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Master HTML, CSS, JavaScript, React, and Next.js modern patterns.',
    nodes: [
      {
        id: 'fe-1',
        label: 'Internet & Web Basics',
        status: 'completed',
        description: 'Understand domain names, hosting, HTTP/HTTPS protocols, DNS records, and how browser rendering works.',
        resources: ['MDN Web Docs - How the Web Works', 'Google Web Dev Fundamentals']
      },
      {
        id: 'fe-2',
        label: 'HTML5 & Semantic Markup',
        status: 'completed',
        description: 'Semantic HTML layout tags (<article>, <section>, <nav>), accessibility guidelines (ARIA), SEO tags, and forms.',
        resources: ['MDN HTML basics', 'W3C Web Accessibility guidelines']
      },
      {
        id: 'fe-3',
        label: 'CSS3, Layouts & Responsiveness',
        status: 'unlocked',
        description: 'Flexbox layouts, CSS Grids, custom properties (CSS variables), responsive typography, media queries, and transition animations.',
        resources: ['CSS-Tricks Flexbox Guide', 'A Complete Guide to Grid by CSS-Tricks'],
        codeSnippet: `:root {\n  --brand-color: #06b6d4;\n}\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n}`
      },
      {
        id: 'fe-4',
        label: 'Modern JavaScript (ES6+)',
        status: 'unlocked',
        description: 'Promises, Async/Await, Array methods (map, filter, reduce), closures, lexical scope, destructuring, and module imports.',
        resources: ['JavaScript Info', 'Eloquent JavaScript Book']
      },
      {
        id: 'fe-5',
        label: 'React & Component Architecture',
        status: 'locked',
        description: 'State management (useState, useReducer), side effects (useEffect), React context API, custom hooks, and reconciliation process.',
        resources: ['React Official Docs', 'Beta React documentation guides']
      },
      {
        id: 'fe-6',
        label: 'Next.js App Router & Performance',
        status: 'locked',
        description: 'Server Components vs Client Components, static site generation (SSG), server-side rendering (SSR), dynamic prefetching, image optimizations, and search engine optimization.',
        resources: ['Next.js App Router Tutorials', 'Vercel Deployment Best Practices']
      }
    ]
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    description: 'Learn Node.js, Express, databases, caching, system design, and API security.',
    nodes: [
      {
        id: 'be-1',
        label: 'Node.js & Command Line Utilities',
        status: 'completed',
        description: 'Asynchronous event loops, file streams, path modules, processing process arguments, and package manager basics (NPM/PNPM/Yarn).',
        resources: ['Node.js Official Documentation', 'Node.js Design Patterns']
      },
      {
        id: 'be-2',
        label: 'Express.js & REST API Design',
        status: 'unlocked',
        description: 'Creating HTTP routing endpoints, middleware pipelines, error handling handlers, body parsers, validation schemas, and rate-limiting.',
        resources: ['Express.js Guide', 'RESTful API Design Best Practices'],
        codeSnippet: `const express = require('express');\nconst app = express();\n\napp.use(express.json());\napp.get('/api/v1/health', (req, res) => {\n  res.status(200).json({ status: 'OK' });\n});`
      },
      {
        id: 'be-3',
        label: 'Relational Databases & SQL',
        status: 'locked',
        description: 'PostgreSQL architecture, schema designs, primary/foreign keys, joins, indexes, transaction isolations, and connection poolings.',
        resources: ['PostgreSQL Tutorial', 'SQL Bolt Interactive Course']
      },
      {
        id: 'be-4',
        label: 'Caching with Redis & Queue Workers',
        status: 'locked',
        description: 'Key-value caches, publish-subscribe queues, token rate limit implementations, distributed locks, and message brokers.',
        resources: ['Redis University Guides', 'BullMQ Queue Workflows']
      }
    ]
  },
  {
    id: 'ai-ml',
    title: 'AI / Machine Learning',
    description: 'Master Python libraries, Linear Algebra, Deep Learning, Transformers, and LLMs.',
    nodes: [
      {
        id: 'ai-1',
        label: 'Python Data Science Libraries',
        status: 'completed',
        description: 'NumPy vectorized math, Pandas dataframes manipulation, Matplotlib/Seaborn visualization plots.',
        resources: ['Pandas 10 Minutes Guide', 'NumPy Tutorials']
      },
      {
        id: 'ai-2',
        label: 'Supervised Learning Algorithms',
        status: 'unlocked',
        description: 'Linear/Logistic regression, support vector machines (SVM), decision trees, random forests, and gradient boosting (XGBoost).',
        resources: ['Scikit-Learn user guide', 'StatQuest Machine Learning playlist']
      },
      {
        id: 'ai-3',
        label: 'Deep Learning & Neural Networks',
        status: 'locked',
        description: 'Backpropagation, feedforward networks, convolutional layers (CNNs), recurrent nets (RNNs/LSTMs), and PyTorch tensors.',
        resources: ['PyTorch Foundations', 'Deep Learning Specialization by Andrew Ng']
      },
      {
        id: 'ai-4',
        label: 'Transformers, Embeddings & RAG',
        status: 'locked',
        description: 'Attention mechanisms, Vector Databases (Pinecone/Chroma), Semantic searches, Prompt engineering, and Retrieval-Augmented Generation.',
        resources: ['Hugging Face NLP Course', 'LangChain Documentation Guides']
      }
    ]
  }
];

export interface Contest {
  id: number;
  title: string;
  status: 'Upcoming' | 'Active' | 'Past';
  startTime: string;
  duration: string;
  registeredUsers: number;
}

export const mockContests: Contest[] = [
  {
    id: 101,
    title: 'Weekly Cyber Code Clash #42',
    status: 'Active',
    startTime: 'Started 15 mins ago',
    duration: '2 Hours',
    registeredUsers: 2450
  },
  {
    id: 102,
    title: 'Monthly Algorithm Masters #12',
    status: 'Upcoming',
    startTime: 'July 24, 2026, 20:00',
    duration: '3 Hours',
    registeredUsers: 4890
  },
  {
    id: 103,
    title: 'CodeBug Beginner Blitz #5',
    status: 'Upcoming',
    startTime: 'July 26, 2026, 18:00',
    duration: '1.5 Hours',
    registeredUsers: 890
  },
  {
    id: 104,
    title: 'Grand System Design Championship',
    status: 'Past',
    startTime: 'July 18, 2026',
    duration: '4 Hours',
    registeredUsers: 3410
  }
];

export interface DiscussionThread {
  id: number;
  title: string;
  author: string;
  votes: number;
  answers: number;
  tags: string[];
  solved: boolean;
  replies: {
    author: string;
    content: string;
    votes: number;
    isAccepted?: boolean;
  }[];
}

export const mockDiscussions: DiscussionThread[] = [
  {
    id: 201,
    title: 'Why do I get a Segmentation Fault (Core Dumped) in my recursive C++ DFS code?',
    author: 'dev_ninja_99',
    votes: 45,
    answers: 3,
    tags: ['C++', 'Graphs', 'Recursion'],
    solved: true,
    replies: [
      {
        author: 'compiler_wizard',
        content: 'This usually occurs when your recursion depth exceeds the stack limit. Check your visited base case configuration in DFS, or switch to an iterative approach using std::stack.',
        votes: 18,
        isAccepted: true
      },
      {
        author: 'debugger_sam',
        content: 'Also make sure you aren\'t passing large vectors by value. Pass them by reference e.g., `vector<int>& visited` to avoid extra memory allocation on the call stack.',
        votes: 12
      }
    ]
  },
  {
    id: 202,
    title: 'Is there an O(1) space solution for finding duplicates in an array values [1, n]?',
    author: 'coder_bee',
    votes: 32,
    answers: 1,
    tags: ['Arrays', 'Math'],
    solved: false,
    replies: [
      {
        author: 'algo_expert',
        content: 'Yes, you can use the array elements as indices and negate the values at those indices. If you visit a value that is already negative, its index is a duplicate. This works since the values are bounded inside [1, n].',
        votes: 21
      }
    ]
  }
];

export interface InterviewQ {
  id: number;
  company: string;
  role: string;
  type: 'Technical' | 'System Design' | 'Behavioral';
  question: string;
  answerSummary: string;
}

export const mockInterviewQuestions: InterviewQ[] = [
  {
    id: 301,
    company: 'Google',
    role: 'Senior Software Engineer',
    type: 'System Design',
    question: 'How would you design a real-time multiplayer gaming leaderboard with low-latency and millions of active players?',
    answerSummary: 'Use Redis Sorted Sets (ZADD/ZREVRANGE) for instant ranking. Distribute load using hash-ring partitioning across multiple Redis clusters, buffer write volumes using Kafka queues, and push leaderboard revisions to users via WebSockets.'
  },
  {
    id: 302,
    company: 'Meta',
    role: 'Software Engineer II',
    type: 'Technical',
    question: 'Design an algorithm to find the lowest common ancestor (LCA) of a binary tree where nodes have parent pointers.',
    answerSummary: 'Since node instances contain parent pointers, you can traverse up to the root from node A and store path nodes in a set. Then traverse up from node B until you hit a node already present in the set. Time Complexity: O(H), Space: O(H).'
  },
  {
    id: 303,
    company: 'Amazon',
    role: 'Software Development Engineer',
    type: 'Behavioral',
    question: 'Tell me about a time when you had to work with an extremely tight deadline and compromised code quality.',
    answerSummary: 'Frame the answer using the STAR method: Describe the feature, why the deadline was critical, how you scoped a clean compromise (e.g. basic unit testing, skip premium assets), launched successfully, and subsequently scheduled refactoring cards to settle code debt.'
  }
];
