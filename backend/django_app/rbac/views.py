from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MenuItem
from .serializers import MenuItemSerializer

class SidebarMenuView(APIView):
    def get(self, request):
        lang = request.GET.get("lang","ko") #기본값 한국어
        
        roots = MenuItem.objects.filter(parent__isnull=True, enabled=True).order_by("order","id")
        
        data = MenuItemSerializer(roots, many=True).data
        
        # 언어별 라벨 교체
        for item in data:
            self._apply_lang(item, lang)
        return Response(data)
    

    def _apply_lang(self, item, lang):
        label_field = f"label_{lang}" if lang in ["ko", "en", "zh"] else "label_ko"
        label_value = item.get(label_field) or item.get("label_ko")
        item["label"] = label_value
        
        # 불필요한 언어 필드는 제거
        for key in ["label_ko", "label_en", "label_zh"]:
            item.pop(key, None)
        
        # 자식들도 재귀적으로 처리
        for child in item.get("children", []):
            self._apply_lang(child, lang)
        
        # 원하는 값 lang에 넣기
        # http://localhost:8000/menu/sidebar/?lang=ko