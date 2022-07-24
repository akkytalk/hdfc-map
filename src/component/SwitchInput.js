import React from "react";
import Switch from "@mui/material/Switch";
import { useDispatch } from "react-redux";
import { bankCheckedStatusUpdate } from "../redux/nearByBanks";

function SwitchInput({ name, index, checked, setNearByBanks, key, bank }) {
  const [iChecked, setISChecked] = React.useState(checked);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setISChecked(event.target.checked);

    dispatch(
      bankCheckedStatusUpdate({
        place_id: bank.place_id,
        checked: event.target.checked,
      })
    );
  };

  return (
    <Switch
      id="create"
      key={key}
      name={name}
      checked={iChecked ? true : false}
      value={iChecked ? true : false}
      onChange={(e) => handleChange(e)}
    />
  );
}

export default SwitchInput;
