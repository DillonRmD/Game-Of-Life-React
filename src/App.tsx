import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
    const [grid, setGrid] = useState<number[][]>([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);

    const [history, setHistory] = useState<Record<number, number[][]>>({});

    const [currentGeneration, setCurrentGeneration] = useState<number>(1);
    useEffect(() => {
        if(currentGeneration < 1)
            setCurrentGeneration(1);
    }, [currentGeneration]);

    function setGridValue(rowIndex: number, colIndex: number, value: number) {
        //spread operator to set the reference of the grid to newGrid so we can acutally get the state to catch the change
        const newGrid = [...grid];
        newGrid[rowIndex][colIndex] = value;
        setGrid(newGrid);
    }

    function userChangeGridValue(rowIndex: number, colIndex: number) {
        //if the value of the current spot on the grid is one then assign a 0 otherwise a 1
        const value = grid[rowIndex][colIndex] === 1 ? 0 : 1;
        setGridValue(rowIndex, colIndex, value);
    }

    function nextGeneration() {
            for (let rowIndex: number = 0; rowIndex < grid.length; rowIndex++) {
                for (
                    let colIndex: number = 0;
                    colIndex < grid[0].length;
                    colIndex++
                ) {
                    let aliveNeighborCount: number = 0;

                    //right
                    if (
                        colIndex + 1 < grid[0].length &&
                        grid[rowIndex][colIndex + 1] === 1
                    )
                        aliveNeighborCount += 1;

                    //left
                    if (colIndex > 0 && grid[rowIndex][colIndex - 1] === 1)
                        aliveNeighborCount += 1;

                    //up
                    if (rowIndex > 0 && grid[rowIndex - 1][colIndex] === 1)
                        aliveNeighborCount += 1;

                    //down
                    if (
                        rowIndex + 1 < grid.length &&
                        grid[rowIndex + 1][colIndex] === 1
                    )
                        aliveNeighborCount += 1;

                    //up-left
                    if (
                        rowIndex > 0 &&
                        colIndex > 0 &&
                        grid[rowIndex - 1][colIndex - 1] === 1
                    )
                        aliveNeighborCount += 1;

                    //up-right
                    if (
                        rowIndex > 0 &&
                        colIndex + 1 < grid[0].length &&
                        grid[rowIndex - 1][colIndex + 1] === 1
                    )
                        aliveNeighborCount += 1;

                    //down-left
                    if (
                        rowIndex + 1 < grid.length &&
                        colIndex > 0 &&
                        grid[rowIndex + 1][colIndex + 1] === 1
                    )
                        aliveNeighborCount += 1;

                    //down-right
                    if (
                        rowIndex + 1 < grid.length &&
                        colIndex + 1 < grid[0].length &&
                        grid[rowIndex + 1][colIndex - 1] === 1
                    )
                        aliveNeighborCount += 1;

                    if (grid[rowIndex][colIndex] === 1) {
                        if (aliveNeighborCount < 2) {
                            setGridValue(rowIndex, colIndex, 0);
                        }
                        if (
                            aliveNeighborCount === 2 ||
                            aliveNeighborCount === 3
                        ) {
                            setGridValue(rowIndex, colIndex, 1);
                        }
                        if (aliveNeighborCount > 3) {
                            setGridValue(rowIndex, colIndex, 0);
                        }
                    } else if (grid[rowIndex][colIndex] === 0) {
                        if (aliveNeighborCount === 3) {
                            setGridValue(rowIndex, colIndex, 1);
                        }
                    }
                }
            }

            debugger;
            let h = history;
            h[currentGeneration] = grid;
            setHistory(h);
            //history[currentGeneration] = grid;
            setCurrentGeneration(currentGeneration + 1);
    }

    function prevGeneration(){
        for (let rowIndex: number = 0; rowIndex < grid.length; rowIndex++) {
            for (
                let colIndex: number = 0;
                colIndex < grid[0].length;
                colIndex++
            ) 
            {
                debugger;
                let previousGrid = history[currentGeneration - 1];
                setGridValue(rowIndex, colIndex, previousGrid[rowIndex][colIndex]);
                return;
            }
        }

        setCurrentGeneration(currentGeneration - 1);
    }

    return (
        <div className="App">      
            {
                currentGeneration > 1 ?
                <button onClick={() => prevGeneration()} id ="">
                Previous Generation
                </button>
                :
                null
            }      
            
            <button onClick={() => nextGeneration()} id="">
                Next Generation
            </button>
            <h1>Current Generation: {currentGeneration}</h1>
            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((value, colIndex) => (
                            <div
                                key={colIndex + rowIndex}
                                className={`cell ${
                                    value === 1 ? "cell-alive" : "cell-dead"
                                }`}
                                onClick={() =>
                                    userChangeGridValue(rowIndex, colIndex)
                                }
                            >
                                {value}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
