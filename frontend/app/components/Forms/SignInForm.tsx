import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import ErrorBox from "~/components/Forms/ErrorBox";

export const SignInForm = () => {
  const signInFormFetcher = useFetcher();
  const signInFormRef = useRef<HTMLFormElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (signInFormFetcher.state === "idle") {
      signInFormRef.current?.reset();
      setErrors({});
    }
  }, [signInFormFetcher.state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();

    const newErrors: { username?: string; password?: string } = {};
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    signInFormFetcher.submit(e.currentTarget, { method: "post" });
  };

  return (
    <signInFormFetcher.Form
      method="post"
      action='/'
      ref={signInFormRef}
      preventScrollReset
      onSubmit={handleSubmit}
      className="@md:rounded-md mx-auto flex items-center overflow-hidden w-full @md:w-auto flex-col gap-2"
    >
      {(errors.username || errors.password) && (
        <ErrorBox error="Please fix the errors below." />
      )}
      <input
        ref={usernameRef}
        name="email"
        type="text"
        className={`bg-[#ffffff] text-black px-4 py-2 border-2 w-full outline-none font-lexend ${
          errors.username ? "border-red-500" : "border-[#4FBBBB]"
        }`}
        placeholder="Username"
      />
      {errors.username && (
        <span className="text-red-500 text-sm">{errors.username}</span>
      )}
      <input
        ref={passwordRef}
        name="password"
        type="password"
        className={`bg-[#ffffff] text-black px-4 py-2 border-2 w-full outline-none font-lexend ${
          errors.password ? "border-red-500" : "border-[#4FBBBB]"
        }`}
        placeholder="Password"
      />
      {errors.password && (
        <span className="text-red-500 text-sm">{errors.password}</span>
      )}
      <button
        type="submit"
        className="text-[#ffffff] px-4 py-2 w-full outline-none bg-[#4FBBBB] hover:bg-[#5Fcccc] font-lexend"
      >
        Log in
      </button>
    </signInFormFetcher.Form>
  );
};
