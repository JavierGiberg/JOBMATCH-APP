import React from "react";
import { useNavigate } from "react-router-dom";

function NavigateButton(props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(props.goTo);
  };

  return <button onClick={handleClick}>{props.button}</button>;
}

export default NavigateButton;
