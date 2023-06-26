type DropdownItem = {
  id: string;
  label: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  icon: React.ReactNode;
};
