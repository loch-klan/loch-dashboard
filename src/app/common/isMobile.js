import React, { useState, useEffect } from "react";

function IsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 480px)");
    setIsMobile(mediaQuery.matches);
     localStorage.setItem("isMobile", mediaQuery.matches);

    function handleResize() {
      setIsMobile(mediaQuery.matches);
      localStorage.setItem("isMobile", mediaQuery.matches);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}

export default IsMobile;
