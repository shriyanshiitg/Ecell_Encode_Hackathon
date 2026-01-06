# Backend (Python FastAPI)

FastAPI backend for the Smart Food Analyzer.

## Features

- **FastAPI**: Modern, fast Python web framework
- **Async/Await**: Non-blocking I/O for better performance
- **Type Safety**: Full type hints with Pydantic validation
- **Auto Documentation**: OpenAPI/Swagger docs at `/docs`
- **CORS Support**: Cross-origin requests enabled

## Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Or with virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

The `.env` file should already exist with the Groq API key:

```env
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
PORT=5001
```

### 3. Run the Server

```bash
uvicorn main:app --reload --port 5001
```

Or with hot reload:

```bash
python -m uvicorn main:app --reload --port 5001
```

The server will start at: **http://localhost:5001**

## API Endpoints

All endpoints are identical to the Node.js version:

- `GET /health` - Health check
- `POST /api/analyze-text` - Analyze typed ingredients
- `POST /api/chat` - Conversational responses
- `POST /api/context` - Infer user preferences
- `POST /api/ask` - Answer follow-up questions
- `POST /api/compare` - Compare two products

## API Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI**: http://localhost:5001/docs
- **ReDoc**: http://localhost:5001/redoc

## Project Structure

```
backend/
├── main.py                    # FastAPI application
├── config/
│   └── settings.py           # Configuration management
├── services/
│   ├── groq_service.py       # AI analysis logic
│   └── context_service.py    # Context inference
├── utils/
│   ├── cache.py              # Caching utilities
│   ├── validators.py         # Request validation
│   └── helpers.py            # Helper functions
├── requirements.txt          # Python dependencies
└── .env                      # Environment variables
```

## Key Technologies

- **FastAPI** 0.109.0 - Web framework
- **Uvicorn** 0.27.0 - ASGI server
- **httpx** 0.26.0 - Async HTTP client
- **Pydantic** 2.5.3 - Data validation
- **Python** 3.9+ required

## Key Features

1. **Type Safety**: Full type hints throughout
2. **Async Native**: Built-in async/await support
3. **Auto Validation**: Pydantic models validate requests automatically
4. **Auto Docs**: OpenAPI documentation generated automatically
5. **Fast Performance**: Optimized for high-throughput AI requests

## Development

### Install Dev Dependencies

```bash
pip install black ruff pytest
```

### Format Code

```bash
black .
```

### Lint Code

```bash
ruff check .
```

## Testing with Frontend

The React frontend connects automatically. Just ensure:

1. Backend is running on port 5001
2. Frontend is running on port 5173
3. Both servers are started (see main README)

## Deployment

For production deployment:

```bash
uvicorn main:app --host 0.0.0.0 --port 5001 --workers 4
```

Or use Gunicorn with Uvicorn workers:

```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:5001
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

### Module Not Found

```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### CORS Issues

CORS is configured to allow all origins in development. Check [main.py:25-31](main.py#L25-L31) for CORS settings.
