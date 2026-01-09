import React from "react";
import { useUI } from "../../contexts/ui.context";

export const ModalArea: React.FC = () => {
  const { modal } = useUI();

  if (!modal?.isOpen) return null;

  return (
    <s-modal heading={modal.title || ""}>
      <s-box padding="base">
        {modal?.data?.content ?? null}
      </s-box>
    </s-modal>
  );
};

export default ModalArea;

