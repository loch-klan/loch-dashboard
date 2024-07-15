import React from "react";
import { connect } from "react-redux";
import { NFTPage, TimeSpentNFT } from "../../utils/AnalyticsFunctions";
import { START_INDEX } from "../../utils/Constant";
import { getCurrentUser } from "../../utils/ManageToken";
import { mobileCheck, scrollToTop } from "../../utils/ReusableFunctions";
import { BaseReactComponent } from "../../utils/form";
import WelcomeCard from "../Portfolio/WelcomeCard";
import {
  GetAllPlan,
  getUser,
  setPageFlagDefault,
  updateWalletListFlag,
} from "../common/Api";
import PageHeader from "../common/PageHeader";
import { getAvgCostBasis } from "../cost/Api";
import TransactionTable from "../intelligence/TransactionTable";
import MobileLayout from "../layout/MobileLayout";
import { getAllCoins } from "../onboarding/Api";
import { getAllWalletListApi } from "../wallet/Api";
// import { getNFT } from "./NftApi";
import { Image } from "react-bootstrap";
import { CustomTableBtn } from "../common";
import RemarkInput from "../discover/remarkInput";
import TopWalletAddressList from "../header/TopWalletAddressList";
import "./_expertCallLogs.scss";
import moment from "moment";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import ExpertCallLogsRatingStars from "./ExpertCallLogsRatingStars";
import ExpertCallLogsMobile from "./ExpertCallLogsMobile";

class ExpertCallLogs extends BaseReactComponent {
  constructor(props) {
    super(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const page = params.get("p");
    this.state = {
      goToBottom: false,
      apiResponse: false,
      currentPage: page ? parseInt(page, 10) : START_INDEX,
      tableData: [
        {
          expertName: "@smartestmoney_",
          expertImage:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
          status: "Scheduled",
          dateTime: new Date(),
          callLength: "1hr",
          review: "",
          rating: 0,
        },
        {
          expertName: "@smartestmoney_",
          expertImage:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
          status: "Completed",
          dateTime: new Date(),
          callLength: "1hr 30min",
          review: "Did not deserve a second chance",
          rating: 2,
        },
        {
          expertName: "@childmoney",
          expertImage:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
          status: "Completed",
          dateTime: new Date(),
          callLength: "1hr 30min",
          review: "Nice meeting you",
          rating: 4,
        },
        {
          expertName: "@childmoney",
          expertImage:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
          status: "Completed",
          dateTime: new Date(),
          callLength: "1hr 30min",
          review: "Would love to chat agian",
          rating: 5,
        },
        {
          expertName: "@childmoney",
          expertImage:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
          status: "Completed",
          dateTime: new Date(),
          callLength: "1hr 30min",
          review: "New perspective",
          rating: 4,
        },
        {
          expertName: "@smartestmoney_",
          expertImage:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
          status: "Completed",
          dateTime: new Date(),
          callLength: "1hr 30min",
          review: "Just wasted my time",
          rating: 1,
        },
        {
          expertName: "@smartestmoney_",
          expertImage:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
          status: "Completed",
          dateTime: new Date(),
          callLength: "1hr 30min",
          review: "Love the enthausiasm, not the content",
          rating: 3,
        },
        {
          expertName: "@smartestmoney_",
          expertImage:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
          status: "Cancelled",
          dateTime: new Date(),
          callLength: "30min",
          review: "Great call, very informative",
          rating: 2,
        },
        {
          expertName: "@childmoney",
          expertImage:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
          status: "Cancelled",
          dateTime: new Date(),
          callLength: "1hr 30min",
          review: "Nice meeting you",
          rating: 4,
        },
      ],

      isMobileDevice: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    if (mobileCheck()) {
      this.setState({
        isMobileDevice: true,
      });
    }
    scrollToTop();
    this.props.history.replace({
      search: `?p=${this.state.currentPage}`,
    });

    this.startPageView();
    this.updateTimer(true);
  }

  startPageView = () => {
    this.setState({
      startTime: new Date() * 1,
    });
    NFTPage({
      session_id: getCurrentUser().id,
      email_address: getCurrentUser().email,
      isMobile: this.state.isMobileDevice,
    });
    // Inactivity Check
    window.checkWatchlistTimer = setInterval(() => {
      this.checkForInactivity();
    }, 900000);
  };
  updateTimer = (first) => {
    const tempExistingExpiryTime =
      window.localStorage.getItem("nftPageExpiryTime");
    if (!tempExistingExpiryTime && !first) {
      this.startPageView();
    }
    const tempExpiryTime = Date.now() + 1800000;
    window.localStorage.setItem("nftPageExpiryTime", tempExpiryTime);
  };
  endPageView = () => {
    clearInterval(window.checkWatchlistTimer);
    window.localStorage.removeItem("nftPageExpiryTime");
    if (this.state.startTime) {
      let endTime = new Date() * 1;
      let TimeSpent = (endTime - this.state.startTime) / 1000; //in seconds
      TimeSpentNFT({
        time_spent: TimeSpent,
        session_id: getCurrentUser().id,
        email_address: getCurrentUser().email,
        isMobile: this.state.isMobileDevice,
      });
    }
  };
  checkForInactivity = () => {
    const tempExpiryTime = window.localStorage.getItem("nftPageExpiryTime");
    if (tempExpiryTime && tempExpiryTime < Date.now()) {
      this.endPageView();
    }
  };
  componentWillUnmount() {
    const tempExpiryTime = window.localStorage.getItem("nftPageExpiryTime");
    if (tempExpiryTime) {
      this.endPageView();
    }
  }

  componentDidUpdate(prevProps, prevState) {}

  render() {
    const columnList = [
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Expert</span>
          </div>
        ),
        dataKey: "expert",

        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "expert") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                <div className="expert-call-expert">
                  {rowData.expertImage ? (
                    <Image
                      style={{
                        height: "25px",
                        width: "25px",
                        borderRadius: "50%",
                      }}
                      src={rowData.expertImage}
                    />
                  ) : null}
                  <div>{rowData.expertName}</div>
                </div>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Status</span>
          </div>
        ),
        dataKey: "status",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "status") {
            let currentStatusClass = "";
            if (rowData.status === "Completed") {
              currentStatusClass = "expert-call-log-status-complete";
            } else if (rowData.status === "Scheduled") {
              currentStatusClass = "expert-call-log-status-scheduled";
            } else if (rowData.status === "Cancelled") {
              currentStatusClass = "expert-call-log-status-cancelled";
            }

            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div expert-call-log-status-container">
                <div className={`expert-call-log-status ${currentStatusClass}`}>
                  {rowData.status}
                </div>
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Time</span>
          </div>
        ),
        dataKey: "time",

        coumnWidth: 0.12,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "time") {
            let tempVal = "-";
            let tempOpp = "-";
            tempVal = moment(rowData.dateTime).calendar();
            tempOpp = moment(rowData.dateTime).format("MM/DD/YY hh:mm:ss");
            // if (this.state.isShowingAge && rowData.age) {
            // } else if (!this.state.isShowingAge && rowData.time) {
            //   tempVal = moment(rowData.time).format("MM/DD/YY hh:mm:ss");
            //   tempOpp = rowData.age;
            // }
            return (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={tempOpp ? tempOpp : "-"}
              >
                <span className="table-data-font">{tempVal}</span>
              </CustomOverlay>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">
              Call length
            </span>
          </div>
        ),
        dataKey: "callLength",

        coumnWidth: 0.09,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "callLength") {
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                {rowData.callLength}
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Review</span>
          </div>
        ),
        dataKey: "review",

        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "review") {
            if (rowData.status !== "Completed") {
              return (
                <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  -
                </div>
              );
            }
            return (
              // <CustomOverlay
              //   position="top"
              //   isIcon={false}
              //   isInfo={true}
              //   isText={true}
              //   text={rowData.review ? rowData.review : ""}
              // >
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                <RemarkInput
                  onSubmit={() => {}}
                  remark={rowData.review ? rowData.review : ""}
                />
              </div>
              // {/* </CustomOverlay> */}
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Rating</span>
          </div>
        ),
        dataKey: "rating",

        coumnWidth: 0.15,
        isCell: true,
        cell: (rowData, dataKey) => {
          if (dataKey === "rating") {
            if (rowData.status !== "Completed") {
              return (
                <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                  -
                </div>
              );
            }
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                <ExpertCallLogsRatingStars rating={rowData.rating} />
              </div>
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Action</span>
          </div>
        ),
        dataKey: "Action",

        coumnWidth: 0.11,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "Action") {
            let btnTitle = "";
            if (rowData.status === "Completed") {
              btnTitle = "Book Again";
            } else if (rowData.status === "Scheduled") {
              btnTitle = "Reschedule";
            } else if (rowData.status === "Cancelled") {
              btnTitle = "Reschedule";
            }

            if (dataIndex === 0) {
              btnTitle = "Take call";
            }
            const onClickFun = () => {
              console.log("rowData.status ", rowData.status);
              if (dataIndex === 0) {
                this.props.history.push("/expert-call/2");
              } else if (rowData.status === "Completed") {
                this.props.history.push("/expert-schedule-call/" + dataIndex);
              } else if (rowData.status === "Scheduled") {
                this.props.history.push("/expert-schedule-call/" + dataIndex);
              } else if (rowData.status === "Cancelled") {
                this.props.history.push("/expert-schedule-call/" + dataIndex);
              }
            };
            return (
              <CustomTableBtn
                isChecked
                handleOnClick={onClickFun}
                checkedText={btnTitle}
                uncheckedText={btnTitle}
              />
            );
          }
        },
      },
      {
        labelName: (
          <div className="history-table-header-col no-hover" id="time">
            <span className="inter-display-medium f-s-13 lh-16 ">Chat</span>
          </div>
        ),
        dataKey: "Action",

        coumnWidth: 0.1,
        isCell: true,
        cell: (rowData, dataKey, dataIndex) => {
          if (dataKey === "Action") {
            let btnTitle = "See chat";

            const onClickFun = () => {
              this.props.history.push("/expert-prev-call/2");
            };
            if (rowData.status === "Completed") {
              return (
                <CustomTableBtn
                  isChecked
                  handleOnClick={onClickFun}
                  checkedText={btnTitle}
                  uncheckedText={btnTitle}
                />
              );
            }
            return (
              <div className="inter-display-medium f-s-13 lh-16 table-data-font ellipsis-div">
                -
              </div>
            );
          }
        },
      },
    ];
    if (this.state.isMobileDevice) {
      return (
        <div className="expertCallLogs">
          <MobileLayout
            handleShare={this.handleShare}
            showpath
            currentPage={"expertCallLogs"}
            hideFooter
            history={this.props.history}
            hideShare
            hideAddresses
            noHomeInPath
          >
            <ExpertCallLogsMobile
              tableData={this.state.tableData}
              columnList={columnList}
            />
          </MobileLayout>
        </div>
      );
    }
    return (
      <div className="expertCallLogs">
        <div className="portfolio-page-section">
          <div
            className="portfolio-container page"
            style={{ overflow: "visible" }}
          >
            <div className="portfolio-section">
              <WelcomeCard
                openConnectWallet={this.props.openConnectWallet}
                connectedWalletAddress={this.props.connectedWalletAddress}
                connectedWalletevents={this.props.connectedWalletevents}
                disconnectWallet={this.props.disconnectWallet}
                isSidebarClosed={this.props.isSidebarClosed}
                apiResponse={(e) => this.CheckApiResponse(e)}
                // history
                history={this.props.history}
              />
            </div>
          </div>
        </div>
        <div className="history-table-section m-t-80">
          <div className="history-table page-scroll">
            <div className="page-scroll-child">
              <TopWalletAddressList
                apiResponse={(e) => () => {}}
                showpath
                currentPage={"call-logs"}
                hideShare
                noHomeInPath
              />
              <PageHeader
                title={"Call history"}
                subTitle={
                  "Browse all calls, including those made, scheduled, and cancelled"
                }
                currentPage={"expertCallLogs"}
                history={this.props.history}
                ShareBtn={false}
                updateTimer={this.updateTimer}
              />
              <div
                style={{
                  flex: 1,
                }}
                className="transaction-history-table"
              >
                <TransactionTable
                  showHeaderOnEmpty
                  noSubtitleBottomPadding
                  tableData={this.state.tableData}
                  columnList={columnList}
                  message={"No call logs found"}
                  totalPage={this.props.NFTState?.total_count}
                  history={this.props.history}
                  location={this.props.location}
                  page={this.state.currentPage}
                  isLoading={this.state.isLoading}
                  pageLimit={10}
                  onPageChange={this.onPageChange}
                  addWatermark
                  paginationNew
                  hidePaginationRecords
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  NFTState: state.NFTState,
  commonState: state.CommonState,
});

const mapDispatchToProps = {
  updateWalletListFlag,
  getAllCoins,
  getAvgCostBasis,
  GetAllPlan,
  getUser,
  getAllWalletListApi,
  setPageFlagDefault,
};

ExpertCallLogs.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(ExpertCallLogs);
