#!/bin/bash

# Check if node_modules directory exists, if not, run npm install
if [ ! -d "node_modules" ]; then
  echo "--- Installing required dependencies... ---"
  npm install
fi

echo "--- Starting Discord Bot... ---"

# Start the bot
npx nodemon src/index.js