import { Box, Modal as MuiModal } from "@mui/material";
import { PropsWithChildren } from "react";
import { colors } from "../../utils/mui";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 800,
  backgroundColor: colors.black,
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
