import pytest
from models.recommendation import UserInteraction, ProductRating

def test_user_interaction_model():
    interaction = UserInteraction(user_id=1, product_id=10, interaction_type="click")
    assert interaction.user_id == 1
    assert interaction.product_id == 10
    assert interaction.interaction_type == "click"

def test_product_rating_model():
    rating = ProductRating(user_id=2, product_id=20, rating=4.5)
    assert rating.user_id == 2
    assert rating.product_id == 20
    assert rating.rating == 4.5
