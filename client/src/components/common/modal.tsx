import { Box, Modal as MuiModal } from "@mui/material";
import { PropsWithChildren } from "react";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  backgroundColor: "#1F262E",
  padding: 40,
  borderRadius: 4,
};

interface Props extends PropsWithChildren {
  open: boolean;
  onClose(): void;
}

export const Modal = ({ open, children, onClose }: Props) => (
  <MuiModal open={open} disableEnforceFocus onClose={onClose}>
    <Box style={style}>{children}</Box>
  </MuiModal>
);
