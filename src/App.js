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

function App() {
  const [activeTab, setActiveTab] = useState("tab1");

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <Card className="m-4">
      <Nav justified pills>
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
      </TabContent>
    </Card>
  );
}

export default App;
