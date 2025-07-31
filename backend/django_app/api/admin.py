# from django.contrib import admin
# from .models import UserProfile, Post

# # Register your models here.

# @admin.register(UserProfile)
# class UserProfileAdmin(admin.ModelAdmin):
#     list_display = ['user', 'phone_number', 'birth_date', 'created_at']
#     list_filter = ['created_at']
#     search_fields = ['user__username', 'user__email', 'phone_number']
#     date_hierarchy = 'created_at'

# @admin.register(Post)
# class PostAdmin(admin.ModelAdmin):
#     list_display = ['title', 'author', 'is_published', 'created_at']
#     list_filter = ['is_published', 'created_at', 'author']
#     search_fields = ['title', 'content', 'author__username']
#     list_editable = ['is_published']
#     date_hierarchy = 'created_at'
