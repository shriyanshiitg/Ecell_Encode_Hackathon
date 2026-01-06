"""
Context Service
Handles user context inference and conversational responses
"""

import json
import re
import httpx
from typing import Dict, Any, Optional, List

from config.settings import settings


class ContextService:
    """Service for context management and chat"""

    def __init__(self):
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL

    async def infer_context(
        self,
        message: str,
        previous_context: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Infer user context from message"""
        prev_context_str = ""
        if previous_context:
            prev_context_str = f"\n\nPREVIOUS CONTEXT:\n{json.dumps(previous_context, indent=2)}"

        prompt = f"""You are an AI health assistant analyzing user messages to understand their health concerns, dietary preferences, and goals.

{prev_context_str}

USER MESSAGE:
"{message}"

Extract and infer the following as JSON:
{{
  "healthConcerns": ["list of health conditions or concerns mentioned or implied"],
  "dietaryPreferences": ["vegan, vegetarian, keto, paleo, etc."],
  "allergens": ["specific food allergens mentioned"],
  "goals": ["weight loss, muscle gain, heart health, etc."],
  "confidence": "low|medium|high"
}}

Return ONLY valid JSON, no markdown. Merge with previous context if provided."""

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    json={
                        "model": self.model,
                        "temperature": 0.1,
                        "max_tokens": 500,
                        "messages": [
                            {"role": "user", "content": prompt}
                        ]
                    }
                )

            data = response.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

            # Extract JSON
            json_match = re.search(r'\{[\s\S]*\}', content)
            if json_match:
                context = json.loads(json_match.group(0))
                return context
            else:
                return {}

        except Exception as e:
            print(f"❌ Context inference error: {str(e)}")
            return {}

    async def generate_chat_response(
        self,
        message: str,
        user_context: Optional[Dict] = None,
        conversation_history: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        """Generate AI chat response"""
        context_str = ""
        if user_context:
            context_str = f"\n\nUSER CONTEXT:\n{json.dumps(user_context, indent=2)}"

        history_str = ""
        if conversation_history:
            recent_history = conversation_history[-6:]  # Last 6 messages
            history_str = "\n\nRECENT CONVERSATION:\n"
            for msg in recent_history:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                history_str += f"{role.upper()}: {content}\n"

        prompt = f"""You are an AI health copilot having a natural conversation with a user about food and health.

{context_str}
{history_str}

USER: {message}

Respond naturally and conversationally. If the user mentions health concerns, acknowledge them and offer to help. Be helpful but concise (2-3 sentences).

Also infer if there's any new context to learn from this message. Return JSON:
{{
  "response": "Your conversational response",
  "contextLearned": {{
    "healthConcerns": [],
    "allergens": [],
    "dietaryPreferences": [],
    "goals": []
  }}
}}

Return ONLY valid JSON."""

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    json={
                        "model": self.model,
                        "temperature": 0.3,
                        "max_tokens": 500,
                        "messages": [
                            {"role": "user", "content": prompt}
                        ]
                    }
                )

            data = response.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

            # Extract JSON
            json_match = re.search(r'\{[\s\S]*\}', content)
            if json_match:
                result = json.loads(json_match.group(0))
                return result
            else:
                return {"response": content, "contextLearned": {}}

        except Exception as e:
            print(f"❌ Chat error: {str(e)}")
            return {
                "response": "I'm having trouble responding right now. Could you try again?",
                "contextLearned": {}
            }

    async def answer_question(
        self,
        question: str,
        analysis_context: Dict[str, Any],
        user_context: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Answer follow-up questions about analysis"""
        context_str = ""
        if user_context:
            context_str = f"\n\nUSER CONTEXT:\n{json.dumps(user_context, indent=2)}"

        analysis_str = f"\n\nANALYSIS CONTEXT:\n{json.dumps(analysis_context, indent=2)}"

        prompt = f"""You are an AI health assistant answering a follow-up question about a previous ingredient analysis.

{context_str}
{analysis_str}

USER QUESTION: {question}

Provide a helpful, concise answer. Return JSON:
{{
  "answer": "Your answer to the question",
  "reasoning": "Brief explanation of your reasoning",
  "suggestions": ["related questions they might want to ask"]
}}

Return ONLY valid JSON."""

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    json={
                        "model": self.model,
                        "temperature": 0.2,
                        "max_tokens": 600,
                        "messages": [
                            {"role": "user", "content": prompt}
                        ]
                    }
                )

            data = response.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

            # Extract JSON
            json_match = re.search(r'\{[\s\S]*\}', content)
            if json_match:
                result = json.loads(json_match.group(0))
                return result
            else:
                return {
                    "answer": content,
                    "reasoning": "",
                    "suggestions": []
                }

        except Exception as e:
            print(f"❌ Question answering error: {str(e)}")
            return {
                "answer": "I'm having trouble answering that right now. Could you rephrase?",
                "reasoning": "",
                "suggestions": []
            }
