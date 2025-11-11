from rest_framework import serializers
from .models import MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = MenuItem
        fields = [
            "id",
            "kind",
            "label_ko",
            "label_en",
            "label_zh",
            "path",
            "order",
            "external",
            "external_url",
            "children",
        ]
        
    def get_children(self, obj):
        children_qs = obj.children.filter(enabled=True).order_by("order", "id")
        return MenuItemSerializer(children_qs, many=True, context=self.context).data
        