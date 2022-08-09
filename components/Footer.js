import React from "react";
import { Col, Row } from "react-bootstrap";
import FooterBg from "../svgs/FooterBg.js";

function Footer(props) {
  const pagePos = props.pagePos;

  return (
    <footer>
      <div className="container">
        <Row>
          <Col xs={12} xl={5}>
            <h4>CID Contact</h4>
            <nav>
              <ul>
                <li>
                  <a href="#" onClick={(e) => props.handelScrollTo(e, "home")}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => props.handelScrollTo(e, "about")}>
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.cid.contact/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Docs
                  </a>
                </li>
                <li>
                  <a
                    href="https://filecoinproject.slack.com/archives/C02T827T9N0"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Slack
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/filecoin-project/storetheindex"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.notion.so/pl-strflt/Weekly-Status-Report-30699cbe5a99473ea98b4ea4f9a3619b"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Notion
                  </a>
                </li>
              </ul>
            </nav>
          </Col>
          <Col
            xs={8}
            lg={7}
            xxl={6}
            className="offset-xxl-1 ps-xxl-0 pe-4 pe-sm-0"
          >
            <h5>
              We are committed to deliver the best content discovery and routing
              infastructure for IPFS & Filecoin.
            </h5>

            <p>
              For any questions, find us at Filecoin Slack Channel{" "}
              <a
                href="https://filecoinproject.slack.com/archives/C02T827T9N0"
                target="_blank"
                rel="noreferrer"
              >
                #storetheindex.
              </a>
            </p>
            <p>
              For latest project status, visit our public{" "}
              <a
                href="https://www.notion.so/pl-strflt/Weekly-Status-Report-30699cbe5a99473ea98b4ea4f9a3619b"
                target="_blank"
                rel="noreferrer"
              >
                Notion workspace
              </a>
            </p>
          </Col>
          <Col xs={4} lg={5} xl={12} className="d-flex d-lg-block align-items-end justify-content-end mb-3">
            <div className="logoWrapper">
              <a href="https://ipfs.io/" target="_blank" rel="noreferrer">
                <img
                  className="logo"
                  src="images/IPFS-logo.svg"
                  alt="IPFS Logo"
                />
              </a>
              <a href="https://filecoin.io/" target="_blank" rel="noreferrer">
                <img
                  className="logo"
                  src="images/filecoin-logo.svg"
                  alt="Filecoin Logo"
                />
              </a>
            </div>
          </Col>
        </Row>
      </div>
      <FooterBg />
    </footer>
  );
}

export default Footer;