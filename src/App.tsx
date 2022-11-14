import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {

  const [grid, setGrid] = useState<number [][]>(
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
  );

  const [gameStarted, setGameStarted] = useState<boolean>(false);
  useEffect(() => {
    if(gameStarted === true)
      startGame();
  }, [gameStarted]);


  const [gameText, setGameText] = useState<string>("Start Game");
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [currentGeneration, setCurrentGeneration] = useState<number>(1);

  function setGridValue(rowIndex: number, colIndex: number, value: number) {
    //spread operator to set the reference of the grid to newGrid so we can acutally get the state to catch the change
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = value;
    setGrid(newGrid);
  }

  function userChangeGridValue(rowIndex: number, colIndex: number){
    if(gameStarted === true)
      return;

    //if the value of the current spot on the grid is one then assign a 0 otherwise a 1
    const value = grid[rowIndex][colIndex] === 1 ? 0 : 1;
    setGridValue(rowIndex, colIndex, value);
  }

  function startGamePressed(){
    if(gameStarted === true){
      console.log("Game Started Pressed - Setting to False");
      setGameText("Start Game");
      setGameStarted(false);
    }
    else if(gameStarted === false){
      console.log("Game Started Pressed - Setting to True");
      setGameText("Stop Game");
      setGameStarted(!gameStarted);
    }
  }

  function sleep(seconds: number){
    return new Promise(r => setTimeout(r, gameSpeed * 1000));
  }

  function startGame(){
    console.log(`Entered ${gameStarted}`);
    while(gameStarted === true){
      console.log("Game Started");
      grid.map((row, rowIndex) => (
        row.map((value, colIndex) => (() =>{

          let aliveNeighborCount: number = 0;

          //right
          if(colIndex + 1 < grid[0].length && grid[rowIndex][colIndex + 1] === 1)
            aliveNeighborCount += 1;

          //left
          if(colIndex > 0 && grid[rowIndex][colIndex - 1] === 1)
            aliveNeighborCount += 1;

          //up
          if(rowIndex > 0 && grid[rowIndex - 1][colIndex] === 1)
            aliveNeighborCount += 1;

          //down
          if(rowIndex + 1 < grid.length && grid[rowIndex + 1][colIndex] === 1)
            aliveNeighborCount += 1;

          //up-left
          if(rowIndex > 0 && colIndex > 0 && grid[rowIndex - 1][colIndex - 1] === 1)
            aliveNeighborCount += 1;

          //up-right
          if(rowIndex > 0 && colIndex + 1 < grid[0].length && grid[rowIndex - 1][colIndex + 1] === 1)
            aliveNeighborCount += 1;

          //down-left
          if(rowIndex + 1 < grid.length && colIndex > 0 && grid[rowIndex + 1][colIndex + 1] === 1)
            aliveNeighborCount += 1;
          
          //down-right
          if(rowIndex + 1 < grid.length && colIndex + 1 < grid[0].length && grid[rowIndex + 1][colIndex - 1] === 1)
            aliveNeighborCount += 1;

          if(grid[rowIndex][colIndex] === 1){
            if(aliveNeighborCount < 2){
              setGridValue(rowIndex, colIndex, 0);
            }
            if(aliveNeighborCount === 2 || aliveNeighborCount === 3){
              setGridValue(rowIndex, colIndex, 1);
            }
            if(aliveNeighborCount > 3){
              setGridValue(rowIndex, colIndex, 0);
            }
          }
          else if(grid[rowIndex][colIndex] === 0){
            if(aliveNeighborCount === 3){
              setGridValue(rowIndex, colIndex, 1);
            }
          }

        }))
      ));

      console.log("Before Promise");
      sleep(gameSpeed);
      console.log("After Promise");
      setCurrentGeneration(currentGeneration + 1);
    }
  }

  return (
    <div className="App">
      <button onClick={startGamePressed} id="">{gameText}</button>
      <input type="number" placeholder='Game Speed (in seconds)' value={gameSpeed} onChange={(e) => setGameSpeed(parseInt(e.target.value) || 1)}></input>
      <h1>Current Generation: {currentGeneration}</h1>
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
