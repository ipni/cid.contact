import React, { useEffect, useState } from "react";

import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

function Header(props) {
  const scrolled = props.scrolled;

  const pagePos = props.pagePos;

  // On Window Resize Store the Windows Width
  const [width, setWidth] = useState(0);
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (width >= 992) {
      // On resize if desktop then reEnableScroll
      enableBodyScroll(document.querySelector(".mainMenu.device"));
    } else {
      // On resize if divice width and menu is open then disable the body scroll
      if (
        document
          .querySelector(".mainMenu.device")
          .classList.contains("menuActive")
      ) {
        disableBodyScroll(document.querySelector(".mainMenu.device"), {
          reserveScrollBarGap: true,
        });
      }
      // On resize if divice width and menu is closed then enable the body scroll
      else {
        enableBodyScroll(document.querySelector(".mainMenu.device"));
      }
    }
  });

  function toggleMenu() {
    // var viewportWidth =
    //   window.innerWidth || document.documentElement.clientWidth;
    const burgerWrapper = document.querySelector(".mainMenu.device");

    // if (viewportWidth <= 991) {
    if (burgerWrapper.classList.contains("menuActive")) {
      burgerWrapper.classList.remove("menuActive");
      //document.querySelector(".navbar-toggle").classList.remove("menuActive");
      document
        .querySelector(".header")
        .setAttribute("data-menu-active", "false");
      enableBodyScroll(burgerWrapper);
    } else {
      burgerWrapper.classList.add("menuActive");
      //document.querySelector(".navbar-toggle").classList.add("menuActive");
      document
        .querySelector(".header")
        .setAttribute("data-menu-active", "true");

      disableBodyScroll(burgerWrapper, {
        reserveScrollBarGap: true,
      });
    }
  }

  return (
    <>
      <header
        className={scrolled == true ? "scrolled header" : "header"}
        data-menu-active="false"
      >
        <div className="container">
          <div className="leftWrapper">
            <h1>CID Contact</h1>
          </div>
          <div className="centerWrapper">
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
          <div className="rightWrapper">
            <nav className="mainMenu desktop">
              <ul>
                <li>
                  <a
                    href="#"
                    className={pagePos == "home" ? "active" : undefined}
                    onClick={(e) => props.handelScrollTo(e, "home")}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={pagePos == "about" ? "active" : undefined}
                    onClick={(e) => props.handelScrollTo(e, "about")}
                  >
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
                    href="https://status.cid.contact/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </nav>

            <button className="noStyle navbar-toggle" onClick={toggleMenu}>
              <span className="visually-hidden">Toggle Navigation</span>
              <span className="icon-bar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0"
                  y="0"
                  viewBox="0 0 16 2.3"
                >
                  <path d="M0 1.1C0 .8.1.5.3.3s.5-.3.8-.3h13.7c.3 0 .6.1.8.3.3.2.4.5.4.8 0 .3-.1.6-.3.8-.2.2-.5.3-.8.3H1.1c-.3.1-.6 0-.8-.2-.2-.3-.3-.6-.3-.9z"></path>
                </svg>
              </span>
              <span className="icon-bar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0"
                  y="0"
                  viewBox="0 0 16 2.3"
                >
                  <path d="M0 1.1C0 .8.1.5.3.3s.5-.3.8-.3h13.7c.3 0 .6.1.8.3.3.2.4.5.4.8 0 .3-.1.6-.3.8-.2.2-.5.3-.8.3H1.1c-.3.1-.6 0-.8-.2-.2-.3-.3-.6-.3-.9z"></path>
                </svg>
              </span>
              <span className="icon-bar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0"
                  y="0"
                  viewBox="0 0 16 2.3"
                >
                  <path d="M0 1.1C0 .8.1.5.3.3s.5-.3.8-.3h13.7c.3 0 .6.1.8.3.3.2.4.5.4.8 0 .3-.1.6-.3.8-.2.2-.5.3-.8.3H1.1c-.3.1-.6 0-.8-.2-.2-.3-.3-.6-.3-.9z"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </header>
      <nav className="mainMenu device">
        <button className="noStyle navbar-toggle menuActive" onClick={toggleMenu}>
          <span className="visually-hidden">Toggle Navigation</span>
          <span className="icon-bar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0"
              y="0"
              viewBox="0 0 16 2.3"
            >
              <path d="M0 1.1C0 .8.1.5.3.3s.5-.3.8-.3h13.7c.3 0 .6.1.8.3.3.2.4.5.4.8 0 .3-.1.6-.3.8-.2.2-.5.3-.8.3H1.1c-.3.1-.6 0-.8-.2-.2-.3-.3-.6-.3-.9z"></path>
            </svg>
          </span>
          <span className="icon-bar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0"
              y="0"
              viewBox="0 0 16 2.3"
            >
              <path d="M0 1.1C0 .8.1.5.3.3s.5-.3.8-.3h13.7c.3 0 .6.1.8.3.3.2.4.5.4.8 0 .3-.1.6-.3.8-.2.2-.5.3-.8.3H1.1c-.3.1-.6 0-.8-.2-.2-.3-.3-.6-.3-.9z"></path>
            </svg>
          </span>
          <span className="icon-bar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0"
              y="0"
              viewBox="0 0 16 2.3"
            >
              <path d="M0 1.1C0 .8.1.5.3.3s.5-.3.8-.3h13.7c.3 0 .6.1.8.3.3.2.4.5.4.8 0 .3-.1.6-.3.8-.2.2-.5.3-.8.3H1.1c-.3.1-.6 0-.8-.2-.2-.3-.3-.6-.3-.9z"></path>
            </svg>
          </span>
        </button>
        <ul>
          <li>
            <a href="#" onClick={(e) => props.handelCloseScrollTo(e, "home")}>
              Home
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => props.handelCloseScrollTo(e, "about")}>
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
              href="https://status.cid.contact/"
              target="_blank"
              rel="noreferrer"
            >
              Status
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
