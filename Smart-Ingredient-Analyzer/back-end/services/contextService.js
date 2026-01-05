// services/contextService.js - User Context Inference Service
import fetch from "node-fetch";
import { env } from "../configuration/env.js";

export class ContextService {
  constructor() {
    this.baseUrl = "https://api.groq.com/openai/v1/chat/completions";
    this.apiKey = env.GROQ_API_KEY;
    this.model = env.GROQ_MODEL;
  }

  /**
   * Infer user context from their questions/messages
   */
  async inferContext(userMessage, previousContext = null) {
    try {
      const prompt = `You are analyzing a user's question about food ingredients to infer what they care about.

USER MESSAGE: "${userMessage}"

${previousContext ? `PREVIOUS CONTEXT: ${JSON.stringify(previousContext)}` : ''}

Infer the user's health concerns, dietary preferences, and what they're trying to optimize for.

Return a JSON object with this structure:
{
  "healthConcerns": ["diabetes", "heart-health", "weight-loss", etc],
  "dietaryPreferences": ["vegetarian", "low-sugar", "organic", etc],
  "allergens": ["nuts", "dairy", "gluten", etc],
  "goals": ["lose weight", "build muscle", "improve digestion", etc],
  "confidence": "high|medium|low"
}

Only include what you can reasonably infer. If nothing can be inferred, return empty arrays.
Return ONLY valid JSON, no markdown.`;

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.1,
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        console.warn("Context inference failed, using defaults");
        return null;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      const cleaned = content
        .trim()
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      const objectMatch = cleaned.match(/{[\s\S]*}/);
      if (!objectMatch) return null;

      const context = JSON.parse(objectMatch[0]);

      // Merge with previous context if available
      if (previousContext) {
        return {
          healthConcerns: [...new Set([...(previousContext.healthConcerns || []), ...(context.healthConcerns || [])])],
          dietaryPreferences: [...new Set([...(previousContext.dietaryPreferences || []), ...(context.dietaryPreferences || [])])],
          allergens: [...new Set([...(previousContext.allergens || []), ...(context.allergens || [])])],
          goals: [...new Set([...(previousContext.goals || []), ...(context.goals || [])])],
          confidence: context.confidence
        };
      }

      return context;
    } catch (error) {
      console.warn("Context inference error:", error.message);
      return null;
    }
  }

  /**
   * Generate conversational chat responses
   */
  async generateChatResponse(message, userContext = null, conversationHistory = []) {
    try {
      const contextStr = userContext ? JSON.stringify(userContext, null, 2) : 'None';
      const historyStr = conversationHistory.length > 0
        ? conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')
        : 'No previous conversation';

      const prompt = `You are an AI health copilot helping people understand food ingredients. You're having a natural conversation with a user.

CONVERSATION HISTORY:
${historyStr}

USER CONTEXT (what you've learned):
${contextStr}

USER MESSAGE: "${message}"

Respond conversationally and helpfully. Be:
1. Friendly and supportive
2. Specific about what you've learned about them
3. Encouraging them to scan/upload/type ingredients
4. Honest if you need more information

Return a JSON object:
{
  "response": "Your conversational response",
  "contextLearned": "Brief note on what new context you learned from this message, or null"
}

Return ONLY valid JSON, no markdown.`;

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.7,
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      const cleaned = content
        .trim()
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      const objectMatch = cleaned.match(/{[\s\S]*}/);
      if (!objectMatch) {
        throw new Error("Invalid response format");
      }

      return JSON.parse(objectMatch[0]);
    } catch (error) {
      console.error("Chat response error:", error);
      throw error;
    }
  }

  /**
   * Answer follow-up questions about the analysis
   */
  async answerQuestion(question, analysisContext, userContext = null) {
    try {
      const contextStr = userContext ? JSON.stringify(userContext) : 'None';

      const prompt = `You are a helpful AI health copilot. The user is asking a follow-up question about food ingredients.

USER QUESTION: "${question}"

ANALYSIS CONTEXT:
${JSON.stringify(analysisContext, null, 2)}

${userContext ? `USER CONTEXT:\n${contextStr}` : ''}

Provide a conversational, helpful answer that:
1. Directly addresses their question
2. Explains reasoning and trade-offs
3. Expresses uncertainty when appropriate
4. Stays focused on practical decision-making

Return a JSON object:
{
  "answer": "Your conversational answer here",
  "reasoning": "Why you're giving this answer",
  "suggestions": ["follow-up suggestions if relevant"]
}

Return ONLY valid JSON, no markdown.`;

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.3,
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      const cleaned = content
        .trim()
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      const objectMatch = cleaned.match(/{[\s\S]*}/);
      if (!objectMatch) {
        throw new Error("Invalid response format");
      }

      return JSON.parse(objectMatch[0]);
    } catch (error) {
      console.error("Question answering error:", error);
      throw error;
    }
  }
}

export default new ContextService();
