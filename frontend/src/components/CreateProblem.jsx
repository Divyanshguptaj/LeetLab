
import { Plus, Trash2, Code2, FileText, CheckCircle2, Download } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState, useCallback } from "react";
import  axiosInstance  from "../utils/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BookOpen,Lightbulb } from "lucide-react";

const sampleTwoSumData = {
  title: "Two Sum",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  difficulty: "EASY",
  tags: ["Array", "Hash Table"],
  constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
  hints:
    "Use a hash map to store numbers you have seen and their indices as you iterate through the array.",
  editorial:
    "Iterate through the array while keeping a hash map of seen numbers. For each element, check if target - nums[i] exists in the map; if yes, return their indices.",
  testcases: [
    {
      input: "4\n2 7 11 15\n9",
      output: "[0,1]",
    },
    {
      input: "3\n3 2 4\n6",
      output: "[1,2]",
    },
    {
      input: "2\n3 3\n6",
      output: "[0,1]",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    PYTHON: {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
    JAVA: {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
}

// ---- Piston-friendly stdin parsing ----
const fs = require('fs');
const raw = fs.readFileSync(0, 'utf8').trim();

// Handle various formats: 3 lines or space-separated
const tokens = raw
  .replace(/[\\[\\],]/g, ' ')
  .split(/\\s+/)
  .filter(Boolean);

if (tokens.length < 3) {
  console.error('Invalid input');
  process.exit(1);
}

// First token = n, next n = nums, last = target
const n = parseInt(tokens[0], 10);
const nums = tokens.slice(1, 1 + n).map(Number);
const target = parseInt(tokens[1 + n], 10);

const result = twoSum(nums, target);
process.stdout.write(JSON.stringify(result));`,

    PYTHON: `class Solution:
  def twoSum(self, nums, target):
      # Write your solution here

# Input parsing
if __name__ == "__main__":
  import sys
  data = sys.stdin.read().strip().split()
  n = int(data[0])
  nums = list(map(int, data[1:1+n]))
  target = int(data[1+n])
  sol = Solution()
  print(sol.twoSum(nums, target))`,

    JAVA: `import java.util.*;

class Main {
  public int[] twoSum(int[] nums, int target) {
      // Write your solution here
  }

  public static void main(String[] args) {
      Scanner sc = new Scanner(System.in);
      int n = Integer.parseInt(sc.nextLine().trim());
      int[] nums = Arrays.stream(sc.nextLine().trim().split(" "))
                         .mapToInt(Integer::parseInt)
                         .toArray();
      int target = Integer.parseInt(sc.nextLine().trim());
      Main main = new Main();
      int[] result = main.twoSum(nums, target);
      System.out.println(Arrays.toString(result));
      sc.close();
  }
}` },
  referenceSolutions: {
    JAVASCRIPT: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
}`,
    PYTHON: `class Solution:
  def twoSum(self, nums, target):
      hashmap = {}
      for i, num in enumerate(nums):
          diff = target - num
          if diff in hashmap:
              return [hashmap[diff], i]
          hashmap[num] = i`,
    JAVA: `import java.util.*;

class Main {
  public int[] twoSum(int[] nums, int target) {
      Map<Integer, Integer> map = new HashMap<>();
      for (int i = 0; i < nums.length; i++) {
          int complement = target - nums[i];
          if (map.containsKey(complement)) {
              return new int[]{map.get(complement), i};
          }
          map.put(nums[i], i);
      }
      return new int[]{};
  }
}` },
};

const sampledpData = {
    title: "Climbing Stairs",
    description:
        "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    tags: ["Dynamic Programming", "Math", "Memoization"],
    constraints: "1 <= n <= 45",
    hints:
        "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
    editorial:
        "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
    testcases: [
        {
            input: "2",
            output: "2",
        },
        {
            input: "3",
            output: "3",
        },
        {
            input: "4",
            output: "5",
        },
    ],
    examples: {
        JAVASCRIPT: {
            input: "n = 2",
            output: "2",
            explanation:
                "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
        },
        PYTHON: {
            input: "n = 3",
            output: "3",
            explanation:
                "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
        },
        JAVA: {
            input: "n = 4",
            output: "5",
            explanation:
                "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
        },
    },
    codeSnippets: {
        JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
        PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
        JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
    },
    referenceSolutions: {
        JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
        PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
        JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
    },
};

const sampleStringProblem = {
    title: "Valid Palindrome",
    description:
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
    difficulty: "EASY",
    tags: ["String", "Two Pointers"],
    constraints:
        "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
    hints:
        "Consider using two pointers, one from the start and one from the end, moving towards the center.",
    editorial:
        "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
    testcases: [
        {
            input: "A man, a plan, a canal: Panama",
            output: "true",
        },
        {
            input: "race a car",
            output: "false",
        },
        {
            input: " ",
            output: "true",
        },
    ],
    examples: {
        JAVASCRIPT: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        PYTHON: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        JAVA: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
    },
    codeSnippets: {
        JAVASCRIPT: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Write your code here
}
 
// Add readline for dynamic input handling
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
 
// Process input line
rl.on('line', (line) => {
  // Call solution with the input string
  const result = isPalindrome(line);
  
  // Output the result
  console.log(result ? "true" : "false");
  rl.close();
});`,
        PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Write your code here
        pass
 
# Input parsing
if __name__ == "__main__":
    import sys
    # Read the input string
    s = sys.stdin.readline().strip()
    
    # Call solution
    sol = Solution()
    result = sol.isPalindrome(s)
    
    # Output result
    print(str(result).lower())  # Convert True/False to lowercase true/false`,
        JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
    },
    referenceSolutions: {
        JAVASCRIPT: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Convert to lowercase and remove non-alphanumeric characters
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Check if it's a palindrome
  let left = 0;
  let right = s.length - 1;
  
  while (left < right) {
    if (s[left] !== s[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}
 
// Add readline for dynamic input handling
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
 
// Process input line
rl.on('line', (line) => {
  // Call solution with the input string
  const result = isPalindrome(line);
  
  // Output the result
  console.log(result ? "true" : "false");
  rl.close();
});`,
        PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Convert to lowercase and keep only alphanumeric characters
        filtered_chars = [c.lower() for c in s if c.isalnum()]
        
        # Check if it's a palindrome
        return filtered_chars == filtered_chars[::-1]
 
# Input parsing
if __name__ == "__main__":
    import sys
    # Read the input string
    s = sys.stdin.readline().strip()
    
    # Call solution
    sol = Solution()
    result = sol.isPalindrome(s)
    
    # Output result
    print(str(result).lower())  # Convert True/False to lowercase true/false`,
        JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
    },
};

const CreateProblemForm = () => {
    const navigate = useNavigate();

   
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "EASY",
        tags: [""],
        constraints: "",
        hints: "",
        editorial: "",
        testcases: [{ input: "", output: "" }],
        examples: {
            JAVASCRIPT: { input: "", output: "", explanation: "" },
            PYTHON: { input: "", output: "", explanation: "" },
            JAVA: { input: "", output: "", explanation: "" },
        },
        codeSnippets: {
            JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
            PYTHON: "def solution():\n    # Write your code here\n    pass",
            JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
        },
        referenceSolutions: {
            JAVASCRIPT: "// Add your reference solution here",
            PYTHON: "# Add your reference solution here",
            JAVA: "// Add your reference solution here",
        },
    });

    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [sampleType, setSampleType] = useState("DP"); 

   
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
        }
    }, [errors]);

   
    const handleExampleChange = useCallback((lang, field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            examples: {
                ...prevData.examples,
                [lang]: {
                    ...prevData.examples[lang],
                    [field]: value,
                },
            },
        }));
        // Clear error
        const errorKey = `examples.${lang}.${field}`;
        if (errors[errorKey]) {
            setErrors((prevErrors) => ({ ...prevErrors, [errorKey]: undefined }));
        }
    }, [errors]);

    
    const handleTagChange = useCallback((index, value) => {
        const newTags = [...formData.tags];
        newTags[index] = value;
        setFormData((prevData) => ({
            ...prevData,
            tags: newTags,
        }));
        // Clear error for the specific tag or general tags error
        if (errors[`tags.${index}`] || errors.tags) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[`tags.${index}`];
                if (newTags.filter(tag => tag.trim() !== '').length === 0) { // Check if all tags are empty
                    newErrors.tags = "At least one tag is required";
                } else {
                     delete newErrors.tags;
                }
                return newErrors;
            });
        }
    }, [formData.tags, errors]);

   
    const handleTestCaseChange = useCallback((index, field, value) => {
        const newTestCases = [...formData.testcases];
        newTestCases[index] = {
            ...newTestCases[index],
            [field]: value,
        };
        setFormData((prevData) => ({
            ...prevData,
            testcases: newTestCases,
        }));
        // Clear error
        const errorKey = `testCases.${index}.${field}`;
        if (errors[errorKey]) {
            setErrors((prevErrors) => ({ ...prevErrors, [errorKey]: undefined }));
        }
    }, [formData.testcases, errors]);

    
    const handleEditorChange = useCallback((language, type, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [type]: {
                ...prevData[type],
                [language]: value || "", // Monaco returns undefined if content is cleared
            },
        }));
        // Clear error
        const errorKey = `${type}.${language}`;
        if (errors[errorKey]) {
            setErrors((prevErrors) => ({ ...prevErrors, [errorKey]: undefined }));
        }
    }, [errors]);

    const addTag = useCallback(() => {
        setFormData((prevData) => ({
            ...prevData,
            tags: [...prevData.tags, ""],
        }));
    }, []);

    const removeTag = useCallback((index) => {
        setFormData((prevData) => {
            const newTags = prevData.tags.filter((_, i) => i !== index);
            if (newTags.length === 0) {
                // Ensure at least one tag field exists
                return { ...prevData, tags: [""] };
            }
            return { ...prevData, tags: newTags };
        });
    }, []);

    const addTestCase = useCallback(() => {
        setFormData((prevData) => ({
            ...prevData,
            testcases: [...prevData.testcases, { input: "", output: "" }],
        }));
    }, []);

    const removeTestCase = useCallback((index) => {
        setFormData((prevData) => {
            const newTestCases = prevData.testcases.filter((_, i) => i !== index);
            if (newTestCases.length === 0) {
                // Ensure at least one test case exists
                return { ...prevData, testCases: [{ input: "", output: "" }] };
            }
            return { ...prevData, testCases: newTestCases };
        });
    }, []);

    
    const validateForm = useCallback(() => {
        let newErrors = {};

        if (!formData.title || formData.title.length < 3) {
            newErrors.title = "Title must be at least 3 characters";
        }
        if (!formData.description || formData.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters";
        }
        if (!["EASY", "MEDIUM", "HARD"].includes(formData.difficulty)) {
            newErrors.difficulty = "Invalid difficulty selected";
        }

        const filteredTags = formData.tags.filter(tag => tag.trim() !== '');
        if (filteredTags.length === 0) {
            newErrors.tags = "At least one tag is required";
        } else {
             // Validate individual tags if they exist
            formData.tags.forEach((tag, index) => {
                if (tag.trim().length < 1) {
                    newErrors[`tags.${index}`] = "Tag cannot be empty";
                }
            });
        }


        if (!formData.constraints || formData.constraints.length < 1) {
            newErrors.constraints = "Constraints are required";
        }

        if (formData.testcases.length === 0 || formData.testcases.some(tc => !tc.input || !tc.output)) {
            newErrors.testcases = "At least one test case is required, and all its fields must be filled.";
            formData.testcases.forEach((tc, index) => {
                if (!tc.input) newErrors[`testCases.${index}.input`] = "Input is required";
                if (!tc.output) newErrors[`testCases.${index}.output`] = "Output is required";
            });
        }

        // Validate code snippets and examples
        const languages = ["JAVASCRIPT", "PYTHON", "JAVA"];
        languages.forEach(lang => {
            if (!formData.codeSnippets[lang] || formData.codeSnippets[lang].length < 1) {
                newErrors[`codeSnippets.${lang}`] = `${lang} code snippet is required`;
            }
            if (!formData.referenceSolutions[lang] || formData.referenceSolutions[lang].length < 1) {
                newErrors[`referenceSolutions.${lang}`] = `${lang} reference solution is required`;
            }
            if (!formData.examples[lang].input || formData.examples[lang].input.length < 1) {
                newErrors[`examples.${lang}.input`] = `${lang} example input is required`;
            }
            if (!formData.examples[lang].output || formData.examples[lang].output.length < 1) {
                newErrors[`examples.${lang}.output`] = `${lang} example output is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const onSubmit = async (e) => {
        e.preventDefault(); 
        const isValid = validateForm();

        if (!isValid) {
            toast.error("Please correct the errors in the form.");
            
            const firstErrorElement = document.querySelector('.label-text-alt.text-error');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        try {
            setIsLoading(true);
            const dataToSend = {
                ...formData,
                tags: formData.tags.filter(tag => tag.trim() !== ''), // Ensure only non-empty tags are sent
            };
            const res = await axiosInstance.post("/problems/create-problem", dataToSend);

            console.log(res.data);
            toast.success(res.data.message);
            navigate("/");
        } catch (error) {
            console.error("Error creating problem", error);
            toast.error("Error creating problem: " + (error.response?.data?.message || "Something went wrong."));
        } finally {
            setIsLoading(false);
        }
    };

    
    const loadSampleData = useCallback(() => {
        const sampleData =
            sampleType === "DP" ? sampledpData : sampleType === "string" ? sampleStringProblem : sampleTwoSumData;

        setFormData({
            ...sampleData,
        });
        setErrors({});
    }, [sampleType]);


    

    return (
        <div className="container w-screen justify-center items-center">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b border-base-300">
                        <h2 className="card-title text-2xl md:text-3xl flex items-center gap-3 text-primary">
                            <FileText className="w-6 h-6 md:w-8 md:h-8" />
                            Create Problem
                        </h2>

                        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                            <div className="join">
                                <button
                                    type="button"
                                    className={`btn join-item ${
                                        sampleType === "two-sum" ? "btn-active btn-primary" : "btn-outline"
                                    }`}
                                    onClick={() => setSampleType("two-sum")}
                                >
                                    Two Sum
                                </button>
                                <button
                                    type="button"
                                    className={`btn join-item ${
                                        sampleType === "DP" ? "btn-active btn-primary" : "btn-outline"
                                    }`}
                                    onClick={() => setSampleType("DP")}
                                >
                                    DP Problem
                                </button>
                                <button
                                    type="button"
                                    className={`btn join-item ${
                                        sampleType === "string" ? "btn-active btn-primary" : "btn-outline"
                                    }`}
                                    onClick={() => setSampleType("string")}
                                >
                                    String Problem
                                </button>
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary gap-2"
                                onClick={loadSampleData}
                            >
                                <Download className="w-4 h-4" />
                                Load Sample Data
                            </button>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">
                                        Title
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input input-bordered w-full text-base md:text-lg ${errors.title ? 'input-error' : ''}`}
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter problem title"
                                />
                                {errors.title && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.title}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">
                                        Description
                                    </span>
                                </label>
                                <textarea
                                    className={`textarea textarea-bordered min-h-32 w-full text-base md:text-lg p-4 resize-y ${errors.description ? 'textarea-error' : ''}`}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter problem description"
                                />
                                {errors.description && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.description}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">
                                        Difficulty
                                    </span>
                                </label>
                                <select
                                    className={`select select-bordered w-full text-base md:text-lg ${errors.difficulty ? 'select-error' : ''}`}
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                >
                                    <option value="EASY">Easy</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HARD">Hard</option>
                                </select>
                                {errors.difficulty && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.difficulty}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">
                                        Constraints
                                    </span>
                                </label>
                                <textarea
                                    className={`textarea textarea-bordered min-h-20 w-full p-3 resize-y ${errors.constraints ? 'textarea-error' : ''}`}
                                    name="constraints"
                                    value={formData.constraints}
                                    onChange={handleChange}
                                    placeholder="Enter constraints (e.g., 1 <= n <= 100)"
                                />
                                {errors.constraints && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.constraints}
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="card bg-base-200 p-4 md:p-6 shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Tags
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={addTag}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Tag
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {formData.tags.map((tag, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            className={`input input-bordered flex-1 ${errors[`tags.${index}`] ? 'input-error' : ''}`}
                                            value={tag}
                                            onChange={(e) => handleTagChange(index, e.target.value)}
                                            placeholder="Enter tag"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-square btn-sm"
                                            onClick={() => removeTag(index)}
                                            disabled={formData.tags.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4 text-error" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.tags && (
                                <div className="mt-2">
                                    <span className="text-error text-sm">
                                        {errors.tags}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Hints */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base md:text-lg font-semibold flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5" />
                                    Hints (Optional)
                                </span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered min-h-24 w-full text-base md:text-lg p-4 resize-y"
                                name="hints"
                                value={formData.hints}
                                onChange={handleChange}
                                placeholder="Provide hints for the problem"
                            />
                        </div>

                        {/* Editorial */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base md:text-lg font-semibold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Editorial (Optional)
                                </span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered min-h-32 w-full text-base md:text-lg p-4 resize-y"
                                name="editorial"
                                value={formData.editorial}
                                onChange={handleChange}
                                placeholder="Provide a detailed editorial or solution explanation"
                            />
                        </div>

                        {/* Test Cases */}
                        <div className="card bg-base-200 p-4 md:p-6 shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Test Cases
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={addTestCase}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Test Case
                                </button>
                            </div>
                            <div className="space-y-6">
                                {formData.testcases.map((testCase, index) => (
                                    <div key={index} className="card bg-base-100 shadow-md">
                                        <div className="card-body p-4 md:p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-base md:text-lg font-semibold">
                                                    Test Case #{index + 1}
                                                </h4>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm text-error"
                                                    onClick={() => removeTestCase(index)}
                                                    disabled={formData.testcases.length === 1}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">
                                                            Input
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y ${errors[`testCases.${index}.input`] ? 'textarea-error' : ''}`}
                                                        value={testCase.input}
                                                        onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                                                        placeholder="Enter test case input"
                                                    />
                                                    {errors[`testCases.${index}.input`] && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors[`testCases.${index}.input`]}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">
                                                            Expected Output
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        className={`textarea textarea-bordered min-h-24 w-full p-3 resize-y ${errors[`testCases.${index}.output`] ? 'textarea-error' : ''}`}
                                                        value={testCase.output}
                                                        onChange={(e) => handleTestCaseChange(index, "output", e.target.value)}
                                                        placeholder="Enter expected output"
                                                    />
                                                    {errors[`testCases.${index}.output`] && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors[`testCases.${index}.output`]}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.testCases && typeof errors.testCases === 'string' && (
                                <div className="mt-2">
                                    <span className="text-error text-sm">
                                        {errors.testCases}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Code Editor Sections */}
                        <div className="space-y-8">
                            {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
                                <div
                                    key={language}
                                    className="card bg-base-200 p-4 md:p-6 shadow-md"
                                >
                                    <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                                        <Code2 className="w-5 h-5" />
                                        {language}
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Starter Code */}
                                        <div className="card bg-base-100 shadow-md">
                                            <div className="card-body p-4 md:p-6">
                                                <h4 className="font-semibold text-base md:text-lg mb-4">
                                                    Starter Code Template
                                                </h4>
                                                <div className={`border rounded-md overflow-hidden ${errors[`codeSnippets.${language}`] ? 'border-error' : ''}`}>
                                                    <Editor
                                                        height="300px"
                                                        language={language.toLowerCase()}
                                                        theme="vs-dark"
                                                        value={formData.codeSnippets[language]}
                                                        onChange={(value) => handleEditorChange(language, "codeSnippets", value)}
                                                        options={{
                                                            minimap: { enabled: false },
                                                            fontSize: 14,
                                                            lineNumbers: "on",
                                                            roundedSelection: false,
                                                            scrollBeyondLastLine: false,
                                                            automaticLayout: true,
                                                        }}
                                                    />
                                                </div>
                                                {errors[`codeSnippets.${language}`] && (
                                                    <div className="mt-2">
                                                        <span className="text-error text-sm">
                                                            {errors[`codeSnippets.${language}`]}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Reference Solution */}
                                        <div className="card bg-base-100 shadow-md">
                                            <div className="card-body p-4 md:p-6">
                                                <h4 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
                                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                                    Reference Solution
                                                </h4>
                                                <div className={`border rounded-md overflow-hidden ${errors[`referenceSolutions.${language}`] ? 'border-error' : ''}`}>
                                                    <Editor
                                                        height="300px"
                                                        language={language.toLowerCase()}
                                                        theme="vs-dark"
                                                        value={formData.referenceSolutions[language]}
                                                        onChange={(value) => handleEditorChange(language, "referenceSolutions", value)}
                                                        options={{
                                                            minimap: { enabled: false },
                                                            fontSize: 14,
                                                            lineNumbers: "on",
                                                            roundedSelection: false,
                                                            scrollBeyondLastLine: false,
                                                            automaticLayout: true,
                                                        }}
                                                    />
                                                </div>
                                                {errors[`referenceSolutions.${language}`] && (
                                                    <div className="mt-2">
                                                        <span className="text-error text-sm">
                                                            {errors[`referenceSolutions.${language}`]}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Examples */}
                                        <div className="card bg-base-100 shadow-md">
                                            <div className="card-body p-4 md:p-6">
                                                <h4 className="font-semibold text-base md:text-lg mb-4">
                                                    Example
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">
                                                                Input
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            className={`textarea textarea-bordered min-h-20 w-full p-3 resize-y ${errors[`examples.${language}.input`] ? 'textarea-error' : ''}`}
                                                            value={formData.examples[language].input}
                                                            onChange={(e) => handleExampleChange(language, "input", e.target.value)}
                                                            placeholder="Example input"
                                                        />
                                                        {errors[`examples.${language}.input`] && (
                                                            <label className="label">
                                                                <span className="label-text-alt text-error">
                                                                    {errors[`examples.${language}.input`]}
                                                                </span>
                                                            </label>
                                                        )}
                                                    </div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">
                                                                Output
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            className={`textarea textarea-bordered min-h-20 w-full p-3 resize-y ${errors[`examples.${language}.output`] ? 'textarea-error' : ''}`}
                                                            value={formData.examples[language].output}
                                                            onChange={(e) => handleExampleChange(language, "output", e.target.value)}
                                                            placeholder="Example output"
                                                        />
                                                        {errors[`examples.${language}.output`] && (
                                                            <label className="label">
                                                                <span className="label-text-alt text-error">
                                                                    {errors[`examples.${language}.output`]}
                                                                </span>
                                                            </label>
                                                        )}
                                                    </div>
                                                    <div className="form-control md:col-span-2">
                                                        <label className="label">
                                                            <span className="label-text font-medium">
                                                                Explanation (Optional)
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                                            value={formData.examples[language].explanation}
                                                            onChange={(e) => handleExampleChange(language, "explanation", e.target.value)}
                                                            placeholder="Explanation for the example"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="form-control mt-10">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Create Problem
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProblemForm;
