import openai # (Or you can use local rule-based / embedding logic)
from .models import Product

class AIRecommendationAgent:
    @staticmethod
    def get_recommendations(product_id):
        try:
            current_product = Product.objects.get(id=product_id)
            
            # Simple intelligent filtering based on category complementary logic
            if current_product.category == 'clothing':
                # Recommend related gadgets or digital style guides
                recommendations = Product.objects.filter(category__in=['gadgets', 'digital']).exclude(id=product_id)[:3]
            elif current_product.category == 'gadgets':
                # Recommend digital tech guides or clothing accessories
                recommendations = Product.objects.filter(category__in=['digital', 'clothing']).exclude(id=product_id)[:3]
            else:
                recommendations = Product.objects.filter(category='gadgets').exclude(id=product_id)[:3]
                
            return recommendations
        except Product.DoesNotExist:
            return []
