interface SwitchProps {
  label: string;
  prepend: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Switch(props: SwitchProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="prepend"
        checked={props.prepend}
        onChange={props.onChange}
        className="sr-only"
      />
      <label htmlFor="prepend" className="relative inline-block cursor-pointer">
        <div
          className={`block w-14 h-8 rounded-full ${
            props.prepend ? "bg-blue-500" : "bg-gray-400 dark:bg-gray-200"
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
            props.prepend ? "transform translate-x-full" : ""
          }`}
        ></div>
      </label>
      <label htmlFor="prepend" className="ml-3 text-gray-700 dark:text-white">
        {props.label}
      </label>
    </div>
  );
}
