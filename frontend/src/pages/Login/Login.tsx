import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommonForm } from "../../hooks/useCommonForm";
import { FieldConfig } from "../../types/form";

// CSRF + source 기반 백엔드 요청 Hook
import { useBackendSenderWithCSRF } from "../../hooks/useBackendUrl";

// components
import AutoFormField from "../../components/Form/AutoFormField";
import Language from "../../components/LanguageSelector/LanguageSelector";
import Button from "../../components/Button/Button";


// 폼 타입 정의
interface LoginFormInputs {
  username: string;
  password: string;
}

const Login: React.FC = () => {

  const navigate = useNavigate();
  const {
    t,
    control,
    handleSubmit,
    formState: { errors },
    createChangeHandler,
  } = useCommonForm<LoginFormInputs>(["username", "password"]);

  // CSRF + 서버 분기 훅 사용 (반드시 컴포넌트 함수 안에서!) 로그인 인증
  const sendLogin = useBackendSenderWithCSRF({
    source: "django",
    parameterPath: "/auth/login/",
  });

  // 내정보 최초 1회성 조회하기
  const fetchMe = useBackendSenderWithCSRF({
    source: "django",
    parameterPath: "/user/me/",
  })

  // 나중에 로딩 포함하기
  const [loading, setLoading] = useState(false);

  // 폼 제출 시 처리
  const onSubmit = async (form: LoginFormInputs) => {
    try {
      // 나중에 로딩 추가하기
      setLoading(true);
      const loginRes = await sendLogin({ method: "post", data: form }); // 기존 api.post → sendToBackend

      if (loginRes?.success) {
        console.log('로그인 성공 - 유저 불러오기 X')
        // 내 정보 불러오기
        const meRes = await fetchMe({ method: "get" });

        if (meRes?.success) {
          console.log(`로그인 후 사용자: ${meRes.user}`);
          console.log("유저정보 OK, 로그인값도 OK");
          // 로그인 인증을 위한 유저 정보 저장하기
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: meRes.user.username,
              role: meRes.user.role ?? "user",   // 기본값 보정
              email: meRes.user.email ?? "",
              full_name: meRes.user.full_name ?? "",
            })
          );
          // 같은 탭에서도 userUser (route) 가 곧바로 반응하도록 신호 보내기
          window.dispatchEvent(new StorageEvent("storage", { key: "user" }));
          // 홈으로 이동하기
          navigate("/");
        } else {
          // /me 실패 시 처리(토스트/알럿 등)
          alert(t("login.failed") + ": cannot fetch me");
        }

        

      } else {
        alert(`${t("login.failed")}: ${loginRes?.error || "unknown"}`);
      }
    } catch (error: any) {
      console.error("로그인 에러:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.message ||
        "Login failed";
      alert(`${t("login.failed")}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
};

  // 필드 설정
  const fields: FieldConfig<LoginFormInputs>[] = [
    {
      name: "username",
      label: t("form.username"),
      type: "string",
      errorKey: "REQUIRED_USERNAME",
      height: "40px",
    },
    {
      name: "password",
      label: t("form.password"),
      type: "password",
      errorKey: "REQUIRED_PASSWORD",
      height: "40px",
    },
  ];

  return (
    <div>
      <Language />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>{t("login.title")}</h1>
        <AutoFormField
          fields={fields}
          control={control}
          errors={errors}
          onChange={createChangeHandler}
          t={t}
        />
        <Button
          type="submit"
          label={t("form.login")}
          loading={loading}
          fullWidth={true}
          variant="large"
          height="40px"
          color="primary"
          loadingColor="var(--color-wh)"
        />
        <Button
          type="button"
          label={t("signup.title")}
          fullWidth={true}
          variant="large"
          height="40px"
          color="ghost"
        />
      </form>
    </div>
  );
};

export default Login;
