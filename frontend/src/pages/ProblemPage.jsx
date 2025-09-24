import { useParams, Link } from 'react-router-dom';
import useProblemStore from '../store/problemStore';
import { useEffect, useState } from 'react';
import { ChevronLeft, Play } from "lucide-react";
import Editor from '@monaco-editor/react';
import {languageMap,languageId} from '../utils/constants.js'
import useExecuteCode from '../store/codeExecuteStore.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SubmissionResults from '../components/SubmissionResults.jsx';
import SubmissionsList from '../components/SubmissionList.jsx';
import useSubmissionStore from '../store/submissionStore.js';


const ProblemPage = () => {
  const { id } = useParams();
  const languages = ["JAVA", "PYTHON", "JAVASCRIPT"];
  const [language, setLanguage] = useState('JAVASCRIPT');

  const {isCodeExecuting,submission,executeCodeFun} = useExecuteCode();
  const { problem, isProblemLoading, getProblemById } = useProblemStore();
  const {isLoading:isSubmissionsLoading , submission:submissions,
         getSubmissionForProblem } = useSubmissionStore();


  
  const [activeTab , setActiveTab] = useState("description")

  const [code, setCode] = useState(""); 

  const [testCaseInput , setTestCaseInput] = useState(problem?.testcases[0]?.input || ""); // Added optional chaining and default empty string
  const [testCaseOutput , setTestCaseOutput] = useState(problem?.testcases[0]?.output || ""); // Added optional chaining and default empty string


  const case1 = ()=>{
    setTestCaseInput(problem?.testcases[0]?.input || ""); // Added optional chaining
    setTestCaseOutput(problem?.testcases[0]?.output || "") // Added optional chaining
  }
  const case2 = ()=>{
    setTestCaseInput(problem?.testcases[1]?.input || ""); // Added optional chaining
    setTestCaseOutput(problem?.testcases[1]?.output || "") // Added optional chaining
  }
  const case3 = ()=>{
    setTestCaseInput(problem?.testcases[2]?.input || ""); // Added optional chaining
    setTestCaseOutput(problem?.testcases[2]?.output || "") // Added optional chaining
  }

  useEffect(() => {
    if(problem && language) {
      const starter = problem.codeSnippets?.[language] || "";
      setCode(starter);
    }
  }, [problem, language]);

  
  let badgeType = "error"; // default value
  if (problem && problem.difficulty) {
    const difficulty = problem?.difficulty.toLowerCase();
    badgeType = difficulty === "easy"
      ? "success"
      : difficulty === "medium"
        ? "warning"
        : "error";
  }


  useEffect(() => {
    if (!problem || problem.id !== id) {
      getProblemById(id);
    }
  }, [id, getProblemById, problem]);


  useEffect(() => {
    if(activeTab==="description" && id){
      getSubmissionForProblem(id)
      }
  }, [activeTab,id])
  
  
  


  if (isProblemLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-900"> {/* Added full height and background */}
        <span className="loading loading-spinner loading-lg text-blue-500"></span> {/* Used Tailwind color */}
      </div>
    );
  }


  const handleRunCode = (e)=>{
    e.preventDefault();
    try {
      const language_id = languageId[language]
      const stdin = problem?.testcases.map((tc)=>tc.input);
      const expected_outputs= problem?.testcases.map((tc)=>tc.output);
    executeCodeFun(code,language_id,stdin,expected_outputs,id);
    } catch (error) {
      console.log("Error executing code",error);
    }
  }


  return (
    <div className='p-6 min-h-screen bg-gray-900 text-gray-100 font-sans'> {/* Enhanced base styling */}

      {/* TOP DIV */}
      <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-700'> {/* Increased margin, added border */}
        <Link to="/problems" className='flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200'> {/* Styled link */}
          <ChevronLeft className='w-5 h-5' />
          Back to Problems
        </Link>
        <div className='flex gap-3'> 
        

          <button 
            onClick={handleRunCode}
            className={`px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md flex items-center justify-center gap-2
            ${isCodeExecuting ? 'opacity-75 cursor-not-allowed animate-pulse' : ''} `}
            disabled={isCodeExecuting}
          >
            { !isCodeExecuting && <Play className='w-4 h-4' /> }
            Run Code
          </button>
          {/* LANGUAGE Dropdown */}
          <div className="relative"> {/* Use relative for dropdown positioning */}
            <select 
              className="px-4 py-2 bg-gray-700 text-white rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            {/* Custom arrow for select element */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      
      <div className='w-full flex flex-col lg:flex-row gap-6'> {/* Responsive layout */}
      {/* left side */}
        <div className='lg:w-1/2 w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden'> {/* Card styling for left pane */}
          <div className='flex border-b border-gray-700'>
            <button 
              onClick={()=>setActiveTab("description")} 
              className={`flex-1 p-3 text-lg font-semibold border-r border-gray-700 
                ${activeTab === "description" ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white transition-colors'}`}>
              Description
            </button>
            <button 
              onClick={()=>setActiveTab("submissions")} 
              className={`flex-1 p-3 text-lg font-semibold 
                ${activeTab === "submissions" ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white transition-colors'}`}>
              Submissions
            </button>
          </div>

          <div className='p-6 max-h-[70vh] overflow-y-auto custom-scrollbar'> {/* Added custom scrollbar class */}
            { activeTab === "description" ? (
              <div>
                { problem && (
                  <div className='flex flex-col'>
                    <h1 className='mt-2 mb-4 font-bold text-3xl text-blue-400'>{problem?.title}</h1> {/* Styled title */}
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
                        <div key={key} className='bg-gray-700 p-4 rounded-lg mb-4 shadow-inner'> {/* Styled example block */}
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
                          <ul className='list-disc list-inside text-gray-300 space-y-1'> {/* Spaced list */}
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
                        {problem?.tags && problem.tags.map((tag,index)=>(
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
              (
                submissions? <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} /> :
              
              <div className='flex justify-center items-center h-64 text-gray-400 text-xl'>
                No submissions yet.
              </div>
           ) )}
          </div>
        </div>

      {/* right side */}
        <div className='lg:w-1/2 w-full flex flex-col gap-6'> {/* Responsive width, column layout */}
        {/* right top */}
          <div className='bg-gray-800 rounded-lg shadow-xl overflow-hidden'>
            <Editor 
              height="70vh"
              theme="vs-dark" 
              language={languageMap[language]}
              value={code}
              onChange={(newValue) => setCode(newValue)}
              options={{
                fontSize: 16,
                minimap: { enabled: false }, 
                padding: { top: 15, bottom: 15 }, // Increased padding
                scrollBeyondLastLine: false, // Prevents extra scroll space
                scrollbar: {
                  verticalScrollbarSize: 8, // Thicker scrollbar
                  horizontalScrollbarSize: 8
                }
              }}
            />
          </div>

        {/* right bottom */}
          <div className='bg-gray-800 rounded-lg shadow-xl p-4 max-h-[40vh] overflow-y-auto custom-scrollbar'> {/* Styled card, padding */}
            {submission ? (
              <SubmissionResults submission={submission} />
            ) : (
              <>
                <div className='flex gap-4 mb-4'> {/* Spacing for buttons */}
                  <button onClick={case1} className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors shadow-sm">Test Case 1</button>
                  <button onClick={case2} className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors shadow-sm">Test Case 2</button>
                  <button onClick={case3} className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors shadow-sm">Test Case 3</button>
                </div>
                <div className='p-4 bg-gray-700 rounded-md'> {/* Input/Output containers */}
                  <p className='text-xl font-semibold text-blue-300 mb-2'>Input</p>
                  <pre className='bg-gray-900 p-3 rounded-sm font-mono text-sm text-gray-200 whitespace-pre-wrap mb-4'>
                    {testCaseInput || 'No input provided for this test case.'}
                  </pre>

                  <p className='text-xl font-semibold text-blue-300 mb-2'>Output</p>
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
  );
};

export default ProblemPage;