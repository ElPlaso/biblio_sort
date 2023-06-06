import Image from "next/image";

export default function TopAppBar() {
  return (
    <header className="flex justify-between items-center w-full shadow-md absolute top-0 p-[25px]">
      <div className="flex items-center">
        <Image src="/favicon.ico" alt="BiblioSort Logo" width={50} height={50} />
        <h1 className="text-2xl font-bold ml-4">BiblioSort</h1>
      </div>
    </header>
  );
}
