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
          className={`block w-14 h-8 rounded-full ${
            props.checked ? "bg-blue-500 dark:bg-blue-600" : "bg-gray-400 dark:bg-gray-500"
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
            props.checked ? "transform translate-x-full" : ""
          }`}
        ></div>
      </label>
      <label htmlFor={props.id} className="ml-2 text-gray-700 dark:text-white">
        {props.label}
      </label>
    </div>
  );
}
