from typing import Dict, TypedDict, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langgraph.graph import StateGraph, END
import json
import logging

from app.core.config import settings
from app.models.recommendation import UserInteraction, ProductRating
from app.schemas.recommendation_schema import RecommendationResponse

logger = logging.getLogger("recommendation_service")

# Define the state for LangGraph
class GraphState(TypedDict):
    user_id: int
    db: AsyncSession
    interactions: List[dict]
    ratings: List[dict]
    llm_prompt: str
    llm_response: str
    recommendations: List[RecommendationResponse]

class AIRecommendationService:
    def __init__(self):
        # Initialize Gemini Model
        if settings.GOOGLE_API_KEY:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=settings.GOOGLE_API_KEY,
                temperature=0.7
            )
        else:
            self.llm = None
            
        self.workflow = self._build_graph()

    def _build_graph(self):
        workflow = StateGraph(GraphState)
        
        # Add nodes
        workflow.add_node("fetch_user_data", self.fetch_user_data)
        workflow.add_node("generate_prompt", self.generate_prompt)
        workflow.add_node("call_llm", self.call_llm)
        workflow.add_node("parse_response", self.parse_response)
        
        # Define edges
        workflow.set_entry_point("fetch_user_data")
        workflow.add_edge("fetch_user_data", "generate_prompt")
        workflow.add_edge("generate_prompt", "call_llm")
        workflow.add_edge("call_llm", "parse_response")
        workflow.add_edge("parse_response", END)
        
        return workflow.compile()

    async def fetch_user_data(self, state: GraphState) -> Dict:
        """Fetches the user's recent interactions and ratings."""
        db = state["db"]
        user_id = state["user_id"]
        
        # Fetch interactions
        stmt_int = select(UserInteraction).where(UserInteraction.user_id == user_id).order_by(UserInteraction.timestamp.desc()).limit(10)
        res_int = await db.execute(stmt_int)
        interactions = res_int.scalars().all()
        
        int_data = [{"product_id": i.product_id, "type": i.interaction_type} for i in interactions]
        
        # Fetch ratings
        stmt_rat = select(ProductRating).where(ProductRating.user_id == user_id).order_by(ProductRating.timestamp.desc()).limit(10)
        res_rat = await db.execute(stmt_rat)
        ratings = res_rat.scalars().all()
        
        rat_data = [{"product_id": r.product_id, "rating": r.rating} for r in ratings]
        
        return {"interactions": int_data, "ratings": rat_data}

    async def generate_prompt(self, state: GraphState) -> Dict:
        """Generates the prompt for the LLM based on user data."""
        template = """
You are an expert e-commerce AI recommendation engine.
Based on the following recent user interactions and ratings, recommend 3 new product IDs that the user might like.

Recent Interactions (type and product_id):
{interactions}

Recent Ratings (rating and product_id):
{ratings}

Return ONLY a valid JSON array of objects with "product_id" (integer), "score" (float between 0 and 1), and "reason" (string explaining why).
Example:
[
  {{"product_id": 105, "score": 0.95, "reason": "Because you viewed similar electronics"}},
  {{"product_id": 42, "score": 0.88, "reason": "Highly rated by users with similar taste"}}
]
"""
        prompt = PromptTemplate(
            template=template,
            input_variables=["interactions", "ratings"]
        )
        
        formatted_prompt = prompt.format(
            interactions=state["interactions"],
            ratings=state["ratings"]
        )
        
        return {"llm_prompt": formatted_prompt}

    async def call_llm(self, state: GraphState) -> Dict:
        """Calls the Gemini model."""
        if not self.llm:
            raise ValueError("GOOGLE_API_KEY is not set.")
            
        response = await self.llm.ainvoke(state["llm_prompt"])
        return {"llm_response": response.content}

    async def parse_response(self, state: GraphState) -> Dict:
        """Parses the JSON response from the LLM."""
        raw_response = state["llm_response"]
        
        # Clean up markdown code blocks if present
        if raw_response.startswith("```json"):
            raw_response = raw_response[7:-3]
        elif raw_response.startswith("```"):
            raw_response = raw_response[3:-3]
            
        try:
            parsed = json.loads(raw_response.strip())
            recommendations = [RecommendationResponse(**item) for item in parsed]
        except Exception as e:
            logger.error(f"Failed to parse LLM response: {e}. Raw response: {raw_response}")
            # Fallback to empty list or default
            recommendations = []
            
        return {"recommendations": recommendations}

    async def get_ai_recommendations(self, user_id: int, db: AsyncSession) -> List[RecommendationResponse]:
        """Entry point for the service."""
        initial_state = {
            "user_id": user_id,
            "db": db,
            "interactions": [],
            "ratings": [],
            "llm_prompt": "",
            "llm_response": "",
            "recommendations": []
        }
        
        final_state = await self.workflow.ainvoke(initial_state)
        return final_state["recommendations"]

ai_recommendation_service = AIRecommendationService()
