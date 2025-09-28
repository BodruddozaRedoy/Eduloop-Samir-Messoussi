import React, { useState, useCallback, useMemo } from 'react';

// --- Data for the Bar Chart and Quiz ---
const chartData = {
  swimming: 4,
  judo: 7, 
  'ice skating': 3,
  football: 10,
  gymnastics: 2,
  dancing: 3,
};

// Correct answers for the quiz questions
const correctAnswers = {
  swimCount: '4',
  fewestSport: 'gymnastics',
  judoCount: '7',
  sameSport1: 'ice skating',
  sameSport2: 'dancing',
  tenChildrenSport: 'football',
};

// ===============================================
// Component 1: Bar Chart Quiz Content (Core Logic)
// ===============================================
function BarChartQuizContent() {
  const initialInputs = {
    swimCount: '',
    fewestSport: '',
    judoCount: '',
    sameSport1: '',
    sameSport2: '',
    tenChildrenSport: '',
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [validation, setValidation] = useState({}); // Stores validation status: { fieldName: true/false }
  const [statusMessage, setStatusMessage] = useState(null); // 'correct' or 'wrong'
  const [showSolution, setShowSolution] = useState(false);

  // --- Functionality ---

  const handleInputChange = useCallback((field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setValidation(prev => ({ ...prev, [field]: null })); // Reset validation on change
    setStatusMessage(null);
  }, []);

  const handleCheck = useCallback(() => {
    let allCorrect = true;
    const newValidation = {};
    
    Object.keys(correctAnswers).forEach(field => {
      const userAnswer = String(inputs[field]).trim().toLowerCase();
      
      // Logic for the two sports with the same number of children (order doesn't matter)
      if (field === 'sameSport1' || field === 'sameSport2') {
        const correctOptions = [correctAnswers.sameSport1.toLowerCase(), correctAnswers.sameSport2.toLowerCase()];
        const otherInput = field === 'sameSport1' ? inputs.sameSport2 : inputs.sameSport1;
        
        // Is current input one of the correct sports AND not the same as the other field's current input?
        const isCorrect = correctOptions.includes(userAnswer) && 
                          userAnswer !== String(otherInput).trim().toLowerCase() && 
                          String(otherInput).trim().toLowerCase() !== ''; // Must be filled to be validated
        
        newValidation[field] = isCorrect;
        if (!isCorrect) allCorrect = false;

      } else {
        // Standard comparison
        const isCorrect = userAnswer === String(correctAnswers[field]).toLowerCase();
        newValidation[field] = isCorrect;
        if (!isCorrect) allCorrect = false;
      }
    });

    setValidation(newValidation);
    setStatusMessage(allCorrect ? 'correct' : 'wrong');
  }, [inputs]);

  const handleShowSolution = useCallback(() => {
    setInputs(correctAnswers);
    const solutionValidation = Object.keys(correctAnswers).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setValidation(solutionValidation);
    setShowSolution(true);
    setStatusMessage('correct');
  }, []);

  // --- Styling Helpers ---

  const getInputClass = (field) => {
    if (showSolution) {
      return 'text-green-600 font-semibold border-green-600';
    }
    
    const status = validation[field];
    if (status === true) {
      return 'text-green-600 font-semibold border-green-600';
    } else if (status === false) {
      return 'text-red-600 font-semibold border-red-600';
    }
    return 'text-gray-800 border-gray-500 focus:border-blue-500';
  };
  
  const DottedInput = ({ field, size = 'w-28' }) => (
    <input
      type="text"
      className={`bg-transparent border-b border-dotted outline-none text-left inline-block ${size} p-0.5 ${getInputClass(field)}`}
      value={inputs[field]}
      onChange={(e) => handleInputChange(field, e.target.value)}
      readOnly={showSolution}
      style={{ minWidth: size === 'w-12' ? '4rem' : '7rem' }}
    />
  );
  
  // --- Bar Chart Rendering ---

  const BarChart = useMemo(() => {
    const max = 12;
    const labels = Object.keys(chartData);
    const yAxisLabels = [12, 10, 8, 6, 4, 2, 0];

    return (
      <div className="p-4 bg-white">
        <div className="text-base font-semibold text-red-600 mb-4">Which sports does group 5 do?</div>

        <div className="flex">
          {/* Y-Axis (Number of Children) */}
          <div className="flex flex-col justify-between items-center text-xs font-medium mr-2" style={{ height: '200px' }}>
            <span className="transform -rotate-90 origin-center text-gray-600 whitespace-nowrap -ml-4">number of children</span>
            <div className="flex flex-col justify-between h-full pt-1 pb-1 text-right">
              {yAxisLabels.map((val) => (
                <span key={val} className="text-gray-500 w-8">{val}</span>
              ))}
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex-grow">
            <div className="relative border-l border-b border-gray-400" style={{ height: '200px' }}>
              {/* Horizontal Grid Lines */}
              {[2, 4, 6, 8, 10, 12].map(val => (
                <div 
                  key={val} 
                  className="absolute w-full border-t border-dotted border-gray-300" 
                  style={{ bottom: `${(val / max) * 100}%` }}
                />
              ))}
              
              {/* Bars */}
              <div className="flex h-full items-end justify-around px-1" style={{ gap: '10px' }}>
                {labels.map((sport) => (
                  <div
                    key={sport}
                    className="relative flex flex-col items-center"
                    style={{ width: 'calc(100% / 6 - 8px)' }} /* Calculate bar width and account for gap */
                  >
                    <div
                      className="bg-blue-200 w-full rounded-t-sm"
                      style={{ 
                        height: `${(chartData[sport] / max) * 100}%`,
                        backgroundColor: '#cee6f0' // Lighter blue for exact match
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* X-Axis (Sport Labels) */}
            <div className="flex justify-around text-xs mt-1 font-medium px-1" style={{ gap: '10px' }}>
              {labels.map((sport) => (
                <span key={sport} className="text-center text-gray-700 whitespace-pre-wrap" style={{ width: 'calc(100% / 6 - 8px)' }}>
                  {sport.replace(' ', '\n')}
                </span>
              ))}
            </div>
            <div className="text-xs text-center text-gray-600 mt-2">sport</div>
          </div>
        </div>
      </div>
    );
  }, []);

  // --- Render Questions ---

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Question 1</h1>
      <p className="text-gray-600 mb-6">Look at the bar chart. Answer the questions.</p>

      {/* Bar Chart Section */}
      <div className="mb-8 p-4 border border-gray-300 rounded-lg shadow-inner">
        {BarChart}
      </div>

      {/* Questions Section */}
      <div className="space-y-4 text-gray-800 text-lg font-medium pl-2">
        <div>
          How many children swim?
          <DottedInput field="swimCount" size="w-12" />
          children
        </div>
        <div>
          Which sport is done by the fewest children?
          <DottedInput field="fewestSport" />
        </div>
        <div>
          How many children are in judo?
          <DottedInput field="judoCount" size="w-12" />
          children
        </div>
        <div>
          Which 2 sports have the same number of children?
          <DottedInput field="sameSport1" />
          and
          <DottedInput field="sameSport2" />
        </div>
        <div>
          Which sport do 10 children do?
          <DottedInput field="tenChildrenSport" />
        </div>
      </div>

      {/* Controls and Status */}
      <div className="flex justify-between items-center mt-10 border-t pt-4">
        <div className="flex space-x-3">
          <button
            onClick={handleCheck}
            disabled={showSolution}
            className="px-5 py-2 text-sm font-semibold rounded-lg shadow-md bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 transition"
          >
            Check
          </button>
          <button
            className="px-5 py-2 text-sm font-semibold rounded-lg shadow-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
          >
            Hint
          </button>
          <button
            onClick={handleShowSolution}
            disabled={showSolution}
            className="px-5 py-2 text-sm font-semibold rounded-lg shadow-md bg-purple-100 text-purple-800 hover:bg-purple-200 disabled:opacity-50 transition"
          >
            Show Solution
          </button>
        </div>

        <button
            className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-full shadow-lg hover:bg-orange-700 transition"
        >
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
      
      {/* Status Message (Green/Red Box) */}
      {statusMessage === 'correct' && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 font-bold rounded-lg border border-green-300">
          Correct! Great job.
        </div>
      )}
      {statusMessage === 'wrong' && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 font-bold rounded-lg border border-red-300">
          Incorrect! Please recheck the highlighted answers.
        </div>
      )}
    </div>
  );
}

// ===============================================
// Component 2: Full Page Layout (Header/Navigation)
// ===============================================
export default function FullPageQuizLayout() {
  const [difficulty, setDifficulty] = useState('advanced');

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      {/* Top Header */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button className="flex items-center p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="ml-2 font-medium text-gray-700 hidden sm:inline">Back</span>
          </button>
          <div className="text-gray-500 font-medium text-sm md:text-base hidden sm:block">
            Group 5 {'>'} Arithmetic {'>'} Fractions
          </div>
        </div>
        
        {/* Difficulty Selector */}
        <div className="flex space-x-2 p-1 bg-gray-100 rounded-full">
          {['Easy', 'Medium', 'Advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level.toLowerCase())}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
                difficulty === level.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-md' // Selected state
                  : 'text-gray-700 hover:bg-gray-200' // Default state
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area (Quiz) */}
      <div className="max-w-4xl mx-auto mb-8">
        <BarChartQuizContent />
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-start max-w-4xl mx-auto mt-8">
        <button className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>Switch Category</span>
        </button>
      </div>
    </div>
  );
}