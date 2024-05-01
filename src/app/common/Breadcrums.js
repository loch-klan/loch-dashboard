import React from "react";
import { Breadcrumb, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import InActiveHomeSmallIcon from "../../assets/images/icons/InactiveHomeSmallIcon.svg";

export default function Breadcrums(props) {
  const nav_list = window.location.pathname.split("/");
  const breads = nav_list.map((e, key) => {
    // console.log(e, props?.topaccount, key);
    let linkName = e;
    if (linkName === "intelligence") {
      return null;
    } else if (linkName === "transaction-history") {
      linkName = "transactions";
    } else if (linkName === "asset-value") {
      linkName = "historic performance";
    } else if (linkName === "top-accounts") {
      linkName = "leaderboard";
    } else if (linkName === "realized-profit-and-loss") {
      linkName = "flows";
    } else if (linkName === "watchlist") {
      linkName = "following";
    } else if (linkName === "home-leaderboard") {
      linkName = "Loch’s Leaderboard";
    } else if (linkName === "nft") {
      linkName = "NFT";
    } else if (linkName === "referral-codes") {
      linkName = "referrals";
    } else if (linkName === "assets") {
      linkName = "Tokens";
    }
    return (
      e && (
        <>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{
              to:
                props?.topaccount && key === 2
                  ? `/${nav_list[1]}/${e}`
                  : `/${e}`,
            }}
            className="inter-display-medium f-s-13 lh-16"
            active={e === props.currentPage}
            key={key}
          >
            {linkName ? linkName.replace(/-/g, " ") : e.replace(/-/g, " ")}
          </Breadcrumb.Item>
        </>
      )
    );
  });
  const breadCrumb = (
    <Breadcrumb>
      {props.noHomeInPath ? null : (
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/home` }}>
          <Image src={InActiveHomeSmallIcon} />
        </Breadcrumb.Item>
      )}
      {breads}
    </Breadcrumb>
  );
  return (
    <div
      className={`breadcrumsBlock ${
        props.isMobile ? "breadcrumsBlockMobile" : ""
      }`}
    >
      {props.showpath ? breadCrumb : ""}
    </div>
  );
}
