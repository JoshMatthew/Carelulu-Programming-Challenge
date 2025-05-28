import { useNavigation } from "@remix-run/react";

export function GlobalLoadingBar() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  return (
    <div
      role="progressbar"
      aria-hidden={!isLoading}
      className="fixed top-0 left-0 right-0 z-50 h-1"
    >
      <div
        className={`h-full bg-[#F1578B] transition-all duration-500 ease-in-out ${
          isLoading ? "w-full" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
}
