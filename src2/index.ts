
console.log("Welcome to PGSoft Treasure Aztec Calculator Project!");

// Function to update the iframe src based on the game URL input.
function loadGame() {
  const gameUrlInput = document.getElementById("game-url") as HTMLInputElement;
  const gameFrame = document.getElementById("game-frame") as HTMLIFrameElement;
  if (gameUrlInput && gameFrame) {
    gameFrame.src = gameUrlInput.value;
  }
}

// Simulated function to calculate the win percentage.
// In a production scenario, you may analyze API data from the game.
// Here it uses a random value plus a bonus based on the bet price.
function calculateWinPercentage(bet: number): number {
  const baseChance = Math.random() * 100; // random base chance (0-100%)
  const bonus = bet * 0.1;               // simple bonus multiplier
  return Math.min(baseChance + bonus, 100);
}

// Simulated function to auto-play the game when win percentage exceeds 70%.
// Here, it just displays a message. In reality, you might trigger an API or postMessage.
function autoPlayGame(bet: number): void {
  console.log(`Auto-playing game with bet: ${bet}`);
  const outputEl = document.getElementById("output");
  if (outputEl) {
    outputEl.innerText = "Auto Play Triggered: Game started with bet " + bet;
  }
}

// Set up event listener for the "Start Program" button.
document.getElementById("start-program")?.addEventListener("click", () => {
  // Load the game URL into the iframe.
  loadGame();

  const betInput = document.getElementById("bet-price") as HTMLInputElement;
  const betValue = Number(betInput?.value);

  if (!betValue || betValue <= 0) {
    alert("Please enter a valid bet price");
    return;
  }
  
  console.log("Start Program button clicked with bet:", betValue);
  const outputEl = document.getElementById("output");

  // Start a continuous loop: calculate win percentage every second.
  const intervalId = setInterval(() => {
    const winPercentage = calculateWinPercentage(betValue);
    console.log(`Calculated Win Percentage: ${winPercentage.toFixed(2)}%`);
    if (outputEl) {
      outputEl.innerText = `Win Percentage: ${winPercentage.toFixed(2)}%`;
    }
    
    // If win percentage exceeds 70%, trigger auto-play.
    if (winPercentage > 70) {
      autoPlayGame(betValue);
      // Optionally, if you wish to stop after triggering auto-play once, uncomment the next line.
      // clearInterval(intervalId);
    }
  }, 1000); // Check every second

  // Clear the interval when the page is unloaded.
  window.addEventListener("beforeunload", () => {
    clearInterval(intervalId);
  });
});
