export default function ErrorBox({ error }: { error: string }) {
  return (
    <div className="w-full bg-red-300">
      <p className="p-4 text-center text-sm text-red-700">{error}</p>
    </div>
  );
}
