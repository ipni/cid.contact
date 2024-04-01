import React, { useEffect, useState } from "react";
import Image from "next/image";

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


    // trap focus in the burger menu for accessibility purposes
    const firstFocusableEl = burgerWrapper.querySelector('button:not([disabled])')
    const lastFocusableEl = burgerWrapper.querySelector('ul li:last-child a')

    burgerWrapper.addEventListener("keydown", e => {
      if (e.key === 'Tab') {
        if (e.shiftKey)  {
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
            e.preventDefault();
          }
        }
      }
    });

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
              <Image
                className="logo ipfs"
                src="/images/IPFS-logo.svg"
                alt="IPFS Logo"
                height={36}
                width={36}
              />
            </a>
            <a href="https://filecoin.io/" target="_blank" rel="noreferrer">
              <Image
                className="logo"
                src="/images/filecoin-logo.svg"
                alt="Filecoin Logo"
                height={36}
                width={36}
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
              <div className="hamburger"></div>
            </button>
          </div>
        </div>
      </header>
      <nav className="mainMenu device">
        <button
          aria-label="Dropdown menu"
          tabIndex="0"
          className="noStyle navbar-toggle menuActive"
          onClick={toggleMenu}
        ></button>
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
