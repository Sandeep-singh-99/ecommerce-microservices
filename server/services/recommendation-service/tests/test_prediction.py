import pytest
import os
import pandas as pd
from ml.predict import RecommendationEngine

def test_recommendation_engine_init():
    engine = RecommendationEngine(model_dir="dummy_dir")
    assert engine.model_dir == "dummy_dir"
    assert engine.vectorizer is None
