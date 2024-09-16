import { postLoginInstance } from "../../../utils";
import { GET_STRATEGY_DISCOVERY_TABLE_DATA } from "./StrategyDiscoveryActionTypes";

export const getStrategyDiscoveryTable = (passedData, ctx) => {
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
              type: GET_STRATEGY_DISCOVERY_TABLE_DATA,
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
