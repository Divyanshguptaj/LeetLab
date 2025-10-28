import { useParams, Link } from 'react-router-dom';
import useProblemStore from '../store/problemStore';
import { useEffect, useState } from 'react';
import { ArrowDown, ChevronLeft, Play, Send, X } from "lucide-react";
import Editor from '@monaco-editor/react';
import {languageMap,languageId} from '../utils/constants.js'
import useExecuteCode from '../store/codeExecuteStore.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SubmissionResults from '../components/SubmissionResults.jsx';
import SubmissionsList from '../components/SubmissionList.jsx';
import useSubmissionStore from '../store/submissionStore.js';
import RunCodeResults from '../components/RunCodeResults.jsx';
import SubmitCodeResults from '../components/SubmitCodeResults.jsx';


const ProblemPage = () => {
  const { id } = useParams();
  const languages = ["JAVA", "PYTHON", "JAVASCRIPT"];
  const [language, setLanguage] = useState('JAVASCRIPT');

  const { isCodeExecuting, submission, executeCodeFun, submitCodeFun, isCodeSubmitting, clearSubmission } = useExecuteCode();
  const { problem, isProblemLoading, getProblemById } = useProblemStore();
  const { isLoading: isSubmissionsLoading, submission: submissions, getSubmissionForProblem } = useSubmissionStore();

  const [activeTab, setActiveTab] = useState("description");
  const [code, setCode] = useState(""); 
  const [testCaseInput, setTestCaseInput] = useState(""); 
  const [testCaseOutput, setTestCaseOutput] = useState(""); 
  const [submissionsLoaded, setSubmissionsLoaded] = useState(false);
  const [resultType, setResultType] = useState(null); // 'run' | 'submit' | null

  const case1 = () => {
    setTestCaseInput(problem?.testcases?.[0]?.input || "");
    setTestCaseOutput(problem?.testcases?.[0]?.output || "");
  }

  const case2 = () => {
    setTestCaseInput(problem?.testcases?.[1]?.input || "");
    setTestCaseOutput(problem?.testcases?.[1]?.output || "");
  }

  const case3 = () => {
    setTestCaseInput(problem?.testcases?.[2]?.input || "");
    setTestCaseOutput(problem?.testcases?.[2]?.output || "");
  }

  // Set initial test case when problem loads
  useEffect(() => {
    if (problem?.testcases?.[0]) {
      setTestCaseInput(problem.testcases[0].input || "");
      setTestCaseOutput(problem.testcases[0].output || "");
    }
  }, [problem]);

  // Set code when problem or language changes
  useEffect(() => {
    if (problem && language) {
      const starter = problem.codeSnippets?.[language] || "";
      setCode(starter);
    }
  }, [problem, language]);

  // Calculate badge type
  let badgeType = "error";
  if (problem && problem.difficulty) {
    const difficulty = problem?.difficulty.toLowerCase();
    badgeType = difficulty === "easy"
      ? "success"
      : difficulty === "medium"
        ? "warning"
        : "error";
  }

  // Load problem data
  useEffect(() => {
    if (!problem || problem.id !== id) {
      getProblemById(id);
    }
  }, [id, getProblemById, problem]);

  // Load submissions only when switching to submissions tab and not already loaded
  useEffect(() => {
    if (activeTab === "submissions" && id && !submissionsLoaded) {
      getSubmissionForProblem(id);
      setSubmissionsLoaded(true);
    }
  }, [activeTab, id, getSubmissionForProblem, submissionsLoaded]);

  if (isProblemLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-900">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = languageId[language];
      const stdin = problem?.testcases.map((tc) => tc.input);
      const expected_outputs = problem?.testcases.map((tc) => tc.output);
      setResultType('run');
      executeCodeFun(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  }

  const handleSubmitCode = (e) => {
    e.preventDefault();
    try {
      const language_id = languageId[language];
      const stdin = problem?.testcases.map((tc) => tc.input);
      const expected_outputs = problem?.testcases.map((tc) => tc.output);
      setResultType('submit');
      submitCodeFun(code, language_id, stdin, expected_outputs, id);
      // Refresh submissions after successful submit
      setSubmissionsLoaded(false);
    } catch (error) {
      console.log("Error submitting code", error);
    }
  }

  const handleClearResults = () => {
    clearSubmission();
    setResultType(null);
  }

  return (
    <div className='p-6 min-h-screen bg-gray-900 text-gray-100 font-sans'>
      {/* TOP DIV */}
      <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-700'>
        <Link to="/problems" className='flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200'>
          <ChevronLeft className='w-5 h-5' />
          Back to Problems
        </Link>
        <div className='flex gap-3'> 
          <button 
            onClick={handleRunCode}
            className={`px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 shadow-md flex items-center justify-center gap-2
            ${isCodeExecuting ? 'opacity-75 cursor-not-allowed animate-pulse' : ''}`}
            disabled={isCodeExecuting}
          >
            {!isCodeExecuting && <Play className='w-4 h-4' />}
            {isCodeExecuting ? 'Running...' : 'Run Code'}
          </button>

          <button 
            onClick={handleSubmitCode}
            className={`px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md flex items-center justify-center gap-2
            ${isCodeSubmitting ? 'opacity-75 cursor-not-allowed animate-pulse' : ''}`}
            disabled={isCodeSubmitting}
          >
            {!isCodeSubmitting && <Send className='w-4 h-4' />}
            {isCodeSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          {/* LANGUAGE Dropdown */}
          <div className="flex flex-row items-center justify-center gap-0 bg-gray-700 rounded-md px-4 py-2">
            <select
              id="lang-select"
              className=" text-white  appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((item) => (
                <option className='bg-gray-800 text-white' key={item} value={item}>{item}</option>
              ))}

            </select>
            <div className="pointer-events-auto cursor-pointer inset-y-0 right-0 items-center text-gray-400 pl-2" onClick={() => document.getElementById('lang-select').focus()}>
              <ArrowDown className='w-4 h-4' />
            </div>
          </div>
        </div>
      </div>

      <div className='w-full flex flex-col lg:flex-row gap-6'>
        {/* left side */}
        <div className='lg:w-1/2 w-full bg-gray-800 shadow-xl overflow-hidden '>
          <div className='flex border-b border-gray-700'>
            <button 
              onClick={() => setActiveTab("description")} 
              className={`flex-1 p-3 text-lg font-semibold border-r border-gray-700 
                ${activeTab === "description" ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white transition-colors'}`}>
              Description
            </button>
            <button 
              onClick={() => setActiveTab("submissions")} 
              className={`flex-1 p-3 text-lg font-semibold 
                ${activeTab === "submissions" ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white transition-colors'}`}>
              Submissions
            </button>
          </div>

          <div className='p-6 max-h-[117vh] overflow-y-auto custom-scrollbar'>
            {activeTab === "description" ?
             (
              <div>
                {problem && (
                  <div className='flex flex-col'>
                    <h1 className='mt-2 mb-4 font-bold text-3xl text-blue-400'>{problem?.title}</h1>
                    <div className='flex gap-2 mb-6'>
                      <div className={`px-3 py-1 text-sm font-semibold rounded-full 
                        ${badgeType === 'success' ? 'bg-green-500' : 
                          badgeType === 'warning' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                        {problem?.difficulty}
                      </div>
                    </div>
                    <p className='mb-6 text-gray-300 leading-relaxed'>{problem?.description}</p>

                    <div className='flex flex-col mb-6'>
                      <h2 className='font-semibold text-2xl text-blue-300 mb-3'>Examples:</h2>
                      {problem?.examples && Object.entries(problem.examples).map(([key, example]) => (
                        <div key={key} className='bg-gray-700 p-4 rounded-lg mb-4 shadow-inner'>
                          <p className='text-gray-200 mb-1'><strong className='font-semibold text-blue-200'>Input:</strong> {example.input}</p>
                          <p className='text-gray-200 mb-1'><strong className='font-semibold text-blue-200'>Output:</strong> {example.output}</p>
                          <p className='text-gray-200'><strong className='font-semibold text-blue-200'>Explanation:</strong> {example.explanation}</p>
                        </div>
                      ))}
                    </div>

                    <div className='mb-6'>
                      <h2 className='font-semibold text-2xl text-blue-300 mb-3'>Constraints:</h2>
                      {
                        Array.isArray(problem?.constraints) ? (
                          <ul className='list-disc list-inside text-gray-300 space-y-1'>
                            {problem?.constraints.map((constraint, index) => (
                              <li key={index}>{constraint}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className='text-gray-300'>{problem?.constraints}</p>  
                        )
                      }
                    </div>

                    <div className='mb-2'>
                      <h2 className='font-semibold text-2xl text-blue-300 mb-3'>Tags:</h2>
                      <div className='flex flex-wrap gap-2'>
                        {problem?.tags && problem.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full font-medium border border-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              isSubmissionsLoading ? (
                <div className='flex justify-center items-center h-64'>
                  <span className="loading loading-spinner loading-lg text-blue-500"></span>
                </div>
              ) : submissions ? (
                <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />
              ) : (
                <div className='flex justify-center items-center h-64 text-gray-400 text-xl'>
                  No submissions yet.
                </div>
              )
            )}
          </div>
        </div>

        {/* right side */}
        <div className='lg:w-1/2 w-full flex flex-col gap-6'>
          {/* right top - Code Editor */}
          <div className='bg-gray-800 rounded-lg shadow-xl overflow-hidden'>
            <Editor 
              height="80vh"
              theme="vs-dark" 
              language={languageMap[language]}
              value={code}
              onChange={(newValue) => setCode(newValue)}
              options={{
                fontSize: 16,
                minimap: { enabled: false }, 
                padding: { top: 15, bottom: 15 },
                scrollBeyondLastLine: false,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8
                }
              }}
            />
          </div>

          {/* right bottom - Test Cases / Results */}
          <div className='bg-gray-800 rounded-lg shadow-xl overflow-hidden'>
            {/* Results Header with Clear Button */}
            {submission && resultType && (
              <div className='flex justify-between items-center p-4 border-b border-gray-700 bg-gray-750'>
                <h3 className='text-lg font-semibold text-white'>
                  {resultType === 'run' ? 'Run Results' : 'Submission Results'}
                </h3>
                <button 
                  onClick={handleClearResults}
                  className='p-2 hover:bg-gray-600 rounded-lg transition-colors'
                  title="Clear results"
                >
                  <X className='w-4 h-4 text-gray-400' />
                </button>
              </div>
            )}
            
            <div className='p-4 max-h-[40vh] overflow-y-auto custom-scrollbar'>
              {submission && resultType ? (
                resultType === 'run' ? (
                  <RunCodeResults submission={submission} />
                ) : (
                  <SubmitCodeResults submission={submission} />
                )
              ) : (
                <>
                  <div className='flex gap-4 mb-4'>
                    <button onClick={case1} className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors shadow-sm">Test Case 1</button>
                    <button onClick={case2} className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors shadow-sm">Test Case 2</button>
                    <button onClick={case3} className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors shadow-sm">Test Case 3</button>
                  </div>
                  <div className='p-4 bg-gray-700 rounded-md'>
                    <p className='text-xl font-semibold text-blue-300 mb-2'>Input</p>
                    <pre className='bg-gray-900 p-3 rounded-sm font-mono text-sm text-gray-200 whitespace-pre-wrap mb-4'>
                      {testCaseInput || 'No input provided for this test case.'}
                    </pre>

                    <p className='text-xl font-semibold text-blue-300 mb-2'>Expected Output</p>
                    <pre className='bg-gray-900 p-3 rounded-sm font-mono text-sm text-gray-200 whitespace-pre-wrap'>
                      {testCaseOutput || 'No output provided for this test case.'}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
