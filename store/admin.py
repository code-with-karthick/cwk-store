from django.contrib import admin
from .models import Product, Order, OrderItem

# Register your models here so they appear in Admin panel
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
