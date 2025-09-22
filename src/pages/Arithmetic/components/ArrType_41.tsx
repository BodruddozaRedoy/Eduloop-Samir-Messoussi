import React, { useState, useCallback, useEffect, useMemo } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Data for the grid problems (simplified, no pre-defined correct cells)
const problemsData = [
  {
    id: 1,
    title: "Find the way in jumps of 10.",
    grid: [
      [730, 500, 497, 482, 616, 542],
      [456, 466, 366, 580, 530, 546],
      [556, 476, 480, 508, 526, 536],
      [650, 486, 496, 506, 516, 357],
      [730, 500, 497, 482, 616, 542],
    ],
  },
  {
    id: 2,
    title: "Find the way in jumps of 10.",
    grid: [
      [730, 500, 497, 482, 616, 542],
      [456, 466, 366, 580, 530, 546],
      [556, 476, 480, 508, 526, 536],
      [650, 486, 496, 506, 516, 357],
      [730, 500, 497, 482, 616, 542],
    ],
  },
];

// Helper function to find the correct path (jumps of 10)
const findCorrectPath = (grid) => {
  const startValue = 456;
  const targetValue = 516;
  const correctPath = [];
  
  const findPathRecursive = (row, col) => {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
      return false;
    }
    const cellValue = grid[row][col];
    if (cellValue === targetValue) {
      correctPath.push({ row, col });
      return true;
    }
    if (correctPath.some(c => c.row === row && c.col === col)) {
      return false; // Avoid loops
    }

    correctPath.push({ row, col });
    
    // Check neighbors for a jump of 10
    const neighbors = [
      { r: row - 1, c: col },
      { r: row + 1, c: col },
      { r: row, c: col - 1 },
      { r: row, c: col + 1 },
    ];
    
    for (const neighbor of neighbors) {
      const { r, c } = neighbor;
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
        if (Math.abs(grid[r][c] - cellValue) === 10) {
          if (findPathRecursive(r, c)) {
            return true;
          }
        }
      }
    }
    correctPath.pop(); // Backtrack
    return false;
  };
  
  let startRow, startCol;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === startValue) {
        startRow = r;
        startCol = c;
        break;
      }
    }
    if (startRow !== undefined) break;
  }
  
  if (startRow === undefined) return [];
  findPathRecursive(startRow, startCol);
  return correctPath;
};


export default function ArrType_41({ hint }: { hint: string }) {
  const [selectedCells, setSelectedCells] = useState(
    problemsData.map(() => []) // Initialize as empty paths
  );
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const [correctPaths, setCorrectPaths] = useState([]);

  useEffect(() => {
    const paths = problemsData.map(p => findCorrectPath(p.grid));
    setCorrectPaths(paths);
  }, []);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const findPathJumpsOf10 = (grid, path, newRow, newCol) => {
    if (path.length === 0) {
      // First cell can be selected freely
      return true;
    }
    const lastCell = path[path.length - 1];
    const lastValue = grid[lastCell.row][lastCell.col];
    const newValue = grid[newRow][newCol];
    
    const isAdjacent = Math.abs(lastCell.row - newRow) + Math.abs(lastCell.col - newCol) === 1;
    const isJumpOf10 = Math.abs(newValue - lastValue) === 10;
    
    return isAdjacent && isJumpOf10;
  };

  const handleCellClick = useCallback(
    (problemIdx: number, rowIdx: number, colIdx: number) => {
      setSelectedCells((prev) => {
        const newSelectedCells = [...prev];
        const currentPath = newSelectedCells[problemIdx];
        const isAlreadyInPath = currentPath.some(c => c.row === rowIdx && c.col === colIdx);
        
        if (isAlreadyInPath) {
          // Deselecting: remove this cell and all subsequent cells from the path
          const cellIndex = currentPath.findIndex(c => c.row === rowIdx && c.col === colIdx);
          newSelectedCells[problemIdx] = currentPath.slice(0, cellIndex);
        } else {
          // Selecting: check if it's a valid jump
          if (findPathJumpsOf10(problemsData[problemIdx].grid, currentPath, rowIdx, colIdx)) {
            newSelectedCells[problemIdx] = [...currentPath, { row: rowIdx, col: colIdx }];
          } else {
            // If it's an invalid jump, clear the path and start a new one
            newSelectedCells[problemIdx] = [{ row: rowIdx, col: colIdx }];
          }
        }
        return newSelectedCells;
      });
      setStatus(null);
    },
    []
  );
  
  const handleCheck = useCallback(() => {
    let allCorrect = true;
    problemsData.forEach((problem, problemIdx) => {
      const userPath = selectedCells[problemIdx];
      const correctPath = correctPaths[problemIdx];
      
      const isPathCorrect = userPath.length === correctPath.length && userPath.every((cell, index) => 
        cell.row === correctPath[index].row && cell.col === correctPath[index].col
      );
      
      if (!isPathCorrect) {
        allCorrect = false;
      }
    });

    setStatus(allCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, allCorrect);
  }, [selectedCells, correctPaths, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    setSelectedCells(correctPaths);
    setShowSolution(true);
    setStatus("match");
  }, [correctPaths]);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    if (!status) return null;
    return status === "match"
      ? { text: "🎉 Correct! Good Job", color: "text-green-600" }
      : { text: "❌ Some answers are wrong", color: "text-red-600" };
  }, [status]);

  useEffect(() => {
    setControls({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]);

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-xl font-semibold text-gray-800">Question 1</div>
      <div className="text-gray-600">Find the way in jumps of 10.</div>

      <div className="flex flex-wrap justify-center gap-8">
        {problemsData.map((problem, problemIdx) => (
          <div key={problem.id} className="border-2 border-orange-300 rounded-lg p-1">
            <div
              className="grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${problem.grid[0].length}, minmax(0, 1fr))`,
              }}
            >
              {problem.grid.map((row, rowIdx) =>
                row.map((cellValue, colIdx) => {
                  const isSelected = selectedCells[problemIdx].some(c => c.row === rowIdx && c.col === colIdx);
                  const isSolution = showSolution && correctPaths[problemIdx]?.some(c => c.row === rowIdx && c.col === colIdx);

                  return (
                    <div
                      key={`${problem.id}-${rowIdx}-${colIdx}`}
                      className={`
                        flex items-center justify-center p-2 text-sm font-medium
                        border border-orange-200
                        w-16 h-10
                        ${isSolution ? "bg-green-200" : (isSelected ? "bg-green-200" : "bg-white")}
                        ${isSolution ? 'border-green-500' : 'border-orange-200'}
                        cursor-pointer select-none
                      `}
                      onClick={() => handleCellClick(problemIdx, rowIdx, colIdx)}
                    >
                      {cellValue}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
}