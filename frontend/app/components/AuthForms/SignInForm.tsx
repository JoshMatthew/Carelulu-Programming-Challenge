import { useFetcher } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthForm, AuthFormSubmitBtn } from "~/components/AuthForms/AuthForm";
import { InputField } from "~/components/AuthForms/InputField";
import { AuthFormContainer } from "~/components/AuthForms/AuthFormContainer";
import ErrorBox from "./ErrorBox";
import { LoadingIcon } from "../LoadingIcon";
import {
  API_OPERATIONS,
  APP_ROUTES,
  FETCHER_STATE,
  FORM_FIELD,
  FORM_METHOD,
} from "~/lib/constants";

export const SignInForm = () => {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    errorBox?: string;
  }>({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (fetcher.state === FETCHER_STATE.IDLE) {
      formRef.current?.reset();
      if (!fetcher.data) setFormData({ email: "", password: "" });
      setErrors({
        email: "",
        password: "",
        errorBox: (fetcher.data as any)?.error || "",
      });
    }
  }, [fetcher.state]);

  const validateField = (name: string, value: string) => {
    let error = "";

    if (value.trim() === "") {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    if (formData.email.trim() === "") {
      newErrors.email = "Username is required.";
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    fetcher.submit(e.currentTarget);
  };

  return (
    <AuthFormContainer formTitle="Log-in as an existing user">
      <AuthForm
        fetcher={fetcher}
        method={FORM_METHOD.POST}
        formRef={formRef}
        submitHandler={handleSubmit}
      >
        <input
          type="hidden"
          name={FORM_FIELD.OPERATION}
          value={API_OPERATIONS.SIGN_IN}
        />

        <InputField
          name={FORM_FIELD.USER_NAME}
          type="text"
          value={formData.email}
          changeHandler={handleChange}
          placeholder="Username"
          errors={!!errors.email}
          errorText={errors.email}
        />

        <InputField
          name={FORM_FIELD.PASSWORD}
          type="password"
          value={formData.password}
          changeHandler={handleChange}
          placeholder="Password"
          errors={!!errors.password}
          errorText={errors.password}
        />

        <AuthFormSubmitBtn>
          <LoadingIcon
            loadingIconClassName="text-2xl"
            icon={<>Log-in</>}
            fetcher={fetcher}
          />
        </AuthFormSubmitBtn>

        {errors.errorBox && fetcher.state !== FETCHER_STATE.SUBMITTING && (
          <ErrorBox error={errors.errorBox} />
        )}

        <p className="mt-4 text-center text-sm text-gray-400 xl:text-xs">
          Or{" "}
          <Link to={`${APP_ROUTES.HOME}?signup=true`} className="text-accent">
            sign-up here
          </Link>{" "}
          if you don&#39;t have one yet
        </p>
      </AuthForm>
    </AuthFormContainer>
  );
};
