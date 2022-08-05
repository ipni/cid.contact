import React, { useEffect, useState } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

export default function Layout({ children, ...props }) {
  const [offset, setOffset] = useState(false);
  const pagePos =  props.pagePos;
  const handelScrollTo = props.handelScrollTo;
  const handelCloseScrollTo = props.handelCloseScrollTo;

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY > 30);
    // clean up code
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Header scrolled={offset} pagePos={pagePos} handelScrollTo={handelScrollTo} handelCloseScrollTo={handelCloseScrollTo} />
      {children}
      <Footer pagePos={pagePos} handelScrollTo={handelScrollTo} />
    </>
  );
}
