import { IconButton } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useDispatch } from "react-redux";
import { bankCheckedStatusUpdate } from "../redux/nearByBanks";

function UserVisitedBankDetails(props) {
  const dispatch = useDispatch();

  // calculate screen width
  const screenWidth = window.innerWidth;

  return (
    <div>
      <h5>Branch Visiting</h5>
      {props.bank?.length > 0 && props.bank?.filter((b) => b.checked).length > 0
        ? props.bank
            .filter((b) => b.checked)
            .map((bank, index) => (
              <div
                key={index}
                className={`d-flex justify-content-between align-items-center ${
                  screenWidth > 600 ? "w-50" : "w-100"
                }`}
              >
                <div>
                  <p className="m-0">{bank.name}</p>
                  <p className="m-0 f-8">{bank.vicinity}</p>
                </div>
                <IconButton
                  onClick={() => {
                    dispatch(
                      bankCheckedStatusUpdate({
                        place_id: bank.place_id,
                        checked: false,
                      })
                    );
                  }}
                >
                  <HighlightOffIcon color="error" />
                </IconButton>
              </div>
            ))
        : "No Visited Branch Found"}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    bank: state.bank,
  };
};
export default connect(mapStateToProps)(UserVisitedBankDetails);
