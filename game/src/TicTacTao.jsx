import { useState } from "react";

// eslint-disable-next-line react/prop-types
function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>{value}</button>
  );
}


// eslint-disable-next-line react/prop-types
function Borad({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    // eslint-disable-next-line react/prop-types
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O"; 
    }
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square className="square" onSquareClick={() => handleClick(0)} value={squares[0]}/>
        <Square className="square" onSquareClick={() => handleClick(1)} value={squares[1]}/>
        <Square className="square" onSquareClick={() => handleClick(2)} value={squares[2]}/>
      </div>
      <div className="board-row">
        <Square className="square" onSquareClick={() => handleClick(3)} value={squares[3]}/>
        <Square className="square" onSquareClick={() => handleClick(4)} value={squares[4]}/>
        <Square className="square" onSquareClick={() => handleClick(5)} value={squares[5]}/>
      </div>
      <div className="board-row">
        <Square className="square" onSquareClick={() => handleClick(6)} value={squares[6]}/>
        <Square className="square" onSquareClick={() => handleClick(7)} value={squares[7]}/>
        <Square className="square" onSquareClick={() => handleClick(8)} value={squares[8]}/>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


const App = () => {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTp(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    description = (move > 0) ? ("Go to move #" + move) : "Go to Start";

    return (
      <li key={move}><button onClick={() => jumpTp(move)}>{description}</button></li>
    )
  });

  return (
    <div className="game">
      <div className="gameBoard">
        <Borad xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="gameInfo">
        <ol>{moves}</ol>
      </div>
    </div>
  )  
}

export default App;