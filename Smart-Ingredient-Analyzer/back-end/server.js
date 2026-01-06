// server.js - Main Express Server (PRODUCTION LEVEL)
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Config
import { env, validateEnv } from "./configuration/env.js";
import { RATE_LIMIT_CONFIG } from "./configuration/constants.js";

// Services & Utils
import groqService from "./services/groqService.js";
import contextService from "./services/contextService.js";
import cacheManager from "./utils/cache.js";
import Validators from "./utils/validators.js";
import AnalysisHelpers from "./utils/helpers.js";
import ErrorHandler from "./middleware/errorHandler.js";

// OCR functions
import {
  preprocessImage,
  performOCRWithMultipleVersions,
  performSmartOCR,
  ultraFastPreprocess,
} from "./optimized-ocr.js";

// Validate environment
validateEnv();

const app = express();
const PORT = env.PORT;

// ============= MIDDLEWARE =============

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.windowMs,
  max: RATE_LIMIT_CONFIG.max,
  message: { error: "Too many requests, please try again later" },
});
app.use(limiter);

// CORS
app.options("*", cors());
app.use(
  cors({
    origin:
      env.NODE_ENV === "production"
        ? [
            "https://smart-ingredient-analyzer.vercel.app",
            "https://ai-ingredient-analyzer.vercel.app",
            /\.vercel\.app$/,
          ]
        : [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:4173",
            "http://127.0.0.1:5173",
          ],
    credentials: true,
  })
);

// Body parser
app.use(bodyParser.json({ limit: "10mb" }));

// Request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// ============= ROUTES =============

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.post("/api/analyze", async (req, res, next) => {
  try {
    const startTime = Date.now();

    // Validate request body
    const bodyValidation = Validators.validateRequestBody(req);
    if (!bodyValidation.valid) {
      console.error(`❌ ${bodyValidation.error}`);
      return res.status(400).json(bodyValidation);
    }

    const { image, fastMode = true, isMobile = false, userContext = null } = req.body;

    // Validate image field
    const imageValidation = Validators.validateImage(image);
    if (!imageValidation.valid) {
      console.error(`❌ ${imageValidation.error}`);
      return res.status(400).json(imageValidation);
    }

    // Extract and validate base64
    let imageBuffer;
    try {
      const base64Data = image.includes(",") ? image.split(",")[1] : image;

      const base64Validation = Validators.validateBase64(base64Data);
      if (!base64Validation.valid) {
        console.error(`❌ ${base64Validation.error}`);
        return res.status(400).json(base64Validation);
      }

      imageBuffer = Buffer.from(base64Data, "base64");

      const bufferValidation = Validators.validateImageBuffer(imageBuffer);
      if (!bufferValidation.valid) {
        console.error(`❌ ${bufferValidation.error}`);
        return res
          .status(bufferValidation.statusCode || 400)
          .json(bufferValidation);
      }
    } catch (bufferError) {
      console.error("❌ Buffer creation error:", bufferError.message);
      return res.status(400).json({
        error: "Invalid image data format",
        code: "INVALID_IMAGE_DATA",
        details: bufferError.message,
      });
    }

    // Log image size for debugging
    console.log(
      `📊 Image size: ${(imageBuffer.length / 1024).toFixed(
        1
      )}KB, buffer length: ${imageBuffer.length}`
    );

    // Validate image size limits
    const maxSizeBytes = 15 * 1024 * 1024; // 15MB for higher quality images
    if (imageBuffer.length > maxSizeBytes) {
      console.error(`❌ Image too large: ${imageBuffer.length} bytes`);
      return res.status(413).json({
        error: "Image file too large",
        code: "IMAGE_TOO_LARGE",
        maxSize: "15MB",
      });
    }

    const minSizeBytes = 1024; // 1KB minimum
    if (imageBuffer.length < minSizeBytes) {
      console.error(`❌ Image too small: ${imageBuffer.length} bytes`);
      return res.status(400).json({
        error: "Image file too small",
        code: "IMAGE_TOO_SMALL",
        minSize: "1KB",
      });
    }

    let bestOcrResult;
    try {
      console.log("🔍 Starting OCR processing...");

      // Try fast mode first
      try {
        const processedBuffer = await ultraFastPreprocess(
          imageBuffer,
          isMobile
        );
        bestOcrResult = await performSmartOCR(processedBuffer);
        console.log("✅ Fast OCR mode successful");
      } catch (fastError) {
        console.log(
          `⚠️ Fast mode failed: ${fastError.message}, trying standard mode...`
        );

        // Fallback to standard mode
        const processedImages = await preprocessImage(imageBuffer);
        bestOcrResult = await performOCRWithMultipleVersions(processedImages);
        console.log("✅ Standard OCR mode successful");
      }

      if (!bestOcrResult) {
        console.error("❌ OCR returned no results");
        return res
          .status(400)
          .json({ error: "OCR failed", code: "OCR_FAILED" });
      }

      if (!bestOcrResult.text) {
        console.error("❌ OCR returned empty text");
        return res.status(400).json({
          error: "No text detected in image",
          code: "NO_TEXT_DETECTED",
        });
      }
    } catch (ocrError) {
      console.error("❌ OCR processing failed:", ocrError.message);
      return res.status(400).json({
        error: ocrError.message || "Unable to process image",
        code: "OCR_PROCESSING_FAILED",
      });
    }

    // Extract ingredients
    const ingredientsOnly = AnalysisHelpers.extractIngredients(
      bestOcrResult.text
    );

    let finalIngredients; // <-- declare once in parent scope

    // Validate ingredients
    if (!ingredientsOnly || ingredientsOnly.length < 5) {
      const fallbackIngredients = bestOcrResult.text
        .replace(/nutritional information.*$/i, "")
        .replace(/serving size.*$/i, "")
        .replace(/manufactured.*$/i, "")
        .trim();

      if (!fallbackIngredients || fallbackIngredients.length < 10) {
        console.error("❌ Insufficient ingredients extracted");
        return res.status(400).json({
          error:
            "No ingredient list found in image. Please focus on the ingredients section of the food label.",
          code: "INSUFFICIENT_INGREDIENTS",
          extractedText: ingredientsOnly,
          debug: {
            originalText: bestOcrResult.text,
            extractedLength: ingredientsOnly?.length || 0,
            ocrMethod: bestOcrResult.method,
            ocrConfidence: bestOcrResult.confidence,
          },
        });
      }

      // ✅ assign here
      finalIngredients = fallbackIngredients;
    } else {
      // ✅ assign here
      finalIngredients = ingredientsOnly;
    }

    // from here onwards finalIngredients is guaranteed defined
    const cacheKey = cacheManager.generateKey(finalIngredients);
    const cachedResult = cacheManager.get(cacheKey);
    // ... rest of your logic

    if (cachedResult) {
      console.log("✅ Returning cached result");
      return res.json({ ...cachedResult, cached: true });
    }

    // Groq Analysis
    console.log("🤖 Starting Groq AI analysis...");
    const aiStartTime = Date.now();

    try {
      const groqResult = await groqService.analyze(finalIngredients, {
        isMobile,
        fastMode,
        userContext,
      });

      const aiTime = Date.now() - aiStartTime;
      const totalTime = Date.now() - startTime;

      const result = {
        ingredientsText: finalIngredients,
        analysis: groqResult.analysis,
        ocrConfidence: bestOcrResult.confidence,
        ocrMethod: bestOcrResult.method,
        processingTime: totalTime,
        fastMode,
        isMobile,
        cached: false,
        aiTime,
      };

      // Cache result
      cacheManager.set(cacheKey, result);

      console.log(
        `✅ Analysis complete in ${totalTime}ms (AI: ${aiTime}ms, OCR: ${
          totalTime - aiTime
        }ms)`
      );
      res.json(result);
    } catch (groqError) {
      console.error("❌ Groq service error:", groqError.message);

      // Re-throw with context
      const error = new Error(groqError.message);
      error.code = "GROQ_API_ERROR";
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// AI-powered chat responses
app.post("/api/chat", async (req, res, next) => {
  try {
    const { message, userContext, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: "Message is required",
        code: "INVALID_MESSAGE"
      });
    }

    console.log(`💬 Chat request: "${message.substring(0, 50)}..."`);

    const response = await contextService.generateChatResponse(
      message,
      userContext,
      conversationHistory
    );

    res.json({
      ...response,
      success: true
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    next(error);
  }
});

// Infer user context from their message
app.post("/api/context", async (req, res, next) => {
  try {
    const { message, previousContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: "Message is required",
        code: "INVALID_MESSAGE"
      });
    }

    const context = await contextService.inferContext(message, previousContext);

    res.json({
      context,
      success: true
    });
  } catch (error) {
    next(error);
  }
});

// Answer follow-up questions
app.post("/api/ask", async (req, res, next) => {
  try {
    const { question, analysisContext, userContext } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        error: "Question is required",
        code: "INVALID_QUESTION"
      });
    }

    if (!analysisContext) {
      return res.status(400).json({
        error: "Analysis context is required",
        code: "MISSING_CONTEXT"
      });
    }

    const response = await contextService.answerQuestion(
      question,
      analysisContext,
      userContext
    );

    res.json({
      ...response,
      success: true
    });
  } catch (error) {
    next(error);
  }
});

// Analyze manually typed ingredients
app.post("/api/analyze-text", async (req, res, next) => {
  try {
    const startTime = Date.now();
    const { ingredients, productName, userContext = null, fastMode = true, isMobile = false } = req.body;

    if (!ingredients || typeof ingredients !== 'string') {
      return res.status(400).json({
        error: "Ingredients text is required",
        code: "INVALID_INGREDIENTS"
      });
    }

    if (ingredients.trim().length < 10) {
      return res.status(400).json({
        error: "Ingredient list seems too short. Please provide a complete list.",
        code: "INSUFFICIENT_INGREDIENTS"
      });
    }

    console.log(`📝 Analyzing manually typed ingredients${productName ? ` for ${productName}` : ''}`);

    const ingredientsText = ingredients.trim();
    const cacheKey = cacheManager.generateKey(ingredientsText);
    const cachedResult = cacheManager.get(cacheKey);

    if (cachedResult) {
      console.log("✅ Returning cached result");
      return res.json({ ...cachedResult, cached: true });
    }

    // Groq Analysis
    console.log("🤖 Starting Groq AI analysis...");
    const aiStartTime = Date.now();

    try {
      const groqResult = await groqService.analyze(ingredientsText, {
        isMobile,
        fastMode,
        userContext,
      });

      const aiTime = Date.now() - aiStartTime;
      const totalTime = Date.now() - startTime;

      const result = {
        ingredientsText,
        productName: productName || 'Manual Input',
        analysis: groqResult.analysis,
        processingTime: totalTime,
        fastMode,
        isMobile,
        cached: false,
        aiTime,
        inputMethod: 'manual'
      };

      // Cache result
      cacheManager.set(cacheKey, result);

      console.log(`✅ Analysis complete in ${totalTime}ms (AI: ${aiTime}ms)`);
      res.json(result);
    } catch (groqError) {
      console.error("❌ Groq service error:", groqError.message);
      const error = new Error(groqError.message);
      error.code = "GROQ_API_ERROR";
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// Compare two products
app.post("/api/compare", async (req, res, next) => {
  try {
    const { product1, product2, userContext } = req.body;

    if (!product1?.ingredients || !product2?.ingredients) {
      return res.status(400).json({
        error: "Both products with ingredients are required",
        code: "MISSING_PRODUCTS"
      });
    }

    console.log(`🔍 Comparing: ${product1.name || 'Product 1'} vs ${product2.name || 'Product 2'}`);

    // Analyze both products
    const [analysis1, analysis2] = await Promise.all([
      groqService.analyze(product1.ingredients, { userContext, fastMode: true }),
      groqService.analyze(product2.ingredients, { userContext, fastMode: true })
    ]);

    // Generate comparison using AI
    const comparisonPrompt = `You are comparing two food products for a health-conscious user.

PRODUCT 1 (${product1.name || 'Product A'}):
Ingredients: ${product1.ingredients}

PRODUCT 2 (${product2.name || 'Product B'}):
Ingredients: ${product2.ingredients}

${userContext ? `USER CONTEXT: ${JSON.stringify(userContext)}` : ''}

Return a JSON comparison:
{
  "winner": "Clear recommendation: which product is better and why (1-2 sentences)",
  "product1": {
    "score": 1-10 rating,
    "pros": ["list of advantages"],
    "cons": ["list of disadvantages"],
    "summary": "One sentence summary"
  },
  "product2": {
    "score": 1-10 rating,
    "pros": ["list of advantages"],
    "cons": ["list of disadvantages"],
    "summary": "One sentence summary"
  },
  "keyDifferences": ["list of most important differences"]
}

Be conversational and focus on practical decision-making. Consider trade-offs.`;

    const comparisonResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        temperature: 0.1,
        max_tokens: 1500,
        messages: [{ role: "user", content: comparisonPrompt }],
      }),
    });

    const comparisonData = await comparisonResponse.json();
    const comparisonText = comparisonData.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = comparisonText.match(/{[\s\S]*}/);
    const comparison = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!comparison) {
      throw new Error("Failed to generate comparison");
    }

    res.json({
      comparison,
      analysis1: analysis1.analysis,
      analysis2: analysis2.analysis,
      success: true
    });

  } catch (error) {
    console.error('Comparison error:', error);
    next(error);
  }
});

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  ErrorHandler.handle(error, req, res);
});

// ============= GRACEFUL SHUTDOWN =============

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  cacheManager.close();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  cacheManager.close();
  process.exit(0);
});

// ============= START SERVER =============

app.listen(PORT, () => {
  console.log(`🚀 Smart Food Analyzer API running on port ${PORT}`);
  console.log(`📍 Environment: ${env.NODE_ENV}`);
  console.log(`🤖 AI Model: ${env.GROQ_MODEL}`);
});

export default app;
