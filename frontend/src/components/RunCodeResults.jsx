

const RunCodeResults = ({ submission }) => {
  if (!submission || !submission.testCases) {
    return <div className="text-gray-400">No results to display</div>;
  }

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <div className={`p-3 rounded-lg border ${
        submission.status === 'Accepted' 
          ? 'bg-green-900/20 border-green-500 text-green-300'
          : 'bg-red-900/20 border-red-500 text-red-300'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {submission.status === 'Accepted' ? (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            ) : (
              <span className="text-red-400">⚠️</span>
            )}
            <span className="font-semibold">{submission.status}</span>
          </div>
          {submission.testsPassed !== undefined && submission.totalTests !== undefined && (
            <span className="text-sm">
              {submission.testsPassed}/{submission.totalTests} passed
            </span>
          )}
        </div>
      </div>

      {/* Test Cases Results */}
      {submission.testCases.map((testCase, index) => (
        <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
          <div className={`p-3 border-l-4 ${
            testCase.passed 
              ? 'border-green-500 bg-gray-750'
              : 'border-red-500 bg-red-900/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">Test Case {testCase.testCase}</h4>
              <div className="flex items-center gap-4">
                {testCase.time && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>⏱️</span>
                    {testCase.time}
                  </div>
                )}
                {testCase.memory && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>📊</span>
                    {testCase.memory}
                  </div>
                )}
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  testCase.passed
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                }`}>
                  {testCase.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>

            {/* Input */}
            <div className="mb-3">
              <p className="text-sm font-medium text-blue-300 mb-1">Input:</p>
              <pre className="bg-gray-900 p-2 rounded text-xs text-gray-200 overflow-x-auto">
                {testCase.stdin || 'No input'}
              </pre>
            </div>

            {/* Enhanced Error Display */}
            {testCase.enhancedError && (
              <div className="mb-3">
                {(() => {
                  let errorData;
                  try {
                    errorData = typeof testCase.enhancedError === 'string' 
                      ? JSON.parse(testCase.enhancedError) 
                      : testCase.enhancedError;
                  } catch (e) {
                    errorData = { message: testCase.enhancedError, type: 'unknown' };
                  }

                  const isCompileError = errorData.type === 'compilation' || testCase.errorType === 'compile';
                  const isRuntimeError = errorData.type === 'runtime' || testCase.errorType === 'runtime';

                  return (
                    <div className={`border rounded p-3 ${
                      isCompileError 
                        ? 'bg-red-950/50 border-red-500/30' 
                        : 'bg-yellow-950/50 border-yellow-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={isCompileError ? 'text-red-400' : 'text-yellow-400'}>
                          {isCompileError ? '🚫' : '⚠️'}
                        </span>
                        <p className={`text-sm font-medium ${
                          isCompileError ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {isCompileError ? 'Compilation Error' : 'Runtime Error'}
                          {errorData.line && ` (Line ${errorData.line})`}
                        </p>
                      </div>
                      
                      <pre className={`text-xs overflow-x-auto whitespace-pre-wrap mb-2 ${
                        isCompileError ? 'text-red-200' : 'text-yellow-200'
                      }`}>
                        {errorData.message || testCase.compileOutput || testCase.stderr}
                      </pre>

                      {errorData.suggestion && (
                        <div className={`p-2 rounded text-xs ${
                          isCompileError ? 'bg-red-900/30 text-red-200' : 'bg-yellow-900/30 text-yellow-200'
                        }`}>
                          <p className="font-medium">💡 Suggestion:</p>
                          <p>{errorData.suggestion}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Compilation Error (fallback if enhancedError not available) */}
            {!testCase.enhancedError && testCase.compileOutput && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-400">🚫</span>
                  <p className="text-sm font-medium text-red-400">Compilation Error:</p>
                </div>
                <pre className="bg-red-950/50 border border-red-500/30 p-3 rounded text-xs text-red-200 overflow-x-auto whitespace-pre-wrap">
                  {testCase.compileOutput}
                </pre>
              </div>
            )}

            {/* Runtime Error (fallback if enhancedError not available) */}
            {!testCase.enhancedError && testCase.stderr && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">⚠️</span>
                  <p className="text-sm font-medium text-yellow-400">Runtime Error:</p>
                </div>
                <pre className="bg-yellow-950/50 border border-yellow-500/30 p-3 rounded text-xs text-yellow-200 overflow-x-auto whitespace-pre-wrap">
                  {testCase.stderr}
                </pre>
              </div>
            )}

            {/* Output comparison (only if no compilation/runtime errors) */}
            {!testCase.compileOutput && !testCase.stderr && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium text-blue-300 mb-1">Your Output:</p>
                    <pre className="bg-gray-900 p-2 rounded text-xs text-gray-200 overflow-x-auto min-h-[3rem]">
                      {testCase.stdout || 'No output'}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-300 mb-1">Expected Output:</p>
                    <pre className="bg-gray-900 p-2 rounded text-xs text-gray-200 overflow-x-auto min-h-[3rem]">
                      {testCase.expected || 'No expected output'}
                    </pre>
                  </div>
                </div>
                
                {/* Difference highlight for wrong answers */}
                {!testCase.passed && testCase.stdout !== testCase.expected && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-red-400 mb-1">Difference:</p>
                    <div className="bg-gray-900 p-2 rounded text-xs">
                      <div className="mb-1">
                        <span className="text-red-400">- Expected: </span>
                        <span className="bg-red-900/30 text-red-200 px-1 rounded">
                          "{testCase.expected}"
                        </span>
                      </div>
                      <div>
                        <span className="text-green-400">+ Your output: </span>
                        <span className="bg-green-900/30 text-green-200 px-1 rounded">
                          "{testCase.stdout}"
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RunCodeResults