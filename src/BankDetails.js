import React from "react";
import { Card } from "reactstrap";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import MapComponent from "./MapComponent";

function BankDetails() {
  const [checked, setChecked] = React.useState(false);

  const render = (status) => {
    return <h1>{status}</h1>;
  };

  return (
    <div>
      <div className="">
        <MapComponent />
      </div>
      <div className="bank-details">
        <label className="pt-2 pb-2">Branch Name Address</label>
        <Card className="p-2 rounded">
          <div className="d-flex justify-content-between align-items-center">
            <h6>Bhandup Branch</h6>
            <FormControlLabel
              control={
                <Switch
                  id="create"
                  name="create"
                  value={checked}
                  checked={checked ? true : false}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              }
              label=""
            />
          </div>
          <p>Bank Address</p>
        </Card>
      </div>
    </div>
  );
}

export default BankDetails;
