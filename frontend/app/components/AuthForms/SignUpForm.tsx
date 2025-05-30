import { useFetcher } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { InputField } from "~/components/AuthForms/InputField";
import { AuthForm, AuthFormSubmitBtn } from "~/components/AuthForms/AuthForm";
import { AuthFormContainer } from "~/components/AuthForms/AuthFormContainer";
import ErrorBox from "./ErrorBox";
import { LoadingIcon } from "../LoadingIcon";
import {
  API_OPERATIONS,
  APP_ROUTES,
  FETCHER_STATE,
  FORM_NAME,
  FORM_METHOD,
} from "~/lib/constants";

export const SignUpForm = () => {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  enum FormField {
    username = FORM_NAME.USER_NAME,
    password = FORM_NAME.PASSWORD,
    repeatedPassword = "repeatedPassword",
  }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatedPassword: "",
  });

  const [errors, setErrors] = useState<{
    email: string;
    password: string;
    repeatedPassword: string;
    errorBox?: string;
  }>({
    email: "",
    password: "",
    repeatedPassword: "",
  });

  useEffect(() => {
    if (fetcher.state === FETCHER_STATE.IDLE) {
      console.log(fetcher);
      formRef.current?.reset();
      if (!fetcher.data)
        setFormData({ email: "", password: "", repeatedPassword: "" });
      setErrors({
        email: "",
        password: "",
        repeatedPassword: "",
        errorBox: (fetcher.data as any)?.error || "",
      });
    }
  }, [fetcher.state]);

  const validateField = (name: FormField, value: string) => {
    let error = "";

    switch (name) {
      case FormField.username:
        if (value.trim().length <= 3) {
          error = "Username must be at least 4" + " characters long.";
        }
        break;
      case FormField.password:
        if (value.length < 6) {
          error = "Password must be at least 6 characters long.";
        }
        break;
      case FormField.repeatedPassword:
        if (value !== formData.password) {
          error = "Passwords do not match.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name as FormField, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
      repeatedPassword: "",
    };

    if (formData.email.trim().length < 3) {
      newErrors.email = "Username must be at least 3 characters long.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (formData.repeatedPassword !== formData.password) {
      newErrors.repeatedPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    fetcher.submit(e.currentTarget);
  };

  return (
    <AuthFormContainer formTitle="Start by creating a new user">
      <AuthForm
        method={FORM_METHOD.POST}
        formRef={formRef}
        fetcher={fetcher}
        submitHandler={handleSubmit}
      >
        <input
          type="hidden"
          name={FORM_NAME.OPERATION}
          value={API_OPERATIONS.SIGN_UP}
        />

        <InputField
          name={FormField.username}
          type="text"
          value={formData.email}
          changeHandler={handleChange}
          placeholder="Username"
          errors={!!errors.email}
          errorText={errors.email}
        />

        <InputField
          name={FormField.password}
          type="password"
          value={formData.password}
          changeHandler={handleChange}
          placeholder="Password"
          errors={!!errors.password}
          errorText={errors.password}
        />

        <InputField
          name={FormField.repeatedPassword}
          type="password"
          value={formData.repeatedPassword}
          changeHandler={handleChange}
          placeholder="Repeat password"
          errors={!!errors.repeatedPassword}
          errorText={errors.repeatedPassword}
        />

        <AuthFormSubmitBtn>
          <LoadingIcon
            loadingIconClassName="text-2xl"
            icon={<>Create and log-in</>}
            fetcher={fetcher}
          />
        </AuthFormSubmitBtn>

        {errors.errorBox && fetcher.state !== FETCHER_STATE.SUBMITTING && (
          <ErrorBox error={errors.errorBox} />
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          Or{" "}
          <Link to={APP_ROUTES.HOME} className="text-accent">
            sign-in here
          </Link>{" "}
          if you already have an account
        </p>
      </AuthForm>
    </AuthFormContainer>
  );
};
