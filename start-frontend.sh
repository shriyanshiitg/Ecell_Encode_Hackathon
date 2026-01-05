#!/bin/bash

echo "🎨 Starting Frontend..."
echo ""

cd Smart-Ingredient-Analyzer/front-end

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies not installed. Installing now..."
    npm install
fi

echo "Starting frontend on port 5173..."
echo "Keep this terminal window open!"
echo ""
echo "Open your browser at: http://localhost:5173"
echo ""

npm run dev
