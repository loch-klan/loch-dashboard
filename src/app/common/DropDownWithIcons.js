import React, { useState, useEffect } from "react";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import { lightenDarkenColor } from "../../utils/ReusableFunctions";
import { TriangleArrowDownIcon } from "../../assets/images/icons";
import SearchIcon from "../../assets/images/icons/dropdown-search.svg";
export default function DropDown(props) {
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [search, setSearch] = useState("");
  const [localList, setLocalList] = useState(props.list);
  useEffect(() => {
    if (props.activetab) {
      const tempIndex = localList.findIndex(
        (resData) => resData._id === props.activetab
      );
      if (tempIndex !== -1) {
        setSelectedItem(localList[tempIndex]);
      }
    } else {
      setSelectedItem(undefined);
    }
  }, [props.activetab]);
  useEffect(() => {
    setLocalList(props.list);
  }, [props.list]);
  useEffect(() => {
    setLocalList(props.list);
  }, []);
  useEffect(() => {
    if (search) {
      const filteredList = props.list.filter(
        (resData) =>
          resData.asset?.name?.toLowerCase().includes(search) ||
          resData.asset?.code?.toLowerCase().includes(search)
      );
      setLocalList(filteredList);
    } else {
      setLocalList(props.list);
    }
  }, [search]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const list = localList.map((li, index) => {
    // console.log(li)
    const onSelectPass = () => {
      props.onSelect(li._id);
    };
    const isSelected = li._id === selectedItem?._id ? true : false;
    return (
      <Dropdown.Item
        onClick={onSelectPass}
        eventKey={`${props.id} ${li} ${li.id}`}
        key={index}
        className={`m-b-12 chain-dropdown ${
          isSelected ? "selected-dropdown-item" : ""
        }`}
        style={{
          borderRadius: "0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div
            style={{
              backgroundColor: li.asset.color ? li.asset.color : "white",
              marginRight: "1rem",
              borderRadius: "0.4rem",
              padding: "0.4rem",
              border: `0.5px solid ${lightenDarkenColor(
                li.asset.color ? li.asset.color : "white",
                -0.15
              )}`,
            }}
          >
            <Image
              style={{ height: "2rem", width: "2rem" }}
              src={li.asset.symbol}
            />
          </div>
          <div>{li.asset.name}</div>
        </div>
        {isSelected ? (
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              fill="none"
              stroke="#cccccc"
              strokeWidth="2"
              points="6 13 10.2 16.6 18 7"
            />
          </svg>
        ) : null}
      </Dropdown.Item>
    );
  });

  return (
    <div style={props?.relative ? { position: "relative" } : {}}>
      <Dropdown id={props.id} className={props.class ? props.class : ""}>
        <Dropdown.Toggle id="dropdown-custom-components">
          {selectedItem && selectedItem.asset ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedItem.asset.symbol ? (
                <div
                  style={{
                    backgroundColor: selectedItem.asset.color
                      ? selectedItem.asset.color
                      : "white",
                    marginRight: "1rem",
                    borderRadius: "0.4rem",
                    padding: "0.4rem",
                    border: `0.5px solid ${lightenDarkenColor(
                      selectedItem.asset.color
                        ? selectedItem.asset.color
                        : "white",
                      -0.15
                    )}`,
                  }}
                >
                  <Image
                    style={{
                      height: "2rem",
                      width: "2rem",
                    }}
                    src={selectedItem.asset.symbol}
                  />
                </div>
              ) : null}
              {selectedItem.asset.name ? (
                <div>{selectedItem.asset.name}</div>
              ) : null}
              <Image
                style={{
                  height: "2rem",
                  width: "2rem",
                  marginLeft: "0.5rem",
                }}
                src={TriangleArrowDownIcon}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>Select an asset</div>
              <Image
                style={{
                  height: "2rem",
                  width: "2rem",
                  marginLeft: "0.5rem",
                }}
                src={TriangleArrowDownIcon}
              />
            </div>
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <div className="dropdown-search-wrapper">
            <Image className="dropdown-search-input-icon" src={SearchIcon} />
            <input
              value={search}
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              className="dropdown-search-input"
            />
          </div>
          <div className="dropdown-list-wrapper">{list}</div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
