import os
import re
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from google import genai
from .models import Product
from .serializers import ProductSerializer

os.environ["GEMINI_API_KEY"] = "AQ.Ab8RN6KnbTEXTFW7uWQBQgZgbV3j7uvJkaG9L6hr-KRUUD4A"
client = genai.Client()

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

def home_view(request):
    return Response({"message": "Welcome to CWK Store API"})

@api_view(['POST'])
def ai_chat_view(request):
    user_message = request.data.get('message', '').strip()
    
    if not user_message:
        return Response({'reply': "Please ask a question!"})

    products = Product.objects.all()
    query_lower = user_message.lower()
    
    # 1. Strict Greetings
    greetings = ["hi", "hello", "hey", "good morning", "good evening", "greetings"]
    if query_lower in greetings or (len(query_lower.split()) <= 2 and any(g in query_lower for g in ["hi", "hello", "hey"])):
        return Response({'reply': "Hello! Welcome to CWK Store. Which product, brand, or price range are you looking for?"})
    
    # 2. Price Range Queries (e.g., "under 500", "below 1000")
    numbers = re.findall(r'\d+', query_lower)
    if numbers and any(kw in query_lower for kw in ["price", "under", "below", "rs", "₹", "ku", "range", "less"]):
        limit = float(numbers[0])
        filtered_products = [p for p in products if float(p.price) <= limit]
        
        if filtered_products:
            reply_lines = [f"Here are the products under ₹{limit}:"]
            for p in filtered_products:
                reply_lines.append(f"• **{p.title}** - Price: ₹{p.price}")
            return Response({'reply': "\n".join(reply_lines)})
        else:
            return Response({'reply': f"Sorry, no products are available under ₹{limit} in our store."})

    # 3. Strict Targeted Product Matching
    # Remove common filler words to isolate the core search intent
    stop_words = ["rate", "price", "cost", "enna", "eruka", "iruka", "want", "show", "is", "the", "a", "an", "me", "tell", "for", "mens", "womens", "product"]
    query_tokens = [w for w in query_lower.split() if w not in stop_words and len(w) > 1]
    
    matched_products = []
    for p in products:
        title_lower = p.title.lower()
        # If user specifies color/brand (e.g., "blue"), ensure it matches strictly if multiple tokens exist
        if query_tokens:
            # Check if all key query tokens appear in the product title
            if all(token in title_lower for token in query_tokens):
                matched_products.append(p)

    # Fallback: if strict multi-token (like "blue t-shirt") has no direct match, check for primary descriptive keyword
    if not matched_products and query_tokens:
        primary_keyword = max(query_tokens, key=len) # pick the longest/most descriptive word (e.g., "shirt", "watch")
        if len(primary_keyword) > 3:
            for p in products:
                if primary_keyword in p.title.lower():
                    matched_products.append(p)

    if matched_products:
        reply_lines = []
        for p in matched_products:
            reply_lines.append(f"• **{p.title}** - Price: ₹{p.price}")
        return Response({'reply': "\n".join(reply_lines)})
    
    # 4. Strict Unavailability Response
    else:
        return Response({'reply': "Sorry, the product or brand you are looking for is not available in our store."})
