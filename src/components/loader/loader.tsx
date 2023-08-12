import "./loader.css";

export default function Loader() {
  return (
    <div className="lds-facebook ">
      <div className="bg-black dark:bg-white rounded-full"></div>
      <div className="bg-black dark:bg-white rounded-full"></div>
      <div className="bg-black dark:bg-white rounded-full"></div>
    </div>
  );
}
