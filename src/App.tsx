import "./App.css";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

import { logo, gLogo } from "./assets/images";
import PageTitle from "./component/menu/PageTitle.component";
import RouterComponent from "./component/router/router.component";
import { initGapis, loadAuthPicker } from "./services/gapi.services";

function App() {
  const loggedState = { gapiInitialized: false, userLoggedIn: false };
  const [state, setState] = useState(loggedState);
  const navigate = useNavigate();

  const initializationCallback = (loggedIn: boolean): void => {
    if (loggedIn) {
      setState({ gapiInitialized: true, userLoggedIn: true });
    } else {
      setState({ gapiInitialized: true, userLoggedIn: false });
    }
  };

  const handleGapiInit = async () => {
    await initGapis(initializationCallback);
  };

  const handleLogin = () => {
    loadAuthPicker();
  };

  useEffect(() => {
    handleGapiInit();
  }, []);

  const handleLogout = () => {
    window.gapi.auth2.getAuthInstance().signOut();
    navigate("/");
    initializationCallback(false);
  };

  return (
    <>
      <PageTitle pageTitle={""} />

      {state.userLoggedIn ? (
        <div className="header_wrapper">
          <div className="header_base">
            <div className="menu">
              <img
                className={"image"}
                src={logo}
                alt="LF"
                onClick={() => {
                  navigate("/");
                }}
              />

              <Button
                endIcon={<LogoutIcon />}
                style={{ textAlign: "right" }}
                onClick={handleLogout}
              >
                logout
              </Button>
            </div>
          </div>
          <RouterComponent state={state} />
        </div>
      ) : (
        <div className="login-wrapper">
          <div className="login">
            <div>
              <img
                src={logo}
                alt="Logo of LFTechnology"
                className="login__logo"
              />
            </div>
            <div className="login__body">
              <a
                className="login__button"
                id="loginButton"
                onClick={handleLogin}
              >
                <img src={gLogo} alt="google" className="mr-5x" />
                Continue with Google
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
