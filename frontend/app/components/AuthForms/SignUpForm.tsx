import { TaskOperations } from "~/lib/types";
import { useFetcher } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { InputField } from "~/components/AuthForms/InputField";
import { AuthForm, AuthSubmitBtn } from "~/components/AuthForms/AuthForm";
import { AuthFormContainer } from "~/components/AuthForms/AuthFormContainer";
import ErrorBox from "./ErrorBox";

export const SignUpForm = () => {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

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
    if (fetcher.state === "idle") {
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

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "email":
        if (value.trim().length <= 3) {
          error = "Username must be at least 4" + " characters long.";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "Password must be at least 6 characters long.";
        }
        break;
      case "repeatedPassword":
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
    validateField(name, value);
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
        method="post"
        ref={formRef}
        fetcher={fetcher}
        submitHandler={handleSubmit}
      >
        {errors.errorBox && <ErrorBox error={errors.errorBox} />}
        <input type="hidden" name="operation" value={TaskOperations.SIGN_UP} />

        <InputField
          name="email"
          type="text"
          value={formData.email}
          changeHandler={handleChange}
          placeholder="Username"
          errors={!!errors.email}
          errorText={errors.email}
        />

        <InputField
          name="password"
          type="password"
          value={formData.password}
          changeHandler={handleChange}
          placeholder="Password"
          errors={!!errors.password}
          errorText={errors.password}
        />

        <InputField
          name="repeatedPassword"
          type="password"
          value={formData.repeatedPassword}
          changeHandler={handleChange}
          placeholder="Repeat password"
          errors={!!errors.repeatedPassword}
          errorText={errors.repeatedPassword}
        />

        <AuthSubmitBtn>Create and log-in</AuthSubmitBtn>

        <p className="mt-4 text-center text-xs text-gray-400">
          Or{" "}
          <Link to="/" className="text-accent">
            sign-in here
          </Link>{" "}
          if you already have an account
        </p>
      </AuthForm>
    </AuthFormContainer>
  );
};
