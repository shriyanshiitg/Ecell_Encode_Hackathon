"""
FastAPI Backend for AI Health Copilot
Converted from Express.js to Python
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import time
from datetime import datetime

from services.groq_service import GroqService
from services.context_service import ContextService
from utils.cache import analysis_cache, context_cache
from utils import validators, helpers
from config.settings import settings

# Try to import OCR service (may not be available on all platforms)
try:
    from services.ocr_service import OCRService
    OCR_AVAILABLE = True
except Exception as e:
    print(f"⚠️  OCR service not available: {e}")
    print("📝 Manual text input will still work!")
    OCR_AVAILABLE = False

# Initialize FastAPI app
app = FastAPI(
    title="Smart Food Analyzer API",
    description="AI-native food ingredient analysis",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
]

if settings.NODE_ENV == "production":
    # Allow all origins in production (Vercel domain will vary)
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
groq_service = GroqService()
context_service = ContextService()
if OCR_AVAILABLE:
    ocr_service = OCRService()
else:
    ocr_service = None

# Request Models
class AnalyzeRequest(BaseModel):
    image: str
    fastMode: bool = True
    isMobile: bool = False
    userContext: Optional[Dict[str, Any]] = None

class AnalyzeTextRequest(BaseModel):
    ingredients: str
    productName: Optional[str] = None
    userContext: Optional[Dict[str, Any]] = None
    fastMode: bool = True
    isMobile: bool = False

class ChatRequest(BaseModel):
    message: str
    userContext: Optional[Dict[str, Any]] = None
    conversationHistory: List[Dict[str, Any]] = []

class ContextRequest(BaseModel):
    message: str
    previousContext: Optional[Dict[str, Any]] = None

class AskRequest(BaseModel):
    question: str
    analysisContext: Dict[str, Any]
    userContext: Optional[Dict[str, Any]] = None

class CompareRequest(BaseModel):
    product1: Dict[str, str]
    product2: Dict[str, str]
    userContext: Optional[Dict[str, Any]] = None


# Middleware for request timing
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Routes
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "OK",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/analyze")
async def analyze_image(request: AnalyzeRequest):
    """Analyze ingredient image with OCR"""
    try:
        # Check if OCR is available
        if not OCR_AVAILABLE or ocr_service is None:
            raise HTTPException(status_code=503, detail={
                "code": "OCR_NOT_AVAILABLE",
                "message": "OCR service is not available on this server. Please use manual text input instead. (Tesseract OCR requires system dependencies not available on free hosting tier)"
            })

        start_time = time.time()

        print(f"📷 Processing image with OCR...")

        # Extract text from base64 image using OCR
        try:
            ingredients_text = ocr_service.extract_text_from_base64(request.image)
        except Exception as e:
            print(f"❌ OCR failed: {str(e)}")
            raise HTTPException(status_code=400, detail={
                "code": "OCR_FAILED",
                "message": "Could not extract text from image. Please ensure the image is clear and contains ingredient text."
            })

        # Validate extracted text
        if not ocr_service.is_text_sufficient(ingredients_text):
            print(f"❌ Insufficient text extracted: {ingredients_text[:50]}...")
            raise HTTPException(status_code=400, detail={
                "code": "INSUFFICIENT_INGREDIENTS",
                "message": "Could not find enough ingredient text in the image. Please try a clearer photo focused on the ingredients list."
            })

        print(f"✅ Extracted {len(ingredients_text)} characters from image")
        print(f"📝 Text preview: {ingredients_text[:100]}...")

        # Check cache
        cached_result = analysis_cache.get(ingredients_text)
        if cached_result:
            print("✅ Returning cached result")
            return {**cached_result, "cached": True}

        # Groq Analysis
        print("🤖 Starting Groq AI analysis...")
        ai_start_time = time.time()

        groq_result = await groq_service.analyze(
            ingredients_text,
            user_context=request.userContext,
            fast_mode=request.fastMode,
            is_mobile=request.isMobile
        )

        ai_time = time.time() - ai_start_time
        total_time = time.time() - start_time

        result = {
            "ingredientsText": ingredients_text,
            "productName": "Scanned Product",
            "analysis": groq_result["analysis"],
            "processingTime": total_time,
            "fastMode": request.fastMode,
            "isMobile": request.isMobile,
            "cached": False,
            "aiTime": ai_time,
            "inputMethod": "image"
        }

        # Cache result
        analysis_cache.set(ingredients_text, result)

        print(f"✅ Analysis complete in {total_time*1000:.0f}ms (AI: {ai_time*1000:.0f}ms)")
        return result

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze-text")
async def analyze_text(request: AnalyzeTextRequest):
    """Analyze manually typed ingredients"""
    try:
        start_time = time.time()

        # Validate ingredients
        ingredients_text = validators.sanitize_text(request.ingredients)
        is_valid, error_msg = validators.validate_ingredients(ingredients_text)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)

        print(f"📝 Analyzing manually typed ingredients{f' for {request.productName}' if request.productName else ''}")

        # Check cache
        cached_result = analysis_cache.get(ingredients_text)
        if cached_result:
            print("✅ Returning cached result")
            return {**cached_result, "cached": True}

        # Groq Analysis
        print("🤖 Starting Groq AI analysis...")
        ai_start_time = time.time()

        groq_result = await groq_service.analyze(
            ingredients_text,
            user_context=request.userContext,
            fast_mode=request.fastMode,
            is_mobile=request.isMobile
        )

        ai_time = time.time() - ai_start_time
        total_time = time.time() - start_time

        result = {
            "ingredientsText": ingredients_text,
            "productName": request.productName or "Manual Input",
            "analysis": groq_result["analysis"],
            "processingTime": total_time,
            "fastMode": request.fastMode,
            "isMobile": request.isMobile,
            "cached": False,
            "aiTime": ai_time,
            "inputMethod": "manual"
        }

        # Cache result
        analysis_cache.set(ingredients_text, result)

        print(f"✅ Analysis complete in {total_time*1000:.0f}ms (AI: {ai_time*1000:.0f}ms)")
        return result

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """AI-powered chat responses"""
    try:
        # Validate message
        message = validators.sanitize_text(request.message)
        is_valid, error_msg = validators.validate_message(message)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)

        print(f"💬 Chat request: \"{message[:50]}...\"")

        response = await context_service.generate_chat_response(
            message,
            request.userContext,
            request.conversationHistory
        )

        return {
            **response,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/context")
async def infer_context(request: ContextRequest):
    """Infer user context from their message"""
    try:
        # Validate message
        message = validators.sanitize_text(request.message)
        is_valid, error_msg = validators.validate_message(message)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)

        context = await context_service.infer_context(
            message,
            request.previousContext
        )

        return {
            "context": context,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Context inference error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ask")
async def answer_question(request: AskRequest):
    """Answer follow-up questions"""
    try:
        # Validate question
        question = validators.sanitize_text(request.question)
        is_valid, error_msg = validators.validate_question(question)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)

        if not request.analysisContext:
            raise HTTPException(
                status_code=400,
                detail="Analysis context is required"
            )

        response = await context_service.answer_question(
            question,
            request.analysisContext,
            request.userContext
        )

        return {
            **response,
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Question answering error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/compare")
async def compare_products(request: CompareRequest):
    """Compare two products"""
    try:
        # Validate both products
        product1_ing = request.product1.get("ingredients", "")
        product2_ing = request.product2.get("ingredients", "")

        is_valid, error_msg = validators.validate_comparison_request(product1_ing, product2_ing)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)

        product1_name = request.product1.get("name", "Product 1")
        product2_name = request.product2.get("name", "Product 2")

        print(f"🔍 Comparing: {product1_name} vs {product2_name}")

        # Analyze both products in parallel
        import asyncio
        analysis1, analysis2 = await asyncio.gather(
            groq_service.analyze(
                request.product1["ingredients"],
                user_context=request.userContext,
                fast_mode=True
            ),
            groq_service.analyze(
                request.product2["ingredients"],
                user_context=request.userContext,
                fast_mode=True
            )
        )

        # Generate comparison
        comparison = await groq_service.compare_products(
            request.product1,
            request.product2,
            request.userContext
        )

        return {
            "comparison": comparison,
            "analysis1": analysis1["analysis"],
            "analysis2": analysis2["analysis"],
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Comparison error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    print(f"❌ Unhandled error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )


# Startup event
@app.on_event("startup")
async def startup_event():
    print(f"🚀 Smart Food Analyzer API starting...")
    print(f"📍 Environment: {settings.NODE_ENV}")
    print(f"🤖 AI Model: {settings.GROQ_MODEL}")
    print(f"🔑 API Key configured: {bool(settings.GROQ_API_KEY)}")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 Shutting down gracefully...")
    analysis_cache.clear()
    context_cache.clear()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.NODE_ENV == "development"
    )
