"""
Groq AI Service
Handles AI analysis with Llama 3.3 70B
"""

import json
import re
import httpx
import asyncio
from typing import Dict, Any, Optional

from config.settings import settings, GROQ_TIMEOUT, GROQ_TOKENS


class GroqService:
    """Service for Groq AI analysis"""

    def __init__(self):
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL

    def create_prompt(self, ingredients: str, user_context: Optional[Dict] = None) -> str:
        """Create analysis prompt"""
        context_part = ""
        if user_context:
            context_part = f"\n\nUSER CONTEXT (inferred from conversation):\n{json.dumps(user_context, indent=2)}\n"

        return f"""You are an AI health copilot helping people understand food ingredients at the moment of decision-making. Your role is to INTERPRET and EXPLAIN, not just list data.

CORE PRINCIPLES:
1. Be conversational and intent-first - infer what matters to the user
2. Explain WHY things matter, not just WHAT they are
3. Express uncertainty honestly when evidence is mixed
4. Focus on trade-offs (taste vs health, natural vs processed, cost vs quality)
5. Reduce cognitive load - make decisions easier, not harder
6. Be proactive - anticipate questions and offer relevant insights
7. Act like a copilot - suggest next steps and alternatives

{context_part}

ANALYZE THESE INGREDIENTS:
{ingredients}

You must return a JSON object with this structure:
{{
  "summary": "A natural, conversational 2-3 sentence summary about this product. Focus on what the user would care about most.",
  "keyInsights": [
    {{
      "insight": "Brief conversational insight",
      "explanation": "Why this matters to the user",
      "uncertaintyLevel": "low|medium|high",
      "reasoning": "The logic behind this conclusion",
      "tradeoff": "Explain the trade-off: what benefit exists vs what cost/risk"
    }}
  ],
  "ingredients": [
    {{
      "name": "ingredient name",
      "category": "Good|Neutral|Concerning|Unknown",
      "explanation": "Human-friendly explanation of what this is and why it matters",
      "tradeoffs": "Detailed trade-off analysis: benefit vs drawback",
      "uncertainty": "Any uncertainty or conflicting evidence",
      "relevantTo": ["allergy", "diabetes", "heart-health"],
      "alternatives": "Better alternatives if this is concerning"
    }}
  ],
  "inferredConcerns": ["health concerns we think matter based on ingredients"],
  "recommendedQuestions": ["questions the user might want to ask"],
  "proactiveSuggestions": [
    {{
      "suggestion": "Proactive insight or recommendation based on analysis",
      "reasoning": "Why this suggestion matters",
      "priority": "high|medium|low"
    }}
  ],
  "aiQuestions": [
    "Questions the AI wants to ask the user to better understand their needs"
  ],
  "overallAssessment": {{
    "verdict": "One clear sentence: Should they buy this?",
    "bestFor": "Who is this product ideal for?",
    "notIdealFor": "Who should avoid or be cautious?",
    "betterAlternative": "Suggest a better option if concerns exist"
  }}
}}

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
- Focus on practical decision-making, not academic knowledge"""

    async def analyze(
        self,
        ingredients: str,
        user_context: Optional[Dict] = None,
        fast_mode: bool = True,
        is_mobile: bool = False
    ) -> Dict[str, Any]:
        """Analyze ingredients with AI"""
        try:
            prompt = self.create_prompt(ingredients, user_context)

            # Determine timeout and tokens
            if is_mobile:
                timeout = GROQ_TIMEOUT["mobile"]
                max_tokens = GROQ_TOKENS["mobile"] * 2
            elif fast_mode:
                timeout = GROQ_TIMEOUT["fast"]
                max_tokens = GROQ_TOKENS["fast"] * 2
            else:
                timeout = GROQ_TIMEOUT["normal"]
                max_tokens = GROQ_TOKENS["normal"] * 2

            # Make API request
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    json={
                        "model": self.model,
                        "temperature": 0.1,
                        "max_tokens": max_tokens,
                        "messages": [
                            {"role": "user", "content": prompt}
                        ]
                    }
                )

            if response.status_code != 200:
                error_detail = response.text
                try:
                    error_json = response.json()
                    error_detail = error_json.get("error", {}).get("message", error_detail)
                except:
                    pass
                raise Exception(f"Groq API HTTP {response.status_code}: {error_detail}")

            data = response.json()

            if "error" in data:
                raise Exception(data["error"].get("message", "Groq API error"))

            groq_text = data.get("choices", [{}])[0].get("message", {}).get("content", "")

            if not groq_text:
                raise Exception("Empty response from Groq API")

            # Clean and extract JSON
            cleaned = groq_text.strip()
            cleaned = re.sub(r'^```json\s*', '', cleaned, flags=re.IGNORECASE)
            cleaned = re.sub(r'^```\s*', '', cleaned)
            cleaned = re.sub(r'```\s*$', '', cleaned)
            cleaned = cleaned.strip()

            # Extract JSON object
            json_match = re.search(r'\{[\s\S]*\}', cleaned)
            if not json_match:
                raise Exception("Groq did not return a JSON object")

            json_text = json_match.group(0)

            try:
                analysis = json.loads(json_text)
            except json.JSONDecodeError as e:
                raise Exception(f"Failed to parse Groq response: {str(e)}")

            # Validate structure
            if not all(key in analysis for key in ["summary", "keyInsights", "ingredients"]):
                raise Exception("Invalid response structure from AI")

            # Set defaults for new fields
            analysis.setdefault("proactiveSuggestions", [])
            analysis.setdefault("aiQuestions", [])
            analysis.setdefault("overallAssessment", {
                "verdict": "Analysis complete",
                "bestFor": "General use",
                "notIdealFor": "None identified",
                "betterAlternative": None
            })

            return {
                "analysis": analysis,
                "success": True
            }

        except Exception as e:
            print(f"❌ Groq Service Error: {str(e)}")
            raise

    async def compare_products(
        self,
        product1: Dict[str, str],
        product2: Dict[str, str],
        user_context: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Compare two products"""
        product1_name = product1.get("name", "Product A")
        product2_name = product2.get("name", "Product B")

        context_str = ""
        if user_context:
            context_str = f"USER CONTEXT: {json.dumps(user_context)}"

        comparison_prompt = f"""You are comparing two food products for a health-conscious user.

PRODUCT 1 ({product1_name}):
Ingredients: {product1['ingredients']}

PRODUCT 2 ({product2_name}):
Ingredients: {product2['ingredients']}

{context_str}

Return a JSON comparison:
{{
  "winner": "Clear recommendation: which product is better and why (1-2 sentences)",
  "product1": {{
    "score": "1-10 rating",
    "pros": ["list of advantages"],
    "cons": ["list of disadvantages"],
    "summary": "One sentence summary"
  }},
  "product2": {{
    "score": "1-10 rating",
    "pros": ["list of advantages"],
    "cons": ["list of disadvantages"],
    "summary": "One sentence summary"
  }},
  "keyDifferences": ["list of most important differences"]
}}

Be conversational and focus on practical decision-making. Consider trade-offs."""

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    json={
                        "model": self.model,
                        "temperature": 0.1,
                        "max_tokens": 1500,
                        "messages": [
                            {"role": "user", "content": comparison_prompt}
                        ]
                    }
                )

            data = response.json()
            comparison_text = data.get("choices", [{}])[0].get("message", {}).get("content", "")

            # Extract JSON
            json_match = re.search(r'\{[\s\S]*\}', comparison_text)
            if not json_match:
                raise Exception("Failed to generate comparison")

            comparison = json.loads(json_match.group(0))
            return comparison

        except Exception as e:
            print(f"❌ Comparison error: {str(e)}")
            raise
