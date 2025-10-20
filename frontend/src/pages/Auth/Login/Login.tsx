import React from "react";

import { useCommonForm } from "../../../hooks/useCommonForm";
import { FieldConfig } from "../../../types/form";

// components
import AutoFormField from "../../../components/Form/AutoFormField";
import Language from "../../../components/LanguageSelector/LanguageSelector";
import Button from "../../../components/Button/Button";
import {Alert} from "../../../components/Alert/Alert";
import SocialLoginSection from "../../../components/SocialLogin/SocialLoginSection";
import Tooltip from "../../../components/Tooltip/Tooltip"

// hooks
import { useAuthActions } from "../../../hooks/useAuthActions";
import { toI18nKey, mapFieldErrors } from "../../../constants/errorMessages";

// 스타일
import styles from "./Login.module.css"

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
    // 필드에러 초기화
    setError,
    setFocus,
  } = useCommonForm<LoginFormInputs>(["username", "password"]);

  // 인증 액션 훅 로그인 / 내정보 / 로딩
  const { login , loading } = useAuthActions();
  // 전역 폼 에러 키
  const [formErrorKey, setFormErrorKey] = React.useState<string | null>(null);
  

  // 필드 설정 - 클라이언트 1차 검증
  const fields: FieldConfig<LoginFormInputs>[] = [
  
    {
      name: "username",
      label: t("form.username"),
      type: "string",
      errorKey: "REQUIRED_USERNAME",
      height: "3.0769rem",
    },
    {
      name: "password",
      label: t("form.password"),
      type: "password",
      errorKey: "REQUIRED_PASSWORD",
      height: "3.0769rem",
    },
  ];

  const onSubmit = handleSubmit(async (values) => {
    setFormErrorKey(null);
    
    const res = await login(values); 

    // 에러 처리
    if (!res.success){
      // 필드 에러만 온 경우
      if ("fieldErrors" in res && res.fieldErrors) {
        console.log('123', res.fieldErrors)
        const fe = mapFieldErrors<keyof LoginFormInputs>(res.fieldErrors)!;
        const entries = Object.entries(fe) as [keyof LoginFormInputs, string][];
        
        entries.forEach(([field, i18nKey]) => {
          setError(field, { type: "server", message: t(i18nKey) });
        });
        if (entries.length) setFocus(entries[0][0]);
        return;
      }

      // 전역 에러만 온 경우
      if ("formError" in res && res.formError){
        console.log('123', res.formError)
        setFormErrorKey(toI18nKey(res.formError));
        return
      }
      
      // 폴백
      setFormErrorKey("error.server.generic");
      
      return;
    }
    // success:true 인 경우는 훅 내부에서 내정보 조회/이동까지 처리됨
  });

  return (
    <div className={styles.backgroundContainer}>
      
      {/* 그라데이션 */}
      <div className={styles.gradientOrb}></div>
      <div className={styles.gradientOrb}></div>
      <div className={styles.gradientOrb}></div>
      <div className={styles.gradientOrb}></div>
      <div className={styles.gradientOrb}></div>
      <div className={styles.gradientOrb}></div>
      {/* //그라데이션 */}

      {/* wrapContainer */}
      <div className={styles.wrapContainer}>
        {/* 언어설정 */}
        <div className={styles.languageBox}>
          <Tooltip
            content={t("tooltip.languageSetting")}
            placement="bottom"
            trigger={["hover", "focus", "click"]}
            usePortal={true}
          >
            <Language />
          </Tooltip>
        </div>
        {/* //언어설정 */}
        <div className={styles.container}>
          {/* loginContainer */}
          <div className={styles.loginContainer}>
            {/* 타이틀 */}
              <div className={styles.loginTitleBox}>
                {/* <h1>{t("login.title")}</h1> */}
                <img src="/assets/title/title_logo.png" alt="titleLogo" />
              </div>
            {/* /타이틀 */}
            {/* 전역 에러 배너 (프로젝트 스타일에 맞춰 교체 가능) */}
            {formErrorKey && (
              <Alert
                type="error"
                message={[formErrorKey ? t(formErrorKey) : ""]}
                closable={true}
                shadow={true}
                onClose={() => setFormErrorKey(null)}
              />
            )}
            {/* 테스트용 */}
            {/* <Alert
              type="error"
              title="에러입니다"
              message={["실패 가이드"]}
              closable={true}
              shadow={true}
              onClose={() => setFormErrorKey(null)}
            />
            <Alert
              type="success"
              message={["성공 가이드"]}
              closable={true}
              shadow={true}
            />
            <Alert
              type="guide"
              message={["임시가이드"]}
              closable={true}
              shadow={true}
            /> */}
            <form onSubmit={onSubmit} noValidate className={styles.loginForm}>
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
                height="3.0769rem"
                color="primary"
                loadingColor="var(--color-wh)"
                shadow={true}
              />
              <Button
                type="button"
                label={t("signup.title")}
                fullWidth={true}
                variant="large"
                height="3.0769rem"
                color="ghost"
                shadow={true}
              />
            </form>
            {/* accountRecoveryBox */}
            <div className={styles.accountRecoveryBox}>
              <span><a href="">{t("login.findId.title")}</a></span>
              |
              <span><a href="">{t("login.forgotPassword.title")}</a></span>
            </div>
            {/* //accountRecoveryBox */}
            {/* 소셜로그인 */}
            <SocialLoginSection />
            {/* //소셜로그인 */}
          </div>
          {/* //loginContainer */}
        </div>
      </div>
      {/* //wrapContainer */}
    </div>
  );
};

export default Login;
