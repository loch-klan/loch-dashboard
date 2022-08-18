import React, { Component } from "react"
import { ComponentHeader } from "../common"

class ViewVehicleLocation extends Component {
  constructor(props) {
    super(props)
    const id = props && props.match.params.id
    this.state = {
      id
    }
  }
  componentDidMount() {}

  render() {
    return (
      <div>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          breadcrumb={true}
          currentPage={"View Vehicle Location"}
          title={"View Vehicle Location"}
        />
        <div className="order-details-wrapper add-edit-customer-wrapper">
          <div className="content view-detail-page">
            <iframe
              src={`http://13.233.206.195:3000/d-solo/nnH0uV57z/bike-details?orgId=2&var-Bike=${this.state.id}&refresh=10s&from=1657153417250&to=1657175017250&panelId=5`}
              width="100%"
              height="600"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </div>
    )
  }
}

export default ViewVehicleLocation
