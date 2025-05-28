export default function ErrorBox({error}:{ error: string}) {
  return (
    <div className="bg-red-300 w-full">
      <p className="text-red-700 text-sm p-4">{error}</p>
    </div>
  );
}
