import React from "react";
import { useCommonForm } from "../../hooks/useCommonForm";
import { FieldConfig } from "../../types/form";


// components
import AutoFormField from "../../components/Form/AutoFormField";
import Language from "../../components/LanguageSelector/LanguageSelector";
import Button from "../../components/Button/Button";

// hooks
import { useAuthActions } from "../../hooks/useAuthActions";


// 폼 타입 정의
interface LoginFormInputs {
  username: string;
  password: string;
}

const Login: React.FC = () => {

  const {
    t,
    control,
    handleSubmit,
    formState: { errors },
    createChangeHandler,
  } = useCommonForm<LoginFormInputs>(["username", "password"]);

  // 인증 액션 훅 로그인 / 내정보 / 로딩
  const { login , loading } = useAuthActions();

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
      <form onSubmit={handleSubmit(login)} noValidate>
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
