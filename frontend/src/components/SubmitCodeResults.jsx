// Enhanced SubmitCodeResults component (replace your existing one)
const SubmitCodeResults = ({ submission }) => {
  if (!submission || !submission.testCases) {
    return <div className="text-gray-400">No results to display</div>;
  }

  const passedTests = submission.testCases.filter(tc => tc.passed).length;
  const totalTests = submission.testCases.length;
  const firstFailedTest = submission.testCases.find(tc => !tc.passed);

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <div className={`p-4 rounded-lg border ${
        submission.status === 'Accepted' 
          ? 'bg-green-900/20 border-green-500'
          : 'bg-red-900/20 border-red-500'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {submission.status === 'Accepted' ? (
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            ) : (
              <span className="text-red-400 text-lg">⚠️</span>
            )}
            <div>
              <h3 className={`text-lg font-semibold ${
                submission.status === 'Accepted' ? 'text-green-300' : 'text-red-300'
              }`}>
                {submission.status}
              </h3>
              <p className="text-sm text-gray-400">
                {passedTests} / {totalTests} test cases passed
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-32">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  submission.status === 'Accepted' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${(passedTests / totalTests) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">
              {Math.round((passedTests / totalTests) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Error Details (if any) */}
      {firstFailedTest && (firstFailedTest.compileOutput || firstFailedTest.stderr || firstFailedTest.enhancedError) && (
        <div className="bg-gray-800 rounded-lg p-4 border border-red-500/30">
          <h4 className="font-semibold text-red-300 mb-3 flex items-center gap-2">
            <span>🐛</span>
            Error Details - Test Case {firstFailedTest.testCase}
          </h4>
          
          {/* Enhanced Error Display */}
          {firstFailedTest.enhancedError && (
            (() => {
              let errorData;
              try {
                errorData = typeof firstFailedTest.enhancedError === 'string' 
                  ? JSON.parse(firstFailedTest.enhancedError) 
                  : firstFailedTest.enhancedError;
              } catch (e) {
                errorData = { message: firstFailedTest.enhancedError, type: 'unknown' };
              }

              const isCompileError = errorData.type === 'compilation' || firstFailedTest.errorType === 'compile';

              return (
                <div className="mb-4">
                  <p className={`text-sm font-medium mb-2 ${
                    isCompileError ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {isCompileError ? 'Compilation Error' : 'Runtime Error'}
                    {errorData.line && ` at line ${errorData.line}`}:
                  </p>
                  <pre className={`p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap mb-3 ${
                    isCompileError 
                      ? 'bg-red-950/50 border border-red-500/30 text-red-200'
                      : 'bg-yellow-950/50 border border-yellow-500/30 text-yellow-200'
                  }`}>
                    {errorData.message}
                  </pre>
                  {errorData.suggestion && (
                    <div className={`p-3 rounded text-sm ${
                      isCompileError ? 'bg-red-900/20 text-red-200' : 'bg-yellow-900/20 text-yellow-200'
                    }`}>
                      <p className="font-medium">💡 Suggestion:</p>
                      <p>{errorData.suggestion}</p>
                    </div>
                  )}
                </div>
              );
            })()
          )}

          {/* Fallback for legacy error display */}
          {!firstFailedTest.enhancedError && firstFailedTest.compileOutput && (
            <div className="mb-4">
              <p className="text-sm font-medium text-red-400 mb-2">Compilation Error:</p>
              <pre className="bg-red-950/50 border border-red-500/30 p-3 rounded text-sm text-red-200 overflow-x-auto whitespace-pre-wrap">
                {firstFailedTest.compileOutput}
              </pre>
            </div>
          )}

          {!firstFailedTest.enhancedError && firstFailedTest.stderr && (
            <div className="mb-4">
              <p className="text-sm font-medium text-yellow-400 mb-2">Runtime Error:</p>
              <pre className="bg-yellow-950/50 border border-yellow-500/30 p-3 rounded text-sm text-yellow-200 overflow-x-auto whitespace-pre-wrap">
                {firstFailedTest.stderr}
              </pre>
            </div>
          )}

          {/* Input for context */}
          <div className="mt-4">
            <p className="text-sm font-medium text-blue-300 mb-1">Input that caused the error:</p>
            <pre className="bg-gray-900 p-2 rounded text-xs text-gray-200 overflow-x-auto">
              {firstFailedTest.stdin || 'No input'}
            </pre>
          </div>
        </div>
      )}

      {/* First Failed Test Case (for Wrong Answer without errors) */}
      {firstFailedTest && !firstFailedTest.compileOutput && !firstFailedTest.stderr && !firstFailedTest.enhancedError && (
        <div className="bg-gray-800 rounded-lg p-4 border border-red-500/30">
          <h4 className="font-semibold text-red-300 mb-3">
            Wrong Answer - Test Case {firstFailedTest.testCase}
          </h4>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-blue-300 mb-1">Input:</p>
              <pre className="bg-gray-900 p-2 rounded text-xs text-gray-200 overflow-x-auto">
                {firstFailedTest.stdin || 'No input'}
              </pre>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-red-300 mb-1">Your Output:</p>
                <pre className="bg-gray-900 p-2 rounded text-xs text-red-200 overflow-x-auto min-h-[3rem]">
                  {firstFailedTest.stdout || 'No output'}
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium text-green-300 mb-1">Expected Output:</p>
                <pre className="bg-gray-900 p-2 rounded text-xs text-green-200 overflow-x-auto min-h-[3rem]">
                  {firstFailedTest.expected || 'No expected output'}
                </pre>
              </div>
            </div>
            
            <div className="p-3 bg-blue-900/20 rounded text-sm text-blue-200">
              <p className="font-medium">💡 Tips:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Check your algorithm logic carefully</li>
                <li>Verify edge cases and boundary conditions</li>
                <li>Ensure output format matches exactly (spaces, newlines)</li>
                <li>Test with additional custom inputs</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {submission.status === 'Accepted' && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-green-300 mb-2">🎉 Congratulations!</h4>
          <p className="text-sm text-gray-300">
            Your solution successfully passed all {totalTests} test cases!
          </p>
        </div>
      )}
    </div>
  );
};

export default SubmitCodeResults