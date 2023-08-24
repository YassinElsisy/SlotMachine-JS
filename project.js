// 1. Deposit Money
// 2. Determine # of lines
// 3. Collect bet amount
// 4. Spin slot machine
// 5. Check if user won
// 6. Pay user their winnings
// 7. Play again

const prompt = require("prompt-sync")();

// slot rows & cols
const ROWS = 3;
const COLS = 3;

// slot - number of symbols
const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

// slot - symbol values
const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

// Collect deposit amount
const deposit = () => {
  while (true) {
    const depositAmount = prompt("Please enter deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    //   Check if deposit amount is valid
    if (numberDepositAmount <= 0 || isNaN(numberDepositAmount)) {
      console.log("Invalid deposit amount, please try again!");
    } else {
      return numberDepositAmount;
    }
  }
};

// Collect number of lines
const getNumberOfLines = () => {
  while (true) {
    const lines = prompt(
      "Please enter the number of lines you would like to bet on (1-3): "
    );
    const numberOfLines = parseFloat(lines);

    //   Check if number of lines is valid
    if (numberOfLines <= 0 || numberOfLines > 3 || isNaN(numberOfLines)) {
      console.log("Invalid number of lines, please try again!");
    } else {
      return numberOfLines;
    }
  }
};

// Collect bet amount
const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Please enter the bet per line: ");
    const betAmount = parseFloat(bet);

    //   Check if bet is valid
    if (betAmount <= 0 || betAmount > balance / lines || isNaN(betAmount)) {
      console.log("Invalid bet, please try again!");
    } else {
      return betAmount;
    }
  }
};

// generate slot spin
const slotSpin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  //   generate reels
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymvol = reelSymbols[randomIndex];
      reels[i].push(selectedSymvol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

// print the rows of the slot machine
const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

// check if user won and repay winnings
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();
  while (true) {
    console.log("You have a balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = slotSpin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("You won $" + winnings.toString());

    if (balance <= 0) {
      console.log("Please deposit more money to play again!");
      break;
    }

    const playAgain = prompt("Would you like to play again (y/n)? ");
    if (playAgain != "y") {
      break;
    }
  }
};

game();
