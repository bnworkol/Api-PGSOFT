```markdown
# PGSoft Treasure Aztec Calculator Project

This project is a browser-based application that:
- Allows the user to enter a game URL.
- Loads the game in an iframe.
- Enables the user to set a bet price.
- Starts a real-time win percentage calculation when the "Start Program" button is pressed.
- Auto-triggers a game play when the win percentage exceeds 70%.

## Files

- **package.json**: Defines project metadata and dependencies.
- **tsconfig.json**: Configures TypeScript.
- **replit.nix**: Provides configuration for running on Replit.
- **public/index.html**: The main HTML file containing the UI.
- **src/index.ts**: Contains the TypeScript logic for loading the game, calculating win percentage, and triggering auto-play.

## How to Run on Replit

1. **Create a New Replit Project:**
   - Go to [Replit](https://replit.com) and create a new Replit.
   - Choose "Import from GitHub" (optional) or create a new project and paste these files.

2. **Install Dependencies:**
   - Replit will use the `replit.nix` file to set up the Node.js environment.
   - If necessary, open the shell and run:
     ```
     npm install
     ```

3. **Start the Development Server:**
   - Run:
     ```
     npm start
     ```
   - A URL will be provided (commonly in the format `https://<your-repl-username>.<project-name>.repl.co`).

4. **Using the Application:**
   - Open the provided URL in your browser.
   - Enter your desired game URL (or use the default) and bet price.
   - Click the "Start Program" button.
   - The game will load in the iframe, and the win percentage will be calculated every second.
   - When the win percentage exceeds 70%, the system will automatically trigger the play action.

Happy coding!
```
