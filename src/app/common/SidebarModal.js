import React from "react";

import DontLoseDataModal from "./DontLoseDataModal";

function SidebarModal(props) {
  return (
    <div className="sidebar-modal-section">
      {props.show ? (
        <DontLoseDataModal
          trackPos={props.trackPos}
          dragPosition={props.dragPosition}
          show={props.show}
          onHide={props.onHide}
          history={props.history}
          popupType={props.popupType}
          tracking={props.tracking}
          openSignupModalDirect={props.openSignupModalDirect}
        />
      ) : null}
    </div>
  );
}

export default SidebarModal;
