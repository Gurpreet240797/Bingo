import React, { useEffect, useState } from "react";

function Square({ value, onSquareClick, isMarked }) {
  const styles = isMarked ? { filter: 'invert(100%)' } : {};
  if (isMarked) {
    return <button className="square" 
            onClick={onSquareClick}
            style={styles}
          >
            {value}
        </button>;
  }
  return <button className="square" 
            onClick={onSquareClick}
          >
            {value}
        </button>;
}

function Start ({ onClick }) {
  return <button 
    style={{ marginTop: "10px"}} 
    type="button" 
    className="btn btn-success"
    onClick={onClick}
    >Start</button>;
}

function SquareForPC({ isMarked, value, revealNumbers }) {
  const styles = isMarked ? { filter: 'invert(100%)' } : {};
  if (revealNumbers && isMarked) {
    return <button className="square" style={styles}>{value}</button>;
  } else if (revealNumbers && !isMarked) {
    return <button className="square" style={styles}>{value}</button>;
  } else if (!revealNumbers && isMarked) {
    return <button className="square" style={styles}>X</button>;
  } else {
    return <button className="square">X</button>;
  }
}

function Progress({ handleProgress }) {
  return <div className="alert alert-warning" 
          role="alert">
          {handleProgress()}
      </div>
}

function Status({ handleChange }) {
  return <h1 className="badge bg-success"style={{ "marginTop": "10px"}}>{handleChange()}</h1>
}

export default function Board() {
  const [squares, setSquares] = useState(Array(25).fill(null));
  const [lineThrough, setLineThrough] = useState(Array(25).fill(false));
  const [currentValue, setCurrentValue] = useState(1);
  const [startVisible, setStartVisible] = useState(false);
  const [squaresPC, setSquaresPC] = useState(Array(25).fill(null));
  const [lineThroughPC, setLineThroughPC] = useState(Array(25).fill(false));
  const [instructions, setInstructions] = useState("Click to fill the values in the Box's between 1-25.");
  const [playStarted, setPlayStarted] = useState(false);
  const [countLines, setCountLines] = useState(0);
  const [revealOpponentBoard, setRevealOpponentBoard] = useState(false);
  // eslint-disable-next-line
  const [lines, setLines] = useState([
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
      ]);
      // eslint-disable-next-line
  const [linesPC, setLinesPC] = useState([
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
      ]);
  
  
  function checkWinner(index, player) {
    setCountLines(0);
    if (player === "Player") {
      setLines((prevLines) => {
        const playerLines = JSON.parse(JSON.stringify(prevLines));
        playerLines.forEach((line, lineIndex) => {
          const filteredLine = line.filter(item => item !== index);
          if (filteredLine.length === 0) {
            if (countLines !== 5) {
              setCountLines((count) => count+1);
            }

          }
          playerLines[lineIndex] = filteredLine;
        });
        return playerLines;
      });
    } else {
      setLinesPC((prevLines) => {
        const playerLines = JSON.parse(JSON.stringify(prevLines));
        playerLines.forEach((line, lineIndex) => {
          const filteredLine = line.filter(item => item !== index);
          if (filteredLine.length === 0) {
            if (countLines !== 5) {
              setCountLines((count) => count+1);
            }
          }
          playerLines[lineIndex] = filteredLine;
        });
        return playerLines;
      });
    }

    return showValue();
  }

  useEffect(() => {
    if (countLines > 4) {
      setRevealOpponentBoard(true);
    }
  }, [countLines]);
  
  useEffect(() => {
    const generateShuffledNumbers = () => {
      const numbers = Array.from({ length: 25 }, (_, index) => index + 1);
      // Shuffle the numbers using Fisher-Yates algorithm
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      return numbers;
    };

    setSquaresPC(generateShuffledNumbers());
  }, []);

  function handleClick(index) {
    if (squares[index] != null && currentValue === 25 && playStarted === true) {
      
      /* TODO 
        1. Mark the cell for Player
        2. Mark the cell for Opponent
        3. Check if Player or Opponent won the game
        4. Show banner for the win or lose to the player
        5. Show or take turn to select the cell (Random) 
      */
      
      // 1.
      setLineThrough((prevLineThrough) => {
        const newLineThrough = [...prevLineThrough];
        newLineThrough[index] = true;
        return newLineThrough;  
      });
      // eslint-disable-next-line
      let winner = checkWinner(index, "Player");


      // 2. 
      setLineThroughPC((prevLineThroughPC) => {
        const newLineThroughPC = [...prevLineThroughPC];
        let value = squares[index];
        let foundIndexAt = 0;
        squaresPC.forEach((element, ind) => {
          if (element === value) {
            foundIndexAt = ind;
          }
        });
        newLineThroughPC[foundIndexAt] = true;
        return newLineThroughPC;
      });


      // TODO: check for opponent
      
      return;
    } else if (squares[index] != null) {
      return;
    }

    setSquares((prevSquares) => {
      const newSquares = [...prevSquares];
      newSquares[index] = currentValue;
      return newSquares;
    });

    if (currentValue < 25 ) setCurrentValue((prevValue) => prevValue + 1);
    if (currentValue === 25) {
      setStartVisible(true);
    }
  }

  function onStartClick() {
    setStartVisible(false);
    setInstructions(instructions => "Let's Play: Pick your number")
    setPlayStarted(true);
  }

  function showValue() {
    if (countLines === 1) {
      return "B";
    } else if (countLines === 2) {
      return "BI";
    } else if (countLines === 3) {
      return "BIN";
    } else if (countLines === 4) {
      return "BING";
    } else if (countLines > 4){
      return "BINGO";
    }
  }

  function handleProgress() {
    return instructions;
  }

  return (
    <>
      <div className="status">
        <strong>BINGO</strong>
      </div>

      <Progress handleProgress={handleProgress}/>

      {startVisible && <Start onClick={onStartClick}/>}

      <div style={{ paddingTop: "10px" }}>Your Board</div>
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="board-row">
              {[0, 1, 2, 3, 4].map((col) => (
                <Square
                  key={col}
                  onSquareClick={() => handleClick(row * 5 + col)}
                  value={squares[row * 5 + col]}
                  isMarked={lineThrough[row * 5 + col]}
                />
              ))}
            </div>
          ))}

      <Status handleChange={showValue}/>
          
      <div style={{ paddingTop: "5px" }}>Opponent Board</div>
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="board-row">
              {[0, 1, 2, 3, 4].map((col) => (
                <SquareForPC
                  key={col}
                  value={squaresPC[row * 5 + col]}
                  isMarked={lineThroughPC[row * 5 + col]}
                  revealNumbers={revealOpponentBoard}
                />
              ))}
            </div>
          ))}
    </>
  );
}
