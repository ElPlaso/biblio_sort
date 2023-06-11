import Loader from "./components/loader/loader";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader />
    </div>
  );
}
