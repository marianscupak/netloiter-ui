import { Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const BackButton = () => {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Button variant="contained" onClick={onClick} style={{ height: 40 }}>
      <ArrowBack />
    </Button>
  );
};
