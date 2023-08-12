import Modal from "react-modal";
import { useSelector } from "react-redux";
import { selectTheme } from "@/lib/features/theme/theme-slice";

interface BibModalProps {
  modalIsOpen: boolean;
  handleModalClose: () => void;
  children: React.ReactNode;
}

export default function BibModal({
  modalIsOpen,
  children,
  handleModalClose,
}: BibModalProps) {
  const theme = useSelector(selectTheme);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleModalClose}
      contentLabel="Import References"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: theme === "dark" ? "rgb(18 18 18 )" : "white",
          padding: "20px",
          borderRadius: "4px",
          height: "fit-content",
          width: "fit-content",
          overflow: "auto",
          border: "none",
          zIndex: 200,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      {children}
    </Modal>
  );
}
