import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Row,
	Col,
	Card,
} from "reactstrap";
import classnames from "classnames";
import BankDetails from "./BankDetails";
import UserVisitedBankDetails from "./UserVisitedBankDetails";
import { getCoordinates } from "./utils/maps";

function App() {
	const [activeTab, setActiveTab] = useState("tab1");
	const [location, setLocation] = useState({
		lat: 0,
		lng: 0,
	});

	const toggle = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};

	const withCurrentLocation = (callback) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					// check if callback is a function
					if (typeof callback === "function") {
						const { latitude, longitude } = position.coords;
						callback(latitude, longitude);
					}
				},
				(error) => {
					console.log(error);
				}
			);
		}
	};

	const getNearbyBanks = async () => {
        const query = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyC68H9SdF9KiJWStgwPugHIgY_IILwefRo`
		withCurrentLocation((lat, lng) => {
			let query =
				"https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
			query += "location=" + lat + "," + lng;
			query += "&radius=5000";
			query += "&types=bank";
			query += "&sensor=true";
            query += "&name=hdfc";
			query += "&key=" + process.env.REACT_APP_API_KEY;

			console.log(query);
		});
	};

	return (
		<Card className="m-4">
			<button
				className="btn btn-primary"
				style={{
					width: "300px",
				}}
				onClick={getNearbyBanks}
			>
				Click Me
			</button>

			{/* <Nav justified pills>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === "tab1",
            })}
            onClick={() => {
              toggle("tab1");
            }}
          >
            TAB 1
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === "tab2",
            })}
            onClick={() => {
              toggle("tab2");
            }}
          >
            TAB 2
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="tab1" className="bg-white h-100">
          <Row>
            <Col sm="12" className="p-4">
              <BankDetails />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="tab2" className="bg-white">
          <Row>
            <Col sm="12" className="p-4">
              <UserVisitedBankDetails />
            </Col>
          </Row>
        </TabPane>
      </TabContent> */}
		</Card>
	);
}

export default App;
