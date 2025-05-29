import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthForm, AuthSubmitBtn } from "~/components/AuthForms/AuthForm";
import { InputField } from "~/components/AuthForms/InputField";
import { AuthFormContainer } from "~/components/AuthForms/AuthFormContainer";
import { TaskOperations } from "~/lib/types";
import ErrorBox from "./ErrorBox";

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
    if (fetcher.state === "idle") {
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
        method="post"
        ref={formRef}
        submitHandler={handleSubmit}
      >
        {errors.errorBox && <ErrorBox error={errors.errorBox} />}
        <input type="hidden" name="operation" value={TaskOperations.SIGN_IN} />

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

        <AuthSubmitBtn>Log-in</AuthSubmitBtn>

        <p className="mt-4 text-center text-xs text-gray-400">
          Or{" "}
          <Link to="/?signup=true" className="text-accent">
            sign-up here
          </Link>{" "}
          if you don&#39;t have one yet
        </p>
      </AuthForm>
    </AuthFormContainer>
  );
};
