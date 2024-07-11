import React from "react";
import { Col, Row } from "react-bootstrap";
import FooterBg from "../svgs/FooterBg.js";
import Image from 'next/image'

function Footer(props) {
  const pagePos = props.pagePos;

  return (
    <footer>
      <div className="container">
        <h4>CID Contact</h4>
        <div className="footerContainer">
          <div>
            <h5>
              We are committed to deliver the best content discovery and routing
              infastructure for IPFS & Filecoin.
            </h5>
            <div className="contactInfo">
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
                  Notion workspace.
                </a>
              </p>
            </div>
          </div>
          <div>
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
            <div className="logoWrapper">
              <a href="https://ipfs.io/" target="_blank" rel="noreferrer">
                <Image
                  className="logo ipfs"
                  src="/images/IPFS-logo.svg"
                  alt="IPFS Logo"
                  height={30}
                  width={30}
                />
              </a>
              <a href="https://filecoin.io/" target="_blank" rel="noreferrer">
                <Image
                  className="logo"
                  src="/images/filecoin-logo.svg"
                  alt="Filecoin Logo"
                  height={30}
                  width={30}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <FooterBg />
    </footer>
  );
}

export default Footer;