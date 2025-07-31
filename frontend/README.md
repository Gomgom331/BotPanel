# SETTING - 기본 설정


## i18n 다국어 지원

한국어, 중국어, 영어를 지원하며 기본 들어가는 값은 
 - locales/(en,ko,zh)/translation.json 파일에서 관리

에러값의 경우 키를 상수로 정의해 중복을 방지함
 - constants/errorMessages.tx 파일에서 KEY 관리

컴포넌트에 어떠한 문구를 전달할 때 다국어 설정 필수 (t("form.login") 등..)

## Router
`(ver.1)`
`로그인을 인증을 안 할시 모든 경로는 자동으로 => 로그인페이지로 이동 (사용자 인증을 해야함)`

- routes/index.tsx ()
- pages/ProtectedRoute.tsx (사용자 인증 => 로그인 페이지)
- pages/HomeRedirect.tsx ("/" 절대경로 이동시 사용자 인증)

`(ver.2)`
`사용자 권한 포함 route를 좀 더 세분화`

- routes/routeConfig.ts (경로와 권한 레벨이 포함된 "라우팅 정보"를 입력)
- routes/ProtectedRoute.tsx (현재 사용자 역할과 비교해 "접근 제어"후 맞는 페이지로 이동)
- routes/index.tsx (공통 라우팅 로직 정의 "Routes 구성" 요소 작성은 `routeConfig.ts`)
- hooks/useUser.ts (현 사용자 정보를 가져옴 "사용자 정보 훅") => localStorage.getItem() 으로 꺼내면 반복적이지만 해당 방법으로 호출하면 모든 컴포넌트에서 동일한 방법으로 사용자 정보를 조회할 수 있음


## Input components

보통의 폼에 들어가는 인풋의 경우 스타일과 이벤트 에러처리는 동일하지만
들어가는 해당 값과 옵션 등과 

한국어,중국어,영어를 유저의 세팅에 맞게 해당 인풋들의 언어들도 변경을 해야되기 때문에
Input 컴포넌트를 하나로 통합하기 보단 (switch 로 처리하면 범위가 넓어짐)

다국어 옵션 대응, 유지보수와 확장성을 생각하면 분리형이 맞기 때문에
공통 타입을 정의하고 (BaseFieldProps) 각 각의 타입의 Text, Password, Radio, Selet, Date 등을 대응해서 작업하는걸로 선택함

=> 분리 작업 
 - types/form.ts : 공통 타입 정의
 - compontens/Input/{name}Field.tsx : 각 필드를 정의
 // 폼 관리
 - hooks/useCommonForm.ts : 폼 전역관리, 다국어 변경 시 필드 초기화 포함
 - components/Form/AutoFormField.tsx : name, labelKey, errorKey만 넘기면 자동 렌더링

=> 인풋 분리
 - 필드별로 분리 시켜 놓아 필드를 수정하고 추가할 경우 아래 훅과 폼 체크
 - Form/AutoFormField.tsx , types/form.ts, hooks/useCommonForm.ts 


## Form validations / 필드 유효성

필드마다 다른 유효성을 공용과 폼별로 분리해서 필요한 값만 호출하는 식으로 작업
- src/validations/commonRules.ts : 공용 유효성
- src/validations/... : 해당 폼의 유효성

## Icon components

 - 아이콘 스플리트로 아이콘 적용
 - 초반 전체로딩에 시간이 걸리고 그 후부터 줄어듬
 - assets/icons/sprite.svg => 아이콘 추가
 - components/Icon/Icon.tsx  => 프로시저 관리 (추가한 ID를 IconProps에 추가)

## 사용자가 알아야할 오류 팁

"404"만 써져있는게 아닌 어떤 방식으로 오류를 전달할지 생각해 보자
네이버 / 배달의 민족 오류페이지를 참조하기 모호한 표현보단 간단명료하게 전달해주기

