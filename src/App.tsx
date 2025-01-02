import { useState, useEffect } from "react";

const emotions = [
  { name: "Happy", color: "yellow" },
  { name: "Sad", color: "darkblue" },
  { name: "Sick", color: "darkgreen" },
  { name: "Anxious", color: "darkred" },
  { name: "Energetic", color: "purple" },
  { name: "Relaxed", color: "pink" },
  { name: "Amazing", color: "darkorange" },
  { name: "Remove ❌", color: "white" },
];

interface SquareProps {
  index: number;
  color: string;
  onClick: (index: number) => void;
  isSelected: boolean;
  isDisabled: boolean;
}

const Square = ({
  index,
  color,
  onClick,
  isSelected,
  isDisabled,
}: SquareProps) => {
  return (
    <div
      className={`w-10 h-10 cursor-pointer border ${
        isSelected ? "border-4 border-blue-500" : "border-gray-300"
      } ${isDisabled ? "cursor-not-allowed opacity-15" : ""}`}
      style={{ backgroundColor: color }}
      onClick={() => !isDisabled && onClick(index)}
    ></div>
  );
};

interface EmotionSelectorProps {
  onEmotionSelect: (color: string) => void;
  onEmotionRemove: () => void;
  isRemoveVisible: boolean;
}

const EmotionSelector = ({
  onEmotionSelect,
  onEmotionRemove,
}: EmotionSelectorProps) => {
  return (
    <div className="flex gap-4 mt-4">
      {emotions.map((emotion, index) => (
        <div key={index} className="flex items-center">
          {emotion.name === "Remove ❌" ? (
            <button
              className="flex items-center justify-center w-28 h-10 p-2 border-2 rounded-lg cursor-pointer border-red-600"
              onClick={() => onEmotionRemove}
            >
              {emotion.name}
            </button>
          ) : (
            <button
              className="flex items-center w-28 h-10 p-2 border rounded-lg cursor-pointer"
              onClick={() => onEmotionSelect(emotion.color)}
            >
              <div
                className="border w-5 h-5 rounded-sm"
                style={{ backgroundColor: emotion.color }}
              ></div>
              <span className="ml-2">{emotion.name}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const today = new Date();
  const currentDayIndex = today.getDate() - 1;

  const [grid, setGrid] = useState<string[]>(() => {
    const initialGrid = new Array(365).fill("lightgray");
    const savedGrid = localStorage.getItem("grid");
    if (savedGrid) {
      return JSON.parse(savedGrid);
    }
    initialGrid[currentDayIndex] = "white";
    return initialGrid;
  });

  const [selectedSquare, setSelectedSquare] = useState<number | null>(
    currentDayIndex
  );

  const isSquareDisabled = (index: number) => index > currentDayIndex;

  const handleSquareClick = (index: number) => {
    if (index === selectedSquare) {
      setSelectedSquare(null);
    } else {
      setSelectedSquare(index);
    }
  };

  const handleEmotionSelect = (color: string) => {
    if (selectedSquare !== null && selectedSquare <= currentDayIndex) {
      const newGrid = [...grid];
      newGrid[selectedSquare] = color;
      setGrid(newGrid);
      localStorage.setItem("grid", JSON.stringify(newGrid));
    }
  };

  const handleEmotionRemove = () => {
    if (selectedSquare !== null && selectedSquare <= currentDayIndex) {
      const newGrid = [...grid];
      newGrid[selectedSquare] =
        selectedSquare === currentDayIndex ? "white" : "lightgray";
      setGrid(newGrid);
      localStorage.setItem("grid", JSON.stringify(newGrid));
    }
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all emotions?"
    );
    if (confirmed) {
      const newGrid = new Array(365).fill("lightgray");
      newGrid[currentDayIndex] = "white";
      setGrid(newGrid);
      localStorage.removeItem("grid");
    }
  };

  useEffect(() => {
    localStorage.setItem("grid", JSON.stringify(grid));
  }, [grid]);

  return (
    <div
      className="flex flex-col items-center p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedSquare(null);
        }
      }}
    >
      <h1 className="text-3xl">Year Journal</h1>

      <EmotionSelector
        onEmotionSelect={handleEmotionSelect}
        onEmotionRemove={handleEmotionRemove}
        isRemoveVisible={selectedSquare !== null}
      />

      <div className="flex flex-wrap gap-1 mt-4">
        {grid.map((color, index) => (
          <Square
            key={index}
            index={index}
            color={color}
            onClick={handleSquareClick}
            isSelected={selectedSquare === index}
            isDisabled={isSquareDisabled(index)}
          />
        ))}
      </div>

      <button
        className="mt-6 p-2 bg-red-500 text-white rounded-lg"
        onClick={handleClearAll}
      >
        Clear All
      </button>
    </div>
  );
};

export default App;

// import React, { useState, useEffect } from "react";

// const emotions = [
//   { name: "Happy", color: "yellow" },
//   { name: "Sad", color: "darkblue" },
//   { name: "Sick", color: "darkgreen" },
//   { name: "Anxious", color: "darkred" },
//   { name: "Energetic", color: "purple" },
//   { name: "Relaxed", color: "pink" },
//   { name: "Amazing", color: "darkorange" },
// ];

// const generateRandomGrid = () => {
//   return new Array(365).fill(null).map(() => {
//     const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
//     return randomEmotion.color;
//   });
// };

// const App = () => {
//   const [grid, setGrid] = useState<string[]>(generateRandomGrid());

//   return (
//     <div className="flex flex-col items-center p-8">
//       <h1 className="text-3xl">Static Journal</h1>

//       <div className="flex flex-wrap gap-1 mt-4">
//         {/* Render the grid with 365 days */}
//         {grid.map((color, index) => (
//           <div
//             key={index}
//             className="w-10 h-10 border border-gray-300"
//             style={{ backgroundColor: color }}
//           ></div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;
