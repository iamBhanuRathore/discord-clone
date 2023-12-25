export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="h-full flex justify-center items-center">
      <p className="w-32 h-32 border-y-2 border-black dark:border-white rounded-full animate-spin"></p>
    </div>
  );
}
