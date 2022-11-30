import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

import "./App.css";

interface IGrid {
    elements: number[][];
}

interface IStats {
    currentAlive: number;
    currentDead: number;
}

const App = () => {
    function createGrid() {
        let grid = {
            elements: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
        };
        return grid;
    }

    function createStats() {
        let stats: IStats = {
            currentAlive: 0,
            currentDead: 0,
        };
        return stats;
    }

    const [grid, setGrid] = useState<IGrid>(createGrid());
    const [stats, setStats] = useState<IStats>(createStats());
    const [history, setHistory] = useState<IGrid[]>([]);
    const [currentGeneration, setCurrentGeneration] = useState<number>(1);
    useEffect(() => {
        if (currentGeneration < 1) setCurrentGeneration(1);
    }, [currentGeneration]);

    function updateStats(currGrid: IGrid) {
        let result: IStats = {
            currentAlive: 0,
            currentDead: 0,
        };

        for (const row of currGrid.elements) {
            for (const val of row) {
                if (val === 1) result.currentAlive += 1;
                else if (val === 0) result.currentDead += 1;
            }
        }

        return result;
    }

    function setGridValue(rowIndex: number, colIndex: number, value: number) {
        //spread operator to set the reference of the grid to newGrid so we can acutally get the state to catch the change
        const newGrid = createGrid();
        newGrid.elements = [...grid.elements];
        newGrid.elements[rowIndex][colIndex] = value;
        setStats(updateStats(newGrid));
        setGrid(newGrid);
    }

    function userChangeGridValue(rowIndex: number, colIndex: number) {
        //if the value of the current spot on the grid is one then assign a 0 otherwise a 1
        const value = grid.elements[rowIndex][colIndex] === 1 ? 0 : 1;
        setGridValue(rowIndex, colIndex, value);
    }

    function nextGeneration() {
        const h: IGrid = createGrid();
        h.elements = JSON.parse(JSON.stringify(grid.elements));
        const hist = [...history];
        hist[currentGeneration - 1] = h;
        setHistory(hist);

        for (
            let rowIndex: number = 0;
            rowIndex < grid.elements.length;
            rowIndex++
        ) {
            for (
                let colIndex: number = 0;
                colIndex < grid.elements[0].length;
                colIndex++
            ) {
                let aliveNeighborCount: number = 0;

                //right
                if (
                    colIndex + 1 < grid.elements[0].length &&
                    grid.elements[rowIndex][colIndex + 1] === 1
                )
                    aliveNeighborCount += 1;

                //left
                if (colIndex > 0 && grid.elements[rowIndex][colIndex - 1] === 1)
                    aliveNeighborCount += 1;

                //up
                if (rowIndex > 0 && grid.elements[rowIndex - 1][colIndex] === 1)
                    aliveNeighborCount += 1;

                //down
                if (
                    rowIndex + 1 < grid.elements.length &&
                    grid.elements[rowIndex + 1][colIndex] === 1
                )
                    aliveNeighborCount += 1;

                //up-left
                if (
                    rowIndex > 0 &&
                    colIndex > 0 &&
                    grid.elements[rowIndex - 1][colIndex - 1] === 1
                )
                    aliveNeighborCount += 1;

                //up-right
                if (
                    rowIndex > 0 &&
                    colIndex + 1 < grid.elements[0].length &&
                    grid.elements[rowIndex - 1][colIndex + 1] === 1
                )
                    aliveNeighborCount += 1;

                //down-left
                if (
                    rowIndex + 1 < grid.elements.length &&
                    colIndex > 0 &&
                    grid.elements[rowIndex + 1][colIndex + 1] === 1
                )
                    aliveNeighborCount += 1;

                //down-right
                if (
                    rowIndex + 1 < grid.elements.length &&
                    colIndex + 1 < grid.elements[0].length &&
                    grid.elements[rowIndex + 1][colIndex - 1] === 1
                )
                    aliveNeighborCount += 1;

                if (grid.elements[rowIndex][colIndex] === 1) {
                    if (aliveNeighborCount < 2) {
                        setGridValue(rowIndex, colIndex, 0);
                    }
                    if (aliveNeighborCount === 2 || aliveNeighborCount === 3) {
                        setGridValue(rowIndex, colIndex, 1);
                    }
                    if (aliveNeighborCount > 3) {
                        setGridValue(rowIndex, colIndex, 0);
                    }
                } else if (grid.elements[rowIndex][colIndex] === 0) {
                    if (aliveNeighborCount === 3) {
                        setGridValue(rowIndex, colIndex, 1);
                    }
                }
            }
        }

        setCurrentGeneration(currentGeneration + 1);
    }

    function prevGeneration() {
        let previousGrid = history[currentGeneration - 2];
        setGrid(JSON.parse(JSON.stringify(previousGrid)));
        setCurrentGeneration(currentGeneration - 1);
    }

    return (
        <div className="App">
            <h1>Current Generation: {currentGeneration}</h1>
            <h2>Stats: </h2>
            <h3>Alive Cells: {stats.currentAlive} </h3>
            <h3>Dead Cells: {stats.currentDead}</h3>
            <div className="grid">
                {grid.elements.map((row, rowIndex) => (
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
            <div className="button-arena">
                    <Button
                        variant="contained"
                        onClick={() => prevGeneration()}
                        id=""
                        disabled={(currentGeneration > 1) === false}
                    >
                        Previous Generation
                    </Button>
                
                <Button
                    variant="contained"
                    onClick={() => nextGeneration()}
                    id=""
                >
                    Next Generation
                </Button>
            </div>
        </div>
    );
};

export default App;
