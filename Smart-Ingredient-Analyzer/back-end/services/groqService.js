// services/groqService.js - Groq AI Service
import fetch from "node-fetch";
import { env } from "../configuration/env.js";
import { GROQ_TIMEOUT, GROQ_TOKENS } from "../configuration/constants.js";

export class GroqService {
  constructor() {
    this.baseUrl = "https://api.groq.com/openai/v1/chat/completions";
    this.apiKey = env.GROQ_API_KEY;
    this.model = env.GROQ_MODEL;
  }

  createPrompt(ingredients, userContext = null) {
    const contextPart = userContext
      ? `\n\nUSER CONTEXT (inferred from conversation):\n${JSON.stringify(userContext, null, 2)}\n`
      : '';

    return `You are an AI health copilot helping people understand food ingredients at the moment of decision-making. Your role is to INTERPRET and EXPLAIN, not just list data.

CORE PRINCIPLES:
1. Be conversational and intent-first - infer what matters to the user
2. Explain WHY things matter, not just WHAT they are
3. Express uncertainty honestly when evidence is mixed
4. Focus on trade-offs (taste vs health, natural vs processed, cost vs quality)
5. Reduce cognitive load - make decisions easier, not harder
6. Be proactive - anticipate questions and offer relevant insights
7. Act like a copilot - suggest next steps and alternatives

${contextPart}

ANALYZE THESE INGREDIENTS:
${ingredients}

You must return a JSON object with this structure:
{
  "summary": "A natural, conversational 2-3 sentence summary about this product. Focus on what the user would care about most.",
  "keyInsights": [
    {
      "insight": "Brief conversational insight",
      "explanation": "Why this matters to the user",
      "uncertaintyLevel": "low|medium|high",
      "reasoning": "The logic behind this conclusion",
      "tradeoff": "Explain the trade-off: what benefit exists vs what cost/risk (e.g., 'Preserves freshness for months but may cause digestive discomfort in sensitive individuals')"
    }
  ],
  "ingredients": [
    {
      "name": "ingredient name",
      "category": "Good|Neutral|Concerning|Unknown",
      "explanation": "Human-friendly explanation of what this is and why it matters",
      "tradeoffs": "Detailed trade-off analysis: benefit vs drawback (e.g., 'Taste: excellent sweetness | Health: rapid blood sugar spike | Cost: cheaper than alternatives')",
      "uncertainty": "Any uncertainty or conflicting evidence",
      "relevantTo": ["allergy", "diabetes", "heart-health", etc],
      "alternatives": "Better alternatives if this is concerning (e.g., 'Look for honey or cane sugar instead')"
    }
  ],
  "inferredConcerns": ["health concerns we think matter based on ingredients"],
  "recommendedQuestions": ["questions the user might want to ask"],
  "proactiveSuggestions": [
    {
      "suggestion": "Proactive insight or recommendation based on analysis",
      "reasoning": "Why this suggestion matters",
      "priority": "high|medium|low"
    }
  ],
  "aiQuestions": [
    "Questions the AI wants to ask the user to better understand their needs (e.g., 'Do you usually consume this in the morning or evening?', 'Are you sensitive to caffeine?')"
  ],
  "overallAssessment": {
    "verdict": "One clear sentence: Should they buy this? (e.g., 'Good choice for quick energy, but watch portion size if managing blood sugar')",
    "bestFor": "Who is this product ideal for? (e.g., 'Active individuals needing quick carbs')",
    "notIdealFor": "Who should avoid or be cautious? (e.g., 'People with diabetes or blood sugar concerns')",
    "betterAlternative": "Suggest a better option if concerns exist (e.g., 'Try steel-cut oats with fresh fruit for sustained energy')"
  }
}

CRITICAL REQUIREMENTS:
- Every keyInsight MUST have a "tradeoff" field explaining benefit vs cost
- Every concerning ingredient MUST suggest alternatives
- Include 1-3 proactiveSuggestions based on what you notice
- Ask 1-2 aiQuestions to better understand user context
- Give clear verdict in overallAssessment - help them decide!
- Return ONLY valid JSON, no markdown, no code fences
- Use single quotes inside strings if needed
- Be conversational but keep explanations concise (1-2 sentences)
- Express uncertainty when appropriate
- Focus on practical decision-making, not academic knowledge`;
  }

  async analyze(ingredients, options = {}) {
    const { isMobile = false, fastMode = true, userContext = null } = options;

    try {
      const prompt = this.createPrompt(ingredients, userContext);
      const timeout = isMobile
        ? GROQ_TIMEOUT.mobile
        : fastMode
        ? GROQ_TIMEOUT.fast
        : GROQ_TIMEOUT.normal;
      const maxTokens = isMobile
        ? GROQ_TOKENS.mobile * 2 // More tokens for conversational responses
        : fastMode
        ? GROQ_TOKENS.fast * 2
        : GROQ_TOKENS.normal * 2;

      const startTime = Date.now();

      const response = await Promise.race([
        this.sendRequest(prompt, maxTokens),
        this.createTimeoutPromise(timeout),
      ]);

      const aiTime = Date.now() - startTime;

      if (!response.ok) {
        let errorMessage = `Groq API HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += `: ${errorData.error?.message || "Unknown error"}`;
        } catch {
          // ignore JSON parse errors for error responses
        }
        const err = new Error(errorMessage);
        err.code = "GROQ_HTTP_ERROR";
        throw err;
      }

      const data = await response.json();

      if (data.error) {
        const err = new Error(data.error.message || "Groq API error");
        err.code = "GROQ_API_ERROR";
        throw err;
      }

      let groqText = data.choices?.[0]?.message?.content || "";

      if (!groqText) {
        const err = new Error("Empty response from Groq API");
        err.code = "GROQ_EMPTY_CONTENT";
        throw err;
      }

      // --- Clean & extract JSON object safely ---

      // Remove any code fences if they appear
      let cleaned = groqText
        .trim()
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      // Try to grab the main JSON object: { ... }
      const objectMatch = cleaned.match(/{[\s\S]*}/);
      if (!objectMatch) {
        const err = new Error("Groq did not return a JSON object");
        err.code = "GROQ_NO_JSON";
        throw err;
      }

      const jsonText = objectMatch[0];

      let analysis;
      try {
        // Primary parse attempt
        analysis = JSON.parse(jsonText);
      } catch (parseError) {
        console.warn(
          "Primary JSON.parse failed:",
          parseError.message
        );
        const err = new Error(
          `Failed to parse Groq response: ${parseError.message}`
        );
        err.code = "GROQ_PARSE_ERROR";
        throw err;
      }

      // Validate structure
      if (!analysis.summary || !analysis.keyInsights || !analysis.ingredients) {
        const err = new Error("Invalid response structure from AI");
        err.code = "GROQ_INVALID_STRUCTURE";
        throw err;
      }

      // Set defaults for new fields if missing
      analysis.proactiveSuggestions = analysis.proactiveSuggestions || [];
      analysis.aiQuestions = analysis.aiQuestions || [];
      analysis.overallAssessment = analysis.overallAssessment || {
        verdict: "Analysis complete",
        bestFor: "General use",
        notIdealFor: "None identified",
        betterAlternative: null
      };

      return {
        analysis,
        aiTime,
        success: true,
      };
    } catch (error) {
      console.error("❌ Groq Service Error:", error);
      throw error;
    }
  }

  async sendRequest(prompt, maxTokens) {
    return fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.1,
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });
  }

  createTimeoutPromise(timeoutMs) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Groq timeout")), timeoutMs)
    );
  }
}

export default new GroqService();
