export function Footer() {
  return (
    <div className="min-h-[60px] bg-[#97D1D0] flex justify-center items-center mt-auto">
      <p className="m-auto text-[#555] text-[0.8rem]">
        © Copyright {new Date().getFullYear()}
      </p>
    </div>
  );
}
