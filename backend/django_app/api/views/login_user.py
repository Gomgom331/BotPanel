from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json

# model
from users.models import CustomUser

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    """
    사용자 로그인 클래스 기반 뷰
    POST 요청으로 username과 password를 받아 로그인 처리
    """
    
    def post(self, request, *args, **kwargs):
        """
        POST 요청 처리 - 로그인    
        """
        try:
            print("로그인 요청 받음")
            # JSON 데이터 파싱
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            print(f"받은 데이터: username={username}, password={'*' * len(password) if password else 'None'}")
            
            # 필수 필드 검증
            if not username or not password:
                print("필수 필드 누락")
                return JsonResponse({
                    'success': False,
                    'error': '아이디와 비밀번호를 모두 입력해주세요.'
                }, status=400)
            
            # 사용자 존재 여부 확인
            try:
                user = CustomUser.objects.get(username=username, is_deleted=False)
                print(f'사용자 찾음: {user.username}')
            except CustomUser.DoesNotExist:
                print(f'사용자 없음: {username}')
                return JsonResponse({
                    'success': False,
                    'error': '존재하지 않는 사용자입니다.'
                }, status=401)
            
            # 비밀번호 확인
            if not user.check_password(password):
                print(f'비밀번호 틀림: {username}')
                return JsonResponse({
                    'success': False,
                    'error': '비밀번호가 올바르지 않습니다.'
                }, status=401)
            
            # 계정 활성화 상태 확인
            if not user.is_active:
                print(f'비활성화된 계정: {username}')
                return JsonResponse({ 
                    'success': False,
                    'error': '승인되지 않은 계정입니다. 관리자에게 문의하세요.'
                }, status=401)
            
            print(f'로그인 성공: {username}')
            
            # 로그인 성공 응답
            return JsonResponse({
                'success': True,
                'message': '로그인 성공',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name,
                    'company': user.company,
                    'position': user.position,
                    'role': user.role,
                    'is_active': user.is_active
                }
            }, status=200)
            
        except json.JSONDecodeError as e:
            print(f"JSON 파싱 에러: {e}")
            return JsonResponse({
                'success': False,
                'error': '잘못된 JSON 형식입니다.'
            }, status=400)
            
        except Exception as e:
            print(f"예외 발생: {e}")
            return JsonResponse({
                'success': False,
                'error': f'로그인 처리 중 오류가 발생했습니다: {str(e)}'
            }, status=500)
    
    def get(self, request, *args, **kwargs):
        """
        GET 요청 처리 - 로그인 페이지 또는 메시지
        """
        return JsonResponse({
            'success': False,
            'error': 'POST 요청으로 로그인해주세요.'
        }, status=405)
    
    def put(self, request, *args, **kwargs):
        """
        PUT 요청 처리 - 허용하지 않음
        """
        return JsonResponse({
            'success': False,
            'error': 'PUT 메서드는 지원하지 않습니다.'
        }, status=405)
    
    def delete(self, request, *args, **kwargs):
        """
        DELETE 요청 처리 - 허용하지 않음
        """
        return JsonResponse({
            'success': False,
            'error': 'DELETE 메서드는 지원하지 않습니다.'
        }, status=405)