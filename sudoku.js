"use strict";
// x means empty cell 
const x = null;
let steps = 0;
let keypadInput = 0;
function solve(board) {
    if (solved(board)) {
        return board;
    }
    const possibilities = nextBoards(board);
    const validBoards = keepOnlyValid(possibilities);
    return searchForSolution(validBoards);
}
function searchForSolution(boards) {
    // backtracking search for solution
    const first = boards.shift();
    if (first) {
        const tryPath = solve(first);
        steps++;
        if (tryPath) {
            // tryPath is valid and good
            return tryPath;
        }
        else {
            // path is a dead end, search for solution for remaining boards
            return searchForSolution(boards);
        }
    }
    return false;
}
function solved(board) {
    // every cell is not empty and valid
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!board[i][j]) {
                return false;
            }
        }
    }
    return true;
}
function nextBoards(board) {
    const res = [];
    const firstEmpty = findEmptySquare(board);
    if (firstEmpty) {
        const y = firstEmpty[0];
        const x = firstEmpty[1];
        for (let i = 1; i <= 9; i++) {
            const newBoard = [...board];
            const row = [...newBoard[y]];
            row[x] = i;
            newBoard[y] = row;
            res.push(newBoard);
        }
    }
    return res;
}
function findEmptySquare(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === null) {
                return [i, j];
            }
        }
    }
    return null;
}
function keepOnlyValid(boards) {
    return boards.filter(board => validBoard(board));
}
function validBoard(board) {
    return rowsValid(board) && columnsValid(board) && blocksValid(board);
}
function rowsValid(board) {
    for (let i = 0; i < 9; i++) {
        const duplicates = [];
        for (let j = 0; j < 9; j++) {
            const cellValue = board[i][j];
            if (cellValue) {
                if (duplicates.includes(cellValue)) {
                    return false;
                }
                duplicates.push(cellValue);
            }
        }
    }
    return true;
}
function columnsValid(board) {
    for (let i = 0; i < 9; i++) {
        const duplicates = [];
        for (let j = 0; j < 9; j++) {
            const cellValue = board[j][i];
            if (cellValue) {
                if (duplicates.includes(cellValue)) {
                    return false;
                }
                duplicates.push(cellValue);
            }
        }
    }
    return true;
}
function blocksValid(board) {
    const boxCoordinates = [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2]
    ];
    for (let y = 0; y < 9; y += 3) {
        for (let x = 0; x < 9; x += 3) {
            const duplicates = [];
            for (let i = 0; i < 9; i++) {
                const coordinates = [...boxCoordinates[i]];
                coordinates[0] += y;
                coordinates[1] += x;
                const cellValue = board[coordinates[0]][coordinates[1]];
                if (cellValue) {
                    if (duplicates.includes(cellValue)) {
                        return false;
                    }
                    duplicates.push(cellValue);
                }
            }
        }
    }
    return true;
}
const currentBoard = [];
for (let i = 0; i < 9; i++) {
    currentBoard.push([]);
    for (let j = 0; j < 9; j++) {
        currentBoard[i].push(x);
    }
}
Object.assign(window, { currentBoard });
const solveButton = document.querySelector('#solve');
const allCells = document.querySelectorAll('.cell');
if (solveButton) {
    solveButton.addEventListener('click', () => {
        steps = 0;
        console.log('solving...');
        const startTime = new Date().getTime();
        const solvedBoard = solve(currentBoard);
        if (solvedBoard) {
            // update html with solved board
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const solvedValue = solvedBoard[i][j];
                    if (solvedValue) {
                        allCells[i * 9 + j].textContent = `${solvedValue}`;
                    }
                }
            }
            const endTime = new Date().getTime();
            console.log('solved');
            console.log("time took to solve: ", (endTime - startTime) / 1000, ' sec');
            console.log("steps took: ", steps);
            return;
        }
        console.log("steps took: ", steps);
        alert('impossible');
    });
}
// Object.assign(window, { sudokuBoard });
// click cells to update board
const validInput = [1, 2, 3, 4, 5, 6, 7, 8, 9];
if (allCells) {
    allCells.forEach(cell => {
        cell.addEventListener('click', () => {
            allCells.forEach(cell => {
                cell.classList.remove('active');
            });
            cell.classList.add('active');
            const rowIndex = +cell.className[9] - 1;
            const colIndex = +cell.className[11] - 1;
            const keypadButtons = document.querySelectorAll('.k-num');
            if (keypadButtons) {
                keypadButtons.forEach(keypadNumber => {
                    keypadNumber.addEventListener('click', () => {
                        let keypadValue = keypadNumber.textContent;
                        if (keypadValue) {
                            if (cell.classList.contains('active')) {
                                if (keypadValue === 'X') {
                                    cell.classList.remove('inputCell');
                                    cell.textContent = '';
                                    currentBoard[rowIndex][colIndex] = null;
                                }
                                else {
                                    keypadInput = +keypadValue;
                                    cell.classList.add('inputCell');
                                    cell.textContent = keypadValue;
                                    currentBoard[rowIndex][colIndex] = keypadInput;
                                }
                                cell.classList.remove('active');
                            }
                        }
                    }, { once: true });
                });
            }
            document.addEventListener('keydown', (pressed) => {
                if (cell.classList.contains('active')) {
                    if (pressed.key === '0' || pressed.key === 'Delete') {
                        cell.textContent = '';
                        currentBoard[rowIndex][colIndex] = null;
                        cell.classList.remove('inputCell');
                    }
                    else if (validInput.includes(+pressed.key)) {
                        // update display in browser
                        cell.textContent = pressed.key;
                        // update currentBoard
                        currentBoard[rowIndex][colIndex] = +pressed.key;
                        // highlight input cell
                        cell.classList.add('inputCell');
                    }
                    cell.classList.remove('active');
                }
            }, { once: true });
        });
    });
}
// Reset button
const resetButton = document.querySelector('#reset');
if (resetButton) {
    resetButton.addEventListener('click', () => {
        allCells.forEach(cell => {
            cell.classList.remove('inputCell');
            cell.textContent = '';
        });
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                currentBoard[i][j] = x;
            }
        }
    });
}
//# sourceMappingURL=sudoku.js.map