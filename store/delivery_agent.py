import uuid
from django.core.mail import send_mail

class DigitalDeliveryAgent:
    @staticmethod
    def generate_secure_download_token(order, product):
        if product.category == 'digital':
            # Generate a unique secure token for file access
            secure_token = uuid.uuid4()
            download_link = f"http://127.0.0.1:8000/api/download/{secure_token}/"
            
            # Send Email (or WhatsApp notification) to customer
            send_mail(
                subject=f"Your Digital Product Download: {product.title}",
                message=f"Thank you for your purchase! You can download your file securely using this link: {download_link}",
                from_email='noreply@aistore.com',
                recipient_list=[order.email],
                fail_silently=False,
            )
            return download_link
        return None
