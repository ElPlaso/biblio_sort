interface SwitchProps {
  className?: string;
  label: string;
  checked: boolean;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Switch(props: SwitchProps) {
  return (
    <div className={`flex items-center " + ${props.className}`}>
      <input
        type="checkbox"
        id={props.id}
        checked={props.checked}
        onChange={props.onChange}
        className="sr-only"
      />
      <label
        htmlFor={props.id}
        className="relative inline-block cursor-pointer"
      >
        <div
          className={`block w-14 h-7 rounded-full ${
            props.checked ? "bg-blue-500" : "bg-gray-400 dark:bg-darkGray  "
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition ${
            props.checked ? "transform translate-x-7" : ""
          }`}
        ></div>
      </label>
      <label htmlFor={props.id} className="ml-2 text-gray-700 dark:text-white text-sm">
        {props.label}
      </label>
    </div>
  );
}
