import "../sass/global.scss";
import Layout from "../components/Layout.js";
import React, { useState, useRef, useEffect } from "react";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

export default function App({ Component, pageProps }) {
  const [pagePos, setPagePos] = useState();
  const homeRef = useRef(null);
  const aboutRef = useRef(null);

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
      document.querySelector(".navbar-toggle").classList.remove("menuActive");
      document
        .querySelector(".header")
        .setAttribute("data-menu-active", "false");
      enableBodyScroll(burgerWrapper);
    } else {
      burgerWrapper.classList.add("menuActive");
      document.querySelector(".navbar-toggle").classList.add("menuActive");
      document
        .querySelector(".header")
        .setAttribute("data-menu-active", "true");

      disableBodyScroll(burgerWrapper, {
        reserveScrollBarGap: true,
      });
    }
  }

  const handelScrollTo = (e, whichScrollTo) => {
    let element;
    whichScrollTo == "home"
      ? element = homeRef.current
      : element = aboutRef.current
      
      const offset = 150;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

    e.preventDefault();
  };
  
  const handelCloseScrollTo = (e, whichScrollTo) => {
    toggleMenu();

    let element;
    whichScrollTo == "home"
      ? element = homeRef.current
      : element = aboutRef.current
      
      const offset = 150;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

    e.preventDefault();
  };

  function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", " K", " M", " B"," T"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
  }

  return (
    <Layout
      pagePos={pagePos}
      setPagePos={setPagePos}
      handelScrollTo={handelScrollTo}
      handelCloseScrollTo={handelCloseScrollTo}
    >
      <Component
        {...pageProps}
        pagePos={pagePos}
        setPagePos={setPagePos}
        homeRef={homeRef}
        aboutRef={aboutRef}
        abbreviateNumber={abbreviateNumber}
      />
    </Layout>
  );
}
