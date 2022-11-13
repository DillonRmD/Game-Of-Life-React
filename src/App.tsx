import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const App = () => {

  const [grid, setGrid] = useState<number [][]>(
    [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]
  );

  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameText, setGameText] = useState<string>("Start Game");

  function setGridValue(rowIndex: number, colIndex: number, value: number) {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = value;
    setGrid(newGrid);
  }

  function userChangeGridValue(rowIndex: number, colIndex: number){
    if(gameStarted == true)
      return;

    const value = grid[rowIndex][colIndex] == 1 ? 0 : 1;
    setGridValue(rowIndex, colIndex, value);
  }

  function startGame(){
    if(gameStarted == true){
      setGameText("Start Game");
      setGameStarted(false);
    }
    else if(gameStarted == false){
      setGameText("Stop Game");
      setGameStarted(true);
    }
  }

  return (
    <div className="App">
      <button onClick={startGame} id="">{gameText}</button>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((value, colIndex) => (
              <div key={colIndex} className="cell" onClick={() => userChangeGridValue(rowIndex, colIndex)} >{value}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
