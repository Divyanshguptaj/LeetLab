import { db } from "../libs/db.js";
import axios from "axios";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
const pistonLanguageMap = {
  63: { language: "javascript", version: "18.15.0" },
  71: { language: "python", version: "3.10.0" },
  62: { language: "java", version: "15.0.2" },
};

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
    const userId = req.user.id;

    // Validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    const detailedResults = [];
    let allPassed = true;

    // Run each test case on Piston
    for (let i = 0; i < stdin.length; i++) {
      const input = stdin[i];
      const expected_output = expected_outputs[i];

      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: pistonLanguageMap[language_id].language,  // e.g. "javascript"
        version: pistonLanguageMap[language_id].version,    // e.g. "18.15.0"
        files: [{ name: "Main", content: source_code }],
        stdin: input,
      });

      const runResult = response.data.run;

      const stdout = runResult.stdout?.trim() || "";
      const stderr = runResult.stderr || null;
      const passed = stdout === expected_output.trim();

      if (!passed) allPassed = false;

      detailedResults.push({
        testCase: i + 1,
        stdin: input,
        passed,
        stdout,
        expected: expected_output.trim(),
        stderr,
        compile_output: runResult.compile_output || null,
        status: runResult.code === 0 ? "Accepted" : "Error",
      });
    }

    const testsPassed = detailedResults.filter(r => r.passed).length;
    const totalTests = detailedResults.length;
    const status = allPassed ? "Accepted" : "Wrong Answer";

    res.status(200).json({
      success: true,
      message: "Code Executed Successfully!",
      submission: {
        status,
        testsPassed,
        totalTests,
        testCases: detailedResults,
      },
    });
  } catch (error) { 
    // console.error("Error executing code:", error.message);
    res.status(500).json({ error: "Failed to execute code" });
  }
};

export const submitCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;
    const userId = req.user.id;

    // Validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    // Get Piston language config
    const langConfig = pistonLanguageMap[language_id];
    if (!langConfig) {
      return res.status(400).json({ error: "Unsupported language ID" });
    }

    const detailedResults = [];
    let allPassed = true;
    let overallStatus = "Accepted";
    let firstErrorType = null;

    // Run all test cases (sequential)
    for (let i = 0; i < stdin.length; i++) {
      const input = stdin[i];
      const expected_output = expected_outputs[i];

      try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
          language: langConfig.language,
          version: langConfig.version,
          files: [{ name: "Main", content: source_code }],
          stdin: input,
        });

        const run = response.data.run;

        const stdout = run.stdout?.trim() || "";
        const stderr = run.stderr?.trim() || null;
        const compile_output = run.compile_output?.trim() || null;
        
        // Determine status and error type
        let status = "Accepted";
        let errorType = null;
        
        if (compile_output) {
          status = "Compilation Error";
          errorType = "compile";
          if (!firstErrorType) firstErrorType = "compile";
          allPassed = false;
        } else if (stderr) {
          status = "Runtime Error";
          errorType = "runtime";
          if (!firstErrorType) firstErrorType = "runtime";
          allPassed = false;
        } else if (run.code !== 0) {
          status = "Runtime Error";
          errorType = "runtime";
          if (!firstErrorType) firstErrorType = "runtime";
          allPassed = false;
        } else if (stdout !== expected_output.trim()) {
          status = "Wrong Answer";
          if (!firstErrorType) firstErrorType = "wrong_answer";
          allPassed = false;
        }

        const passed = status === "Accepted";

        // Enhanced error parsing for better display
        let enhancedError = null;
        if (stderr || compile_output) {
          const errorText = compile_output || stderr;
          enhancedError = parseErrorMessage(errorText, langConfig.language);
        }

        detailedResults.push({
          testCase: i + 1,
          stdin: input.trim(),
          passed,
          stdout,
          expected: expected_output.trim(),
          stderr: stderr,
          compile_output: compile_output,
          status,
          errorType,
          enhancedError,
          memory: run.memory ? `${run.memory} KB` : null,
          time: run.time ? `${run.time} s` : null,
          exitCode: run.code,
        });

        // Stop execution on first error (optional - like LeetCode)
        // if (!passed && (compile_output || stderr)) {
        //   break;
        // }

      } catch (axiosError) {
        console.error("Error executing code:", axiosError.message);
        
        detailedResults.push({
          testCase: i + 1,
          stdin: input.trim(),
          passed: false,
          stdout: "",
          expected: expected_output.trim(),
          stderr: `Execution failed: ${axiosError.message}`,
          compile_output: null,
          status: "System Error",
          errorType: "system",
          enhancedError: {
            type: "system",
            message: "Code execution service unavailable",
            line: null,
            column: null,
          },
          memory: null,
          time: null,
          exitCode: -1,
        });
        
        allPassed = false;
        if (!firstErrorType) firstErrorType = "system";
        break; // Stop on system errors
      }
    }

    // Determine overall status
    if (allPassed) {
      overallStatus = "Accepted";
    } else {
      switch (firstErrorType) {
        case "compile":
          overallStatus = "Compilation Error";
          break;
        case "runtime":
          overallStatus = "Runtime Error";
          break;
        case "wrong_answer":
          overallStatus = "Wrong Answer";
          break;
        case "system":
          overallStatus = "System Error";
          break;
        default:
          overallStatus = "Failed";
      }
    }

    // Save submission summary
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: langConfig.language,
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: overallStatus,
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
        testsPassed: detailedResults.filter(r => r.passed).length,
        totalTests: detailedResults.length,
      },
    });

    // If all passed, mark problem as solved
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: { userId, problemId },
        },
        update: {},
        create: {
          user: { connect: { id: userId } },
          problem: { connect: { id: problemId } },
        },
      });
    }// Save per-test results with enhanced error information
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      stdin: result.stdin,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      errorType: result.errorType,
      enhancedError: result.enhancedError ? JSON.stringify(result.enhancedError) : null,
      memory: result.memory,
      time: result.time,
      exitCode: result.exitCode,
    }));

    await db.testCaseResult.createMany({ data: testCaseResults });

    const submissionWithTestCase = await db.submission.findUnique({
      where: { id: submission.id },
      include: { testCases: true },
    });
    
    return res.status(200).json({
      success: true,
      message: allPassed ? "Code Submitted Successfully!" : `Submission completed with ${overallStatus}`,
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error submitting code:", error.message);
    res.status(500).json({ 
      error: "Failed to submit code",
      details: error.message 
    });
  }
};

// Helper function to parse error messages for better display
function parseErrorMessage(errorText, language) {
  if (!errorText) return null;

  const enhancedError = {
    type: "unknown",
    message: errorText,
    line: null,
    column: null,
    suggestion: null
  };

  try {
    switch (language.toLowerCase()) {
      case 'java':
        return parseJavaError(errorText, enhancedError);
      case 'python':
        return parsePythonError(errorText, enhancedError);
      case 'javascript':
        return parseJavaScriptError(errorText, enhancedError);
      default:
        return enhancedError;
    }
  } catch (e) {
    return enhancedError;
  }
}

function parseJavaError(errorText, enhancedError) {
  // Java compilation errors
  const javaCompilePattern = /Main\.java:(\d+):\s*error:\s*(.+)/;
  const match = errorText.match(javaCompilePattern);
  
  if (match) {
    enhancedError.type = "compilation";
    enhancedError.line = parseInt(match[1]);
    enhancedError.message = match[2];
    
    // Common Java error suggestions
    if (match[2].includes("cannot find symbol")) {
      enhancedError.suggestion = "Check variable names and method declarations. Make sure all variables are declared before use.";
    } else if (match[2].includes("';' expected")) {
      enhancedError.suggestion = "Missing semicolon. Check the line for missing ';' at the end of statements.";
    } else if (match[2].includes("class, interface, or enum expected")) {
      enhancedError.suggestion = "Check for misplaced brackets or incorrect class structure.";
    }
  }
  
  // Java runtime errors
  const runtimePatterns = [
    /Exception in thread "main" (.+?): (.+)/,
    /at Main\.(.+?)\(Main\.java:(\d+)\)/
  ];
  
  for (const pattern of runtimePatterns) {
    const runtimeMatch = errorText.match(pattern);
    if (runtimeMatch) {
      enhancedError.type = "runtime";
      if (runtimeMatch[3]) {
        enhancedError.line = parseInt(runtimeMatch[3]);
      }
      enhancedError.message = runtimeMatch[1] + ": " + runtimeMatch[2];
      
      if (runtimeMatch[1].includes("NullPointerException")) {
        enhancedError.suggestion = "Check for null values before using objects or calling methods.";
      } else if (runtimeMatch[1].includes("ArrayIndexOutOfBoundsException")) {
        enhancedError.suggestion = "Array index is out of bounds. Check your array access logic.";
      }
      break;
    }
  }
  
  return enhancedError;
}

function parsePythonError(errorText, enhancedError) {
  // Python syntax errors
  const syntaxPattern = /File "Main", line (\d+)[\s\S]*?(\w+Error): (.+)/;
  const match = errorText.match(syntaxPattern);
  
  if (match) {
    enhancedError.type = match[2].includes("Syntax") ? "syntax" : "runtime";
    enhancedError.line = parseInt(match[1]);
    enhancedError.message = `${match[2]}: ${match[3]}`;
    
    // Common Python error suggestions
    if (match[2] === "SyntaxError") {
      enhancedError.suggestion = "Check for missing colons, incorrect indentation, or mismatched brackets.";
    } else if (match[2] === "IndentationError") {
      enhancedError.suggestion = "Python requires consistent indentation. Check your spaces/tabs.";
    } else if (match[2] === "NameError") {
      enhancedError.suggestion = "Variable is not defined. Check spelling and make sure variables are declared before use.";
    } else if (match[2] === "IndexError") {
      enhancedError.suggestion = "List index out of range. Check your list access logic.";
    }
  }
  
  return enhancedError;
}

function parseJavaScriptError(errorText, enhancedError) {
  // JavaScript errors
  const jsPattern = /(.+?Error): (.+?)(\n|\r|$)/;
  const match = errorText.match(jsPattern);
  
  if (match) {
    enhancedError.type = "runtime";
    enhancedError.message = `${match[1]}: ${match[2]}`;
    
    // Common JavaScript error suggestions
    if (match[1] === "ReferenceError") {
      enhancedError.suggestion = "Variable is not defined. Check variable names and declarations.";
    } else if (match[1] === "TypeError") {
      enhancedError.suggestion = "Type mismatch or calling method on undefined/null. Check your data types.";
    } else if (match[1] === "SyntaxError") {
      enhancedError.suggestion = "Invalid syntax. Check brackets, semicolons, and function declarations.";
    }
  }
  
  return enhancedError;
}


// export const submitCode = async (req, res) => {
//   try {
//     const { source_code, language_id, stdin, expected_outputs, problemId } =
//       req.body;
//     const userId = req.user.id;

//     // Validate test cases
//     if (
//       !Array.isArray(stdin) ||
//       stdin.length === 0 ||
//       !Array.isArray(expected_outputs) ||
//       expected_outputs.length !== stdin.length
//     ) {
//       return res.status(400).json({ error: "Invalid or Missing test cases" });
//     }

//     // Reset detailedResults before submitting new code
//     const detailedResults = [];

//     // Prepare each test case for Judge0 batch submission
//     const submissions = stdin.map((input) => ({
//       source_code,
//       language_id,
//       stdin: input,
//     }));

//     // Send batch of submissions to Judge0
//     const submitResponse = await submitBatch(submissions);
//     const tokens = submitResponse.map((res) => res.token);

//     // Poll Judge0 for results of all submitted test cases
//     const results = await pollBatchResults(tokens);

//     // Analyze test case results
//     let allPassed = true;
//     results.forEach((result, i) => {
//       const stdout = result.stdout?.trim();
//       const expected_output = expected_outputs[i]?.trim();
//       const passed = stdout === expected_output;

//       if (!passed) allPassed = false;

//       detailedResults.push({
//         testCase: i + 1,
//         stdin: result.stdin?.trim(),
//         passed,
//         stdout,
//         expected: expected_output,
//         stderr: result.stderr || null,
//         compile_output: result.compile_output || null,
//         status: result.status.description,
//         memory: result.memory ? `${result.memory} KB` : undefined,
//         time: result.time ? `${result.time} s` : undefined,
//       });
//     });

//     // Store submission summary
//     const submission = await db.submission.create({
//       data: {
//         userId,
//         problemId,
//         sourceCode: source_code,
//         language: getLanguageName(language_id),
//         stdin: stdin.join("\n"),
//         stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
//         stderr: detailedResults.some((r) => r.stderr)
//           ? JSON.stringify(detailedResults.map((r) => r.stderr))
//           : null,
//         compileOutput: detailedResults.some((r) => r.compile_output)
//           ? JSON.stringify(detailedResults.map((r) => r.compile_output))
//           : null,
//         status: allPassed ? "Accepted" : "Wrong Answer",
//         memory: detailedResults.some((r) => r.memory)
//           ? JSON.stringify(detailedResults.map((r) => r.memory))
//           : null,
//         time: detailedResults.some((r) => r.time)
//           ? JSON.stringify(detailedResults.map((r) => r.time))
//           : null,
//       },
//     });

//     // If all test cases passed, mark problem as solved for the user
//     if (allPassed) {
//       await db.problemSolved.upsert({
//         where: {
//           userId_problemId: {
//             userId,
//             problemId,
//           },
//         },
//         update: {},
//         create: {
//           userId,
//           problemId,
//         },
//       });
//     }

//     // Save individual test case results using detailedResults
//     const testCaseResults = detailedResults.map((result) => ({
//       submissionId: submission.id,
//       testCase: result.testCase,
//       passed: result.passed,
//       stdout: result.stdout,
//       expected: result.expected,
//       stderr: result.stderr,
//       compileOutput: result.compile_output,
//       status: result.status,
//       memory: result.memory,
//       time: result.time,
//     }));

//     await db.testCaseResult.createMany({
//       data: testCaseResults,
//     });

//     const submissionWithTestCase = await db.submission.findUnique({
//       where: {
//         id: submission.id,
//       },
//       include: {
//         testCases: true,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Code Submitted Successfully!",
//       submission: submissionWithTestCase,
//     });
//   } catch (error) {
//     console.error("Error submitting code:", error.message);
//     res.status(500).json({ error: "Failed to submit code" });
//   }
// };