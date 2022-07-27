import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();
  const handleHomeNavigation = () => {
    navigate("/");
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <h1>404</h1>
          <h2>Page not Found</h2>

          <h2>Goto</h2>
          <Button onClick={handleHomeNavigation}>Home</Button>
        </div>
      </div>
    </>
  );
}
