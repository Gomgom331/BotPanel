import React from "react";
import { useCommonForm } from "../../hooks/useCommonForm";
import { FieldConfig } from "../../types/form";
import axiosInstance from "../../api/axios";

// components
import AutoFormField from "../../components/Form/AutoFormField";
import Language from "../../components/LanguageSelector/LanguageSelector";
import Button from "../../components/Button/Button";

// 폼 내용 추가시
// interface, useCommonForm, LoginFormInputs 이렇게 3가지에 추가해줘야
// 오류 없이 input 컴포넌트가 추가가 됨


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

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axiosInstance.post("/login", data);
      alert("로그인 성공!\n" + JSON.stringify(response.data, null, 2));
      // TODO: 토큰 저장, 페이지 이동 등 추가 작업
    } catch (error: any) {
      alert("로그인 실패: " + (error.response?.data?.detail || error.message));
    }
  };

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
