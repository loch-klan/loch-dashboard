import { postLoginInstance } from "../../../utils";
import {
  GET_BACK_TEST_CHART_DATA,
  GET_BACK_TEST_QUERIES,
  GET_BACK_TEST_TABLE_DATA,
} from "./BackTestActionTypes";

// https://testing.loch.one/api/common/backtest/get-queries
export const getBackTestQueries = (ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("strategy/backtest/get-queries")
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data) {
            dispatch({
              type: GET_BACK_TEST_QUERIES,
              payload: res.data.data.query_list,
            });
          }
        }
      })
      .catch((err) => {});
  };
};
export const getBackTestChart = (passedData, ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("strategy/backtest/get-chart-data", passedData)
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data) {
            let tempResponse = [];
            let tempObj = res.data.data.chart_data;
            for (let key in tempObj) {
              if (tempObj.hasOwnProperty(key)) {
                const tempArrHolder = [];
                for (let keyTwo in tempObj[key]) {
                  const tempArrHolderInside = [keyTwo, tempObj[key][keyTwo]];
                  tempArrHolder.push(tempArrHolderInside);
                }

                let newObj = {
                  [key]: tempArrHolder,
                };
                tempResponse.push(newObj);
              }
            }

            if (
              res.data.data.condition_results &&
              res.data.data.condition_results.length > 0
            ) {
              tempResponse.push({
                strategy: res.data.data.condition_results,
              });
            }
            dispatch({
              type: GET_BACK_TEST_CHART_DATA,
              // payload: res.data.data.chart_data,
              payload: tempResponse,
            });
          }
        }
      })
      .catch((err) => {
        ctx.setState({
          performanceVisualizationGraphLoading: false,
        });
      });
  };
};
export const getBackTestTable = (passedData, ctx) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("strategy/backtest/get-performance-data", passedData)
      .then((res) => {
        if (!res.data.error) {
          if (res.data.data) {
            const tempArrHolder = [];
            let tempObjHolder = res.data.data.performance_data;

            for (let key in tempObjHolder) {
              if (tempObjHolder.hasOwnProperty(key)) {
                const tempArrHolderInside = JSON.parse(
                  JSON.stringify(tempObjHolder[key])
                );
                let newObj = {
                  [key]: tempArrHolderInside,
                };
                tempArrHolder.push(newObj);
              }
            }

            dispatch({
              type: GET_BACK_TEST_TABLE_DATA,
              payload: tempArrHolder,
            });
          }
        }
      })
      .catch((err) => {
        ctx.setState({
          performanceMetricTableLoading: false,
        });
      });
  };
};

export const createBackTestQuery = (passedData, ctx, afterQueryCreation) => {
  return async function (dispatch, getState) {
    postLoginInstance
      .post("strategy/backtest/create-query", passedData)
      .then((res) => {
        if (!res.data.error) {
          if (afterQueryCreation) {
            afterQueryCreation(true);
          }
        }
      })
      .catch((err) => {
        if (afterQueryCreation) {
          afterQueryCreation(false);
        }
      });
  };
};
