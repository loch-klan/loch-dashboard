import { toast } from "react-toastify";
import { postLoginInstance, preLoginInstance } from "../../utils";
import {
  EmailAddressVerified,
  EmailNotFound,
  UserSignedinCorrectly,
  UserWrongCode,
  WalletAddressTextbox,
  WhaleWalletAddressTextbox,
  signInUser,
  signUpProperties,
} from "../../utils/AnalyticsFunctions.js";
import { getCurrentUser, setLocalStoraage } from "../../utils/ManageToken";
import { addLocalWalletList } from "../common/Api";
import { YIELD_POOLS } from "../yieldOpportunities/ActionTypes";
import { COINS_LIST, PARENT_COINS_LIST, WALLET_LIST } from "./ActionTypes";
export const getAllCoins = (handleShareLinkUser = null) => {
  return async function (dispatch, getState) {
    dispatch({
      type: COINS_LIST,
      payload: [
        {
          active: true,
          code: "ETH",
          color: "#7B44DA",
          created_on: "2022-09-27 20:01:48.928000+00:00",
          default_asset_code: "ETH",
          default_asset_id: "ethereum",
          id: "633356acb6afee98bcd4436b",
          is_evm: true,
          modified_on: "2022-12-19 12:35:33.439000+00:00",
          name: "Ethereum",
          parent: null,
          platform_code: "ETH",
          platform_id: "ethereum",
          symbol: "https://media.loch.one/loch-ethereum.svg",
        },
        {
          active: true,
          code: "BTC",
          color: "#F19938",
          created_on: "2022-09-27 20:01:48.930000+00:00",
          default_asset_code: "BTC",
          default_asset_id: "bitcoin",
          id: "633356acb6afee98bcd4436c",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.443000+00:00",
          name: "Bitcoin",
          parent: null,
          platform_code: "BTC",
          platform_id: "bitcoin",
          symbol: "https://media.loch.one/loch-bitcoin.svg",
        },
        {
          active: true,
          code: "SOL",
          color: "#5ADDA6",
          created_on: "2022-09-27 20:01:48.931000+00:00",
          default_asset_code: "SOL",
          default_asset_id: "solana",
          id: "633356acb6afee98bcd4436d",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.445000+00:00",
          name: "Solana",
          parent: null,
          platform_code: "SOLANA",
          platform_id: "solana",
          symbol: "https://media.loch.one/loch-solana.svg",
        },
        {
          active: true,
          code: "BSC",
          color: "#F0B90B",
          created_on: "2022-09-27 20:01:48.932000+00:00",
          default_asset_code: "BNB",
          default_asset_id: "binancecoin",
          id: "633356acb6afee98bcd4436e",
          is_evm: true,
          modified_on: "2022-12-19 12:35:33.447000+00:00",
          name: "BSC",
          parent: "633356acb6afee98bcd4436b",
          platform_code: "BSC",
          platform_id: "binance-smart-chain",
          symbol: "https://media.loch.one/loch-binance.svg",
        },
        {
          active: true,
          code: "AVAX",
          color: "#E84042",
          created_on: "2022-09-27 20:01:48.932000+00:00",
          default_asset_code: "AVAX",
          default_asset_id: "avalanche-2",
          id: "633356acb6afee98bcd4436f",
          is_evm: true,
          modified_on: "2022-12-19 12:35:33.449000+00:00",
          name: "Avalanche",
          parent: "633356acb6afee98bcd4436b",
          platform_code: "AVALANCHE",
          platform_id: "avalanche",
          symbol: "https://media.loch.one/loch-avalanche.svg",
        },
        {
          active: true,
          code: "FTM",
          color: "#13B5EC",
          created_on: "2022-09-27 20:01:48.933000+00:00",
          default_asset_code: "FTM",
          default_asset_id: "fantom",
          id: "633356acb6afee98bcd44370",
          is_evm: true,
          modified_on: "2022-12-19 12:35:33.453000+00:00",
          name: "Fantom",
          parent: "633356acb6afee98bcd4436b",
          platform_code: "FANTOM",
          platform_id: "fantom",
          symbol: "https://media.loch.one/loch-fantom.svg",
        },
        {
          active: true,
          code: "POLYGON",
          color: "#8247E5",
          created_on: "2022-09-27 20:01:48.934000+00:00",
          default_asset_code: "MATIC",
          default_asset_id: "matic-network",
          id: "633356acb6afee98bcd44371",
          is_evm: true,
          modified_on: "2022-12-19 12:35:33.458000+00:00",
          name: "Polygon",
          parent: "633356acb6afee98bcd4436b",
          platform_code: "POLYGON",
          platform_id: "polygon-pos",
          symbol: "https://media.loch.one/loch-polygon.svg",
        },
        {
          active: true,
          code: "CELO",
          color: "#F4CE6F",
          created_on: "2022-09-27 20:01:48.934000+00:00",
          default_asset_code: "CELO",
          default_asset_id: "celo",
          id: "633356acb6afee98bcd44372",
          is_evm: true,
          modified_on: "2022-12-19 12:35:33.461000+00:00",
          name: "Celo",
          parent: "633356acb6afee98bcd4436b",
          platform_code: "CELO",
          platform_id: "celo",
          symbol: "https://media.loch.one/loch-celo.svg",
        },
        {
          active: true,
          code: "LTC",
          color: "#345D9D",
          created_on: "2022-09-27 20:01:48.935000+00:00",
          default_asset_code: "LTC",
          default_asset_id: "litecoin",
          id: "633356acb6afee98bcd44373",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.463000+00:00",
          name: "Litecoin",
          parent: null,
          platform_code: "LITECOIN",
          platform_id: "litecoin",
          symbol: "https://media.loch.one/loch-litecoin.svg",
        },
        {
          active: true,
          code: "ALGO",
          color: "#19191A",
          created_on: "2022-09-27 20:01:48.936000+00:00",
          default_asset_code: "ALGO",
          default_asset_id: "algorand",
          id: "633356acb6afee98bcd44374",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.474000+00:00",
          name: "Algorand",
          parent: null,
          platform_code: "ALGORAND",
          platform_id: "algorand",
          symbol: "https://media.loch.one/loch-algorand.svg",
        },
        {
          active: true,
          code: "OP",
          color: "#FF0420",
          created_on: "2022-09-27 20:01:48.937000+00:00",
          default_asset_code: "OP",
          default_asset_id: "optimism",
          id: "633356acb6afee98bcd44375",
          is_evm: true,
          modified_on: "2022-12-19 12:35:33.477000+00:00",
          name: "Optimism",
          parent: "633356acb6afee98bcd4436b",
          platform_code: "OPTIMISM",
          platform_id: "optimistic-ethereum",
          symbol: "https://media.loch.one/loch-optimism.svg",
        },
        {
          active: true,
          code: "ARB",
          color: "#2C374B",
          created_on: "2022-09-27 20:01:48.937000+00:00",
          default_asset_code: "ETH",
          default_asset_id: "ethereum",
          id: "633356acb6afee98bcd44376",
          is_evm: true,
          modified_on: "2022-12-19 12:35:33.479000+00:00",
          name: "Arbitrum",
          parent: "633356acb6afee98bcd4436b",
          platform_code: "ARBITRUM",
          platform_id: "arbitrum-one",
          symbol: "https://media.loch.one/loch-arbitrum.svg",
        },
        {
          active: true,
          code: "TRX",
          color: "#FF060A",
          created_on: "2022-09-27 20:01:48.938000+00:00",
          default_asset_code: "TRX",
          default_asset_id: "tron",
          id: "633356acb6afee98bcd44377",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.482000+00:00",
          name: "Tron",
          parent: null,
          platform_code: "TRON",
          platform_id: "tron",
          symbol: "https://media.loch.one/loch-tron.svg",
        },
        {
          active: true,
          code: "ADA",
          color: "#0033AD",
          created_on: "2022-09-27 20:01:48.939000+00:00",
          default_asset_code: "ADA",
          default_asset_id: "cardano",
          id: "633356acb6afee98bcd44378",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.484000+00:00",
          name: "Cardano",
          parent: null,
          platform_code: "ADA",
          platform_id: "cardano",
          symbol: "https://media.loch.one/loch-cardano.svg",
        },
        {
          active: true,
          code: "XLM",
          color: "#19191A",
          created_on: "2022-09-27 20:01:48.939000+00:00",
          default_asset_code: "XLM",
          default_asset_id: "stellar",
          id: "633356acb6afee98bcd44379",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.486000+00:00",
          name: "Stellar",
          parent: null,
          platform_code: "XLM",
          platform_id: "stellar",
          symbol: "https://media.loch.one/loch-stellar.svg",
        },
        {
          active: true,
          code: "LINEA",
          color: "#19191A",
          created_on: "2024-05-20 08:21:04.647000+00:00",
          default_asset_code: "ETH",
          default_asset_id: "ethereum",
          id: "664b083cd151ebcae583ad58",
          is_evm: true,
          modified_on: "2024-05-20 08:21:04.647000+00:00",
          name: "Linea",
          parent: "633356acb6afee98bcd4436b",
          platform_code: "LINEA",
          platform_id: "linea",
          symbol: "https://media.loch.one/loch-linea.svg",
        },
        {
          active: true,
          code: "BASE",
          color: "#0052ff",
          created_on: {
            $numberLong: "1693227246539",
          },
          default_asset_code: "ETH",
          default_asset_id: "ethereum",
          is_evm: true,
          modified_on: {
            $numberLong: "1693227246539",
          },
          name: "Base",
          parent: "63887912cc085bc89fb65646",
          platform_code: "BASE",
          platform_id: "base",
          symbol: "https://media.loch.one/loch-base.svg",
        },
      ],
    });
    handleShareLinkUser && handleShareLinkUser();
    // let data = new URLSearchParams();
    // postLoginInstance
    //   .post("wallet/chain/get-chains", data)
    //   .then((res) => {
    //     let coinsList =
    //       res.data && res.data.data && res.data.data.chains.length > 0
    //         ? res.data.data.chains
    //         : [];
    //     dispatch({
    //       type: COINS_LIST,
    //       payload: coinsList,
    //     });
    //     handleShareLinkUser && handleShareLinkUser();
    //   })
    //   .catch((err) => {
    //     // console.log("Catch", err);
    //   });
  };
};

export const getAllParentChains = () => {
  return async function (dispatch, getState) {
    let data = new URLSearchParams();
    dispatch({
      type: PARENT_COINS_LIST,
      payload: [
        {
          active: true,
          code: "ETH",
          color: "#7B44DA",
          created_on: "2022-09-27 20:01:48.928000+00:00",
          default_asset_code: "ETH",
          default_asset_id: "ethereum",
          id: "633356acb6afee98bcd4436b",
          is_evm: true,
          modified_on: "2022-12-19 12:35:33.439000+00:00",
          name: "Ethereum",
          parent: null,
          platform_code: "ETH",
          platform_id: "ethereum",
          sub_chains: [
            {
              active: true,
              code: "ARB",
              color: "#2C374B",
              created_on: "2022-09-27 20:01:48.937000+00:00",
              default_asset_code: "ETH",
              default_asset_id: "ethereum",
              id: "633356acb6afee98bcd44376",
              is_evm: true,
              modified_on: "2022-12-19 12:35:33.479000+00:00",
              name: "Arbitrum",
              parent: "633356acb6afee98bcd4436b",
              platform_code: "ARBITRUM",
              platform_id: "arbitrum-one",
              symbol: "https://media.loch.one/loch-arbitrum.svg",
            },
            {
              active: true,
              code: "AVAX",
              color: "#E84042",
              created_on: "2022-09-27 20:01:48.932000+00:00",
              default_asset_code: "AVAX",
              default_asset_id: "avalanche-2",
              id: "633356acb6afee98bcd4436f",
              is_evm: true,
              modified_on: "2022-12-19 12:35:33.449000+00:00",
              name: "Avalanche",
              parent: "633356acb6afee98bcd4436b",
              platform_code: "AVALANCHE",
              platform_id: "avalanche",
              symbol: "https://media.loch.one/loch-avalanche.svg",
            },
            {
              active: true,
              code: "BSC",
              color: "#F0B90B",
              created_on: "2022-09-27 20:01:48.932000+00:00",
              default_asset_code: "BNB",
              default_asset_id: "binancecoin",
              id: "633356acb6afee98bcd4436e",
              is_evm: true,
              modified_on: "2022-12-19 12:35:33.447000+00:00",
              name: "BSC",
              parent: "633356acb6afee98bcd4436b",
              platform_code: "BSC",
              platform_id: "binance-smart-chain",
              symbol: "https://media.loch.one/loch-binance.svg",
            },
            {
              active: true,
              code: "CELO",
              color: "#F4CE6F",
              created_on: "2022-09-27 20:01:48.934000+00:00",
              default_asset_code: "CELO",
              default_asset_id: "celo",
              id: "633356acb6afee98bcd44372",
              is_evm: true,
              modified_on: "2022-12-19 12:35:33.461000+00:00",
              name: "Celo",
              parent: "633356acb6afee98bcd4436b",
              platform_code: "CELO",
              platform_id: "celo",
              symbol: "https://media.loch.one/loch-celo.svg",
            },
            {
              active: true,
              code: "FTM",
              color: "#13B5EC",
              created_on: "2022-09-27 20:01:48.933000+00:00",
              default_asset_code: "FTM",
              default_asset_id: "fantom",
              id: "633356acb6afee98bcd44370",
              is_evm: true,
              modified_on: "2022-12-19 12:35:33.453000+00:00",
              name: "Fantom",
              parent: "633356acb6afee98bcd4436b",
              platform_code: "FANTOM",
              platform_id: "fantom",
              symbol: "https://media.loch.one/loch-fantom.svg",
            },
            {
              active: true,
              code: "OP",
              color: "#FF0420",
              created_on: "2022-09-27 20:01:48.937000+00:00",
              default_asset_code: "OP",
              default_asset_id: "optimism",
              id: "633356acb6afee98bcd44375",
              is_evm: true,
              modified_on: "2022-12-19 12:35:33.477000+00:00",
              name: "Optimism",
              parent: "633356acb6afee98bcd4436b",
              platform_code: "OPTIMISM",
              platform_id: "optimistic-ethereum",
              symbol: "https://media.loch.one/loch-optimism.svg",
            },
            {
              active: true,
              code: "POLYGON",
              color: "#8247E5",
              created_on: "2022-09-27 20:01:48.934000+00:00",
              default_asset_code: "MATIC",
              default_asset_id: "matic-network",
              id: "633356acb6afee98bcd44371",
              is_evm: true,
              modified_on: "2022-12-19 12:35:33.458000+00:00",
              name: "Polygon",
              parent: "633356acb6afee98bcd4436b",
              platform_code: "POLYGON",
              platform_id: "polygon-pos",
              symbol: "https://media.loch.one/loch-polygon.svg",
            },
          ],
          symbol: "https://media.loch.one/loch-ethereum.svg",
        },
        {
          active: true,
          code: "BTC",
          color: "#F19938",
          created_on: "2022-09-27 20:01:48.930000+00:00",
          default_asset_code: "BTC",
          default_asset_id: "bitcoin",
          id: "633356acb6afee98bcd4436c",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.443000+00:00",
          name: "Bitcoin",
          parent: null,
          platform_code: "BTC",
          platform_id: "bitcoin",
          sub_chains: [],
          symbol: "https://media.loch.one/loch-bitcoin.svg",
        },
        {
          active: true,
          code: "SOL",
          color: "#5ADDA6",
          created_on: "2022-09-27 20:01:48.931000+00:00",
          default_asset_code: "SOL",
          default_asset_id: "solana",
          id: "633356acb6afee98bcd4436d",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.445000+00:00",
          name: "Solana",
          parent: null,
          platform_code: "SOLANA",
          platform_id: "solana",
          sub_chains: [],
          symbol: "https://media.loch.one/loch-solana.svg",
        },
        {
          active: true,
          code: "LTC",
          color: "#345D9D",
          created_on: "2022-09-27 20:01:48.935000+00:00",
          default_asset_code: "LTC",
          default_asset_id: "litecoin",
          id: "633356acb6afee98bcd44373",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.463000+00:00",
          name: "Litecoin",
          parent: null,
          platform_code: "LITECOIN",
          platform_id: "litecoin",
          sub_chains: [],
          symbol: "https://media.loch.one/loch-litecoin.svg",
        },
        {
          active: true,
          code: "ALGO",
          color: "#19191A",
          created_on: "2022-09-27 20:01:48.936000+00:00",
          default_asset_code: "ALGO",
          default_asset_id: "algorand",
          id: "633356acb6afee98bcd44374",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.474000+00:00",
          name: "Algorand",
          parent: null,
          platform_code: "ALGORAND",
          platform_id: "algorand",
          sub_chains: [],
          symbol: "https://media.loch.one/loch-algorand.svg",
        },
        {
          active: true,
          code: "TRX",
          color: "#FF060A",
          created_on: "2022-09-27 20:01:48.938000+00:00",
          default_asset_code: "TRX",
          default_asset_id: "tron",
          id: "633356acb6afee98bcd44377",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.482000+00:00",
          name: "Tron",
          parent: null,
          platform_code: "TRON",
          platform_id: "tron",
          sub_chains: [],
          symbol: "https://media.loch.one/loch-tron.svg",
        },
        {
          active: true,
          code: "ADA",
          color: "#0033AD",
          created_on: "2022-09-27 20:01:48.939000+00:00",
          default_asset_code: "ADA",
          default_asset_id: "cardano",
          id: "633356acb6afee98bcd44378",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.484000+00:00",
          name: "Cardano",
          parent: null,
          platform_code: "ADA",
          platform_id: "cardano",
          sub_chains: [],
          symbol: "https://media.loch.one/loch-cardano.svg",
        },
        {
          active: true,
          code: "XLM",
          color: "#19191A",
          created_on: "2022-09-27 20:01:48.939000+00:00",
          default_asset_code: "XLM",
          default_asset_id: "stellar",
          id: "633356acb6afee98bcd44379",
          is_evm: false,
          modified_on: "2022-12-19 12:35:33.486000+00:00",
          name: "Stellar",
          parent: null,
          platform_code: "XLM",
          platform_id: "stellar",
          sub_chains: [],
          symbol: "https://media.loch.one/loch-stellar.svg",
        },
        {
          active: true,
          code: "LINEA",
          color: "#19191A",
          created_on: "2024-05-20 08:21:04.647000+00:00",
          default_asset_code: "ETH",
          default_asset_id: "ethereum",
          id: "664b083cd151ebcae583ad58",
          is_evm: true,
          modified_on: "2024-05-20 08:21:04.647000+00:00",
          name: "Linea",
          parent: "633356acb6afee98bcd4436b",
          platform_code: "LINEA",
          platform_id: "linea",
          symbol: "https://media.loch.one/loch-linea.svg",
        },
        {
          active: true,
          code: "BASE",
          color: "#0052ff",
          created_on: {
            $numberLong: "1693227246539",
          },
          default_asset_code: "ETH",
          default_asset_id: "ethereum",
          is_evm: true,
          modified_on: {
            $numberLong: "1693227246539",
          },
          name: "Base",
          parent: "63887912cc085bc89fb65646",
          platform_code: "BASE",
          platform_id: "base",
          symbol: "https://media.loch.one/loch-base.svg",
        },
      ],
    });
    // postLoginInstance
    //   .post("wallet/chain/get-parent-chains", data)
    //   .then((res) => {
    //     console.log("parent chain res ", res.data.data.chains);
    //     let coinsList =
    //       res.data && res.data.data && res.data.data.chains.length > 0
    //         ? res.data.data.chains
    //         : [];
    //   })
    //   .catch((err) => {
    //     // console.log("Catch", err);
    //   });
  };
};

export const detectCoin = (
  wallet,
  ctx = null,
  isCohort = false,
  index = 0,
  justDetect = false,
  fromConnectWallet = false
) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams();
    data.append("chain", wallet.coinCode);
    data.append("wallet_address", wallet.address);
    postLoginInstance
      .post("wallet/chain/detect-chain", data)
      .then((res) => {
        // && res.data.data.chain_detected

        if (!res.error && res.data) {
          if (
            res.data.data.chain_detected &&
            !isCohort &&
            !ctx?.topAccountPage
          ) {
            WalletAddressTextbox({
              session_id: "",
              address: wallet.address,
              chains_detected: wallet.coinName,
            });
          }

          if (isCohort) {
            WhaleWalletAddressTextbox({
              session_id: getCurrentUser().id,
              email_address: getCurrentUser().email,
              address: wallet.address,
              chains_detected: wallet.coinName,
            });
          }

          if (!isCohort && !ctx?.topAccountPage && !justDetect) {
            // wallet.address = res.data.data.wallet_address;
            dispatch({
              type: WALLET_LIST,
              payload: {
                id: wallet.id,
                coinCode: wallet.coinCode,
                coinSymbol: wallet.coinSymbol,
                coinName: wallet.coinName,
                apiaddress: res.data.data.wallet_address,
                address: wallet.address,
                chain_detected: res.data.data.chain_detected,
                coinColor: wallet.coinColor,
                subChains: wallet.subChains,
              },
            });
          }
          if (ctx) {
            // console.log("walletr", res.data.data.wallet_address, wallet);
            if (fromConnectWallet) {
              if (ctx.handleSetCoinByLocalWallet) {
                ctx.handleSetCoinByLocalWallet({
                  ...wallet,
                  chain_detected: res.data.data.chain_detected,
                  apiaddress: res.data.data.wallet_address,
                });
              }
            } else {
              ctx.handleSetCoin({
                ...wallet,
                chain_detected: res.data.data.chain_detected,
                apiaddress: res.data.data.wallet_address,
              });
            }

            if (
              ctx?.state.isTopAccountPage &&
              index ===
                ctx?.props?.OnboardingState.parentCoinList?.length - 1 &&
              !justDetect
            ) {
              setTimeout(() => {
                ctx?.CalculateOverview && ctx?.CalculateOverview();
              }, 1000);
            }
          }
        }
      })
      .catch((err) => {
        // console.log("Catch", err);
      });
  };
};
export const detectNameTag = (
  wallet,
  ctx = null,
  isCohort = false,
  index = 0
) => {
  return function (dispatch, getState) {
    let data = new URLSearchParams();
    data.append("address", wallet.address);
    postLoginInstance
      .post("wallet/user-wallet/get-nametag", data)
      .then((res) => {
        if (
          !res.error &&
          res.data &&
          res.data.data &&
          res.data.data.result &&
          res.data.data.result.length > 0
        ) {
          if (res.data.data.result[0] && ctx) {
            const resNameTag = res.data.data.result[0];
            ctx.handleSetNameTag({ ...wallet }, resNameTag);
          }
        }
      })
      .catch((err) => {
        // console.log("Catch", err);
      });
  };
};

export const signUpWelcome = (
  ctx,
  data,
  toggleAuthModal,
  stopBtnLoading,
  handleRedirection
) => {
  return async function (dispatch, getState) {
    preLoginInstance
      .post("organisation/user/signup", data)
      .then((res) => {
        if (stopBtnLoading) {
          stopBtnLoading(true);
        }
        if (res.data.error) {
          toast.error(res.data.message || "Something Went Wrong");
        } else if (res.data.error === false) {
          if (res?.data?.data?.is_new_user) {
            if (handleRedirection) {
              handleRedirection();
            } else if (toggleAuthModal) {
              toggleAuthModal("redirect");
            }
          } else {
            toast.error(
              "User with email already exists. Please sign in using this email"
            );
          }
        }
      })
      .catch((err) => {
        if (stopBtnLoading) {
          stopBtnLoading(false);
        }
        toast.error("Something Went Wrong");
      });
  };
};
export const signIn = (
  ctx,
  data,
  v2 = false,
  resend = false,
  isSignup = false
) => {
  preLoginInstance
    .post("organisation/user/send-otp", data)
    .then((res) => {
      if (res.data.error) {
        // toast.error(
        //   <div className="custom-toast-msg">
        //     <div>
        //     {res.data.message}
        //     </div>
        //     <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
        //     Please enter a valid email
        //     </div>
        //   </div>
        //   );
        // toast.error(res.data.message || "Something went Wrong")
        ctx.setState({ emailError: true });
        EmailNotFound({ email_address: ctx.state.email });
        toast.error(res.data.message || "Something Went Wrong");
      } else if (res.data.error === false) {
        //email Valid
        EmailAddressVerified({ email_address: ctx.state.email });
        if (v2) {
          if (isSignup) {
            ctx.toggleAuthModal("redirect");
          } else {
            ctx.toggleAuthModal("verify");
          }
          if (resend) {
            toast.success("OTP sent successfully");
          }
        } else {
          ctx.setState({
            isVerificationRequired: true,
            text: "",
            emailError: false,
          });
          ctx.props.handleStateChange("verifyCode");
        }
      }
    })
    .catch((err) => {
      if (v2) {
        toast.error("Something Went Wrong");
      }
    });
};

export const verifyUser = (ctx, info, v2 = false, goToSmartMoney = false) => {
  return async function (dispatch, getState) {
    preLoginInstance
      .post("organisation/user/verify-otp", info)
      .then((res) => {
        // console.log(res.data.data.user)
        if (!res.data.error) {
          window.localStorage.setItem(
            "lochUser",
            JSON.stringify(res.data.data.user)
          );
          window.localStorage.setItem("lochToken", res.data.data.token);
          // free pricing
          let plan = {
            defi_enabled: true,
            export_address_limit: -1,
            id: "63eb32769b5e4daf6b588207",
            is_default: false,
            is_trial: false,
            name: "Sovereign",
            notifications_limit: -1,
            notifications_provided: true,
            plan_reference_id: "prod_NM0aQTO38msDkq",
            subscription: {
              active: true,
              created_on: "2023-04-06 06:41:11.302000+00:00",
              id: "642e69878cc994b64ca49272",
              modified_on: "2023-04-06 06:41:11.302000+00:00",
              plan_id: "63eb32769b5e4daf6b588207",
              plan_reference_id: "prod_NM0aQTO38msDkq",
              subscription_reference_id: "",
              trial_subscription: false,
              user_id: "63f89011251cc82aeebfcae5",
              valid_till: "2023-05-06 00:00:00+00:00",
            },
            trial_days: 30,
            upload_csv: true,
            wallet_address_limit: -1,
            whale_pod_address_limit: -1,
            whale_pod_limit: -1,
            influencer_pod_limit: -1,
          };
          // free pricing
          window.localStorage.setItem(
            "currentPlan",
            JSON.stringify({
              ...plan,
              influencer_pod_limit: -1,
            })
          );
          // window.localStorage.setItem(
          //   "currentPlan",
          //   JSON.stringify({...res.data.data?.current_plan,influencer_pod_limit:
          // res.data.data?.current_plan.name === "Free" ? 1 : -1,})
          // );

          const allChains = ctx.props.OnboardingState.coinsList;
          let addWallet = [];
          const apiResponse = res.data.data;
          for (let i = 0; i < apiResponse?.user?.user_wallets?.length; i++) {
            let obj = {}; // <----- new Object
            // obj['address'] = apiResponse.user.wallets[i].address;
            obj["address"] = apiResponse?.user?.user_wallets[i]?.address;

            // obj['displayAddress'] = apiResponse.user.wallets[i]?.display_address;
            obj["displayAddress"] =
              apiResponse.user.user_wallets[i]?.display_address;
            // const chainsDetected =
            //   apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
            //     .chains;

            const chainsDetected =
              apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
                ?.chains ||
              apiResponse.wallets[
                apiResponse.user?.user_wallets[i]?.address.toLowerCase()
              ]?.chains;
            obj["coins"] = allChains.map((chain) => {
              let coinDetected = false;
              chainsDetected.map((item) => {
                if (item.id === chain.id) {
                  coinDetected = true;
                }
              });
              return {
                coinCode: chain.code,
                coinSymbol: chain.symbol,
                coinName: chain.name,
                chain_detected: coinDetected,
                coinColor: chain.color,
              };
            });
            obj["wallet_metadata"] = apiResponse?.user?.user_wallets[i]?.wallet;
            obj["id"] = `wallet${i + 1}`;

            let chainLength =
              apiResponse.wallets[apiResponse?.user?.user_wallets[i]?.address]
                ?.chains?.length ||
              apiResponse.wallets[
                apiResponse?.user?.user_wallets[i]?.address.toLowerCase()
              ]?.chains?.length;

            obj["coinFound"] = chainLength > 0 ? true : false;

            obj["nickname"] = apiResponse?.user?.user_wallets[i]?.nickname;
            obj["showAddress"] =
              apiResponse?.user?.user_wallets[i]?.nickname === ""
                ? true
                : false;
            obj["showNickname"] =
              apiResponse?.user?.user_wallets[i]?.nickname !== ""
                ? true
                : false;
            obj["nameTag"] = apiResponse.user.user_wallets[i].tag
              ? apiResponse.user.user_wallets[i].tag
              : "";
            obj["showNameTag"] = apiResponse.user.user_wallets[i].tag
              ? true
              : false;
            addWallet.push(obj);
          }

          // Mixpanel function
          if (goToSmartMoney) {
            signInUser({
              email_address: res.data.data.user?.email,
              userId: res.data.data.user?.link,
              first_name: res.data.data.user?.first_name,
              last_name: res.data.data.user?.last_name,
              track: "Landing page sign in",
            });
          } else {
            signInUser({
              email_address: res.data.data.user?.email,
              userId: res.data.data.user?.link,
              first_name: res.data.data.user?.first_name,
              last_name: res.data.data.user?.last_name,
              track: "Landing page smart money sign in",
            });
          }
          // console.log("addWallet", addWallet);
          window.localStorage.setItem("addWallet", JSON.stringify(addWallet));
          addLocalWalletList(JSON.stringify(addWallet));
          ctx.props.history.push({
            pathname: goToSmartMoney ? "/home-leaderboard" : "/home",
            state: { addWallet },
          });
          UserSignedinCorrectly({
            email_address: res.data.data.user.email,
            session_id: res.data.data.user?.link,
          });
          // if (window.localStorage.getItem("lochToken")) {
          //   postLoginInstance
          //     .post("wallet/user-wallet/add-yield-pools")
          //     .then((res) => {
          //       dispatch({
          //         type: YIELD_POOLS,
          //         payload: res,
          //       });
          //     })
          //     .catch(() => {
          //       console.log("Issue here");
          //     });

          //   postLoginInstance
          //     .post("wallet/user-wallet/add-nfts")
          //     .then((res) => {})
          //     .catch(() => {
          //       console.log("Issue here");
          //     });
          // }
        } else {
          UserWrongCode({ email_address: ctx.state.email });
          toast.error(
            <div className="custom-toast-msg">
              <div>{res.data.message}</div>
              <div className="inter-display-medium f-s-13 lh-16 grey-737 m-t-04">
                Please enter a valid otp
              </div>
            </div>
          );
          // toast.error(res.data.message || "Something Went Wrong")
        }
      })
      .catch((err) => {
        console.log("error while verifying", err);
      });
  };
};

export const createAnonymousUserApi = (
  data,
  ctx,
  addWallet,
  userFunction = null,
  goToPage = null,
  funAfterUserCreate,
  addressList = []
) => {
  return function (dispatch, getState) {
    // window.localStorage.setItem('currency',JSON.stringify({
    //         active: true,
    //         code: "USD",
    //         id: "6399a2d35a10114b677299fe",
    //         name: "United States Dollar",
    //         symbol: "$",
    //         rate: 1,
    // }))

    window.localStorage.setItem("stopClick", false);

    window.localStorage.setItem("lochToken", "jsk");

    // if (!ctx.props.ishome) {
    //   if (!ctx.state?.podName) {
    //     !ctx.state?.id &&
    //       !goToPage &&
    //       ctx.props?.history.push({
    //         pathname: ctx.state?.id ? ctx.state?.link : "/home",
    //         // state: {addWallet: ctx.state.id ? addWallet : newAddWallet}
    //         state: {
    //           noLoad: true,
    //           redirectPath: ctx.state?.redirectPath,
    //           hash: ctx?.state?.hash,
    //         },
    //       });
    //   }
    // }

    postLoginInstance
      .post("organisation/user/create-user", data)
      .then((res) => {
        // console.log("inside create user function")
        if (!res.data.error) {
          window.localStorage.setItem("lochDummyUser", res.data.data.user.link);
          window.localStorage.setItem("lochToken", res.data.data.token);

          // free pricing
          let plan = {
            defi_enabled: true,
            export_address_limit: -1,
            id: "63eb32769b5e4daf6b588207",
            is_default: false,
            is_trial: false,
            name: "Sovereign",
            notifications_limit: -1,
            notifications_provided: true,
            plan_reference_id: "prod_NM0aQTO38msDkq",
            subscription: {
              active: true,
              created_on: "2023-04-06 06:41:11.302000+00:00",
              id: "642e69878cc994b64ca49272",
              modified_on: "2023-04-06 06:41:11.302000+00:00",
              plan_id: "63eb32769b5e4daf6b588207",
              plan_reference_id: "prod_NM0aQTO38msDkq",
              subscription_reference_id: "",
              trial_subscription: false,
              user_id: "63f89011251cc82aeebfcae5",
              valid_till: "2023-05-06 00:00:00+00:00",
            },
            trial_days: 30,
            upload_csv: true,
            wallet_address_limit: -1,
            whale_pod_address_limit: -1,
            whale_pod_limit: -1,
            influencer_pod_limit: -1,
          };
          // free pricing
          window.localStorage.setItem(
            "currentPlan",
            JSON.stringify({
              ...plan,
              influencer_pod_limit: -1,
            })
          );
          // window.localStorage.setItem(
          //   "currentPlan",
          //   JSON.stringify({...res.data.data.current_plan,influencer_pod_limit:
          // res.data.data?.current_plan.name === "Free" ? 1 : -1,})
          // );

          window.localStorage.setItem("stopClick", true);

          signUpProperties({
            userId: res.data.data.user.link,
            email_address: "",
            first_name: "",
            last_name: "",
          });

          const allChains = ctx.props.OnboardingState.coinsList;

          let newAddWallet = [];
          const apiResponse = res.data.data;
          // console.log("res ", apiResponse)
          for (let i = 0; i < apiResponse.user.user_wallets.length; i++) {
            let obj = {}; // <----- new Object
            obj["address"] = apiResponse.user.user_wallets[i].address;

            obj["displayAddress"] =
              apiResponse.user.user_wallets[i]?.display_address;
            const chainsDetected =
              apiResponse.wallets[apiResponse.user.user_wallets[i].address]
                ?.chains ||
              apiResponse.wallets[
                apiResponse.user.user_wallets[i].address.toLowerCase()
              ]?.chains;

            obj["coins"] = allChains?.map((chain) => {
              let coinDetected = false;
              chainsDetected?.map((item) => {
                if (item.id === chain.id) {
                  coinDetected = true;
                }
              });
              return {
                coinCode: chain.code,
                coinSymbol: chain.symbol,
                coinName: chain.name,
                chain_detected: coinDetected,
                coinColor: chain.color,
              };
            });
            obj["wallet_metadata"] = apiResponse.user?.user_wallets[i]?.wallet;
            obj["id"] = `wallet${i + 1}`;
            let chainLength =
              apiResponse.wallets[apiResponse.user?.user_wallets[i]?.address]
                ?.chains?.length ||
              apiResponse.wallets[
                apiResponse.user?.user_wallets[i]?.address.toLowerCase()
              ]?.chains?.length;
            obj["coinFound"] = chainLength > 0 ? true : false;
            obj["nickname"] = apiResponse.user.user_wallets[i]?.nickname;
            obj["showAddress"] =
              apiResponse.user.user_wallets[i]?.nickname === "" ? true : false;
            obj["showNickname"] =
              apiResponse.user.user_wallets[i]?.nickname !== "" ? true : false;
            obj["nameTag"] = apiResponse.user.user_wallets[i].tag
              ? apiResponse.user.user_wallets[i].tag
              : "";
            obj["showNameTag"] = apiResponse.user.user_wallets[i].tag
              ? true
              : false;
            newAddWallet.push(obj);
          }
          if (ctx.state.podName) {
            window.localStorage.setItem(
              "addWallet",
              JSON.stringify(newAddWallet)
            );
            addLocalWalletList(JSON.stringify(addWallet));
          } else {
            window.localStorage.setItem(
              "addWallet",
              JSON.stringify(ctx.state.id ? addWallet : newAddWallet)
            );
          }
          // console.log("wallet", addWallet);
          if (userFunction) {
            // console.log("user function found");
            ctx.getUrl();
            window.localStorage.setItem("stop_redirect", true);
            setTimeout(() => {
              userFunction();
            }, 100);
          } else {
            //  console.log("user function not found");
            if (ctx.state?.podName) {
              //  console.log("podname login redirect to link", ctx.state?.link);
              ctx.props?.history.push({
                pathname: ctx.state?.link,
              });
            } else {
              if (goToPage) {
                setTimeout(() => {
                  ctx.props.history.replace({
                    pathname: ctx.state?.id ? ctx.state?.link : goToPage,
                    state: {
                      addWallet: ctx.state?.id ? addWallet : newAddWallet,
                      noLoad: false,
                      redirectPath: ctx.state?.redirectPath,
                      hash: ctx?.state?.hash,
                    },
                  });
                  if (funAfterUserCreate) {
                    if (addressList && addressList.length > 0) {
                      const tempItem = addressList[0];
                      funAfterUserCreate(tempItem);
                    }
                  }
                }, 1000);
              } else {
                // console.log("replace")
                ctx.props.history.replace({
                  pathname: ctx.state?.id ? ctx.state?.link : "/home",
                  state: {
                    addWallet: ctx.state?.id ? addWallet : newAddWallet,
                    noLoad: false,
                    redirectPath: ctx.state?.redirectPath,
                    hash: ctx?.state?.hash,
                  },
                });
              }
            }
          }

          let passAddress = newAddWallet?.map((wallet) => {
            return wallet.address;
          });
          // if (window.localStorage.getItem("lochToken") && passAddress) {
          //   const yieldData = new URLSearchParams();
          //   yieldData.append("wallet_addresses", JSON.stringify(passAddress));
          //   postLoginInstance
          //     .post("wallet/user-wallet/add-yield-pools", yieldData)
          //     .then((res) => {
          //       dispatch({
          //         type: YIELD_POOLS,
          //         payload: res,
          //       });
          //     })
          //     .catch(() => {
          //       console.log("Issue here");
          //     });
          //   postLoginInstance
          //     .post("wallet/user-wallet/add-nfts", yieldData)
          //     .then(() => {})
          //     .catch(() => {
          //       console.log("Issue here");
          //     });
          // }
        } else {
          toast.error(res.data.message || "Something Went Wrong");
        }
      });
  };
};

// create user for app feature
export const AppFeaturesCreateUser = (data, ctx, userFunction = null) => {
  window.localStorage.setItem("stopClick", false);

  window.localStorage.setItem("lochToken", "jsk");

  postLoginInstance.post("organisation/user/create-user", data).then((res) => {
    if (!res.data.error) {
      window.localStorage.setItem("lochDummyUser", res.data.data.user.link);
      window.localStorage.setItem("lochToken", res.data.data.token);

      // free pricing
      let plan = {
        defi_enabled: true,
        export_address_limit: -1,
        id: "63eb32769b5e4daf6b588207",
        is_default: false,
        is_trial: false,
        name: "Sovereign",
        notifications_limit: -1,
        notifications_provided: true,
        plan_reference_id: "prod_NM0aQTO38msDkq",
        subscription: {
          active: true,
          created_on: "2023-04-06 06:41:11.302000+00:00",
          id: "642e69878cc994b64ca49272",
          modified_on: "2023-04-06 06:41:11.302000+00:00",
          plan_id: "63eb32769b5e4daf6b588207",
          plan_reference_id: "prod_NM0aQTO38msDkq",
          subscription_reference_id: "",
          trial_subscription: false,
          user_id: "63f89011251cc82aeebfcae5",
          valid_till: "2023-05-06 00:00:00+00:00",
        },
        trial_days: 30,
        upload_csv: true,
        wallet_address_limit: -1,
        whale_pod_address_limit: -1,
        whale_pod_limit: -1,
        influencer_pod_limit: -1,
      };
      // free pricing
      window.localStorage.setItem(
        "currentPlan",
        JSON.stringify({
          ...plan,
          influencer_pod_limit: -1,
        })
      );
      // window.localStorage.setItem(
      //   "currentPlan",
      //   JSON.stringify({...res.data.data.current_plan,influencer_pod_limit:
      // res.data.data?.current_plan.name === "Free" ? 1 : -1,})
      // );

      window.localStorage.setItem("stopClick", true);

      setLocalStoraage();

      signUpProperties({
        userId: res.data.data.user.link,
        email_address: "",
        first_name: "",
        last_name: "",
      });

      const allChains = ctx.props.OnboardingState.coinsList;

      let newAddWallet = [];
      const apiResponse = res.data.data;
      // console.log("res ", apiResponse)
      for (let i = 0; i < apiResponse.user.user_wallets.length; i++) {
        let obj = {}; // <----- new Object
        obj["address"] = apiResponse.user.user_wallets[i].address;

        obj["displayAddress"] =
          apiResponse.user.user_wallets[i]?.display_address;
        const chainsDetected =
          apiResponse.wallets[apiResponse.user.user_wallets[i].address]
            ?.chains ||
          apiResponse.wallets[
            apiResponse.user.user_wallets[i].address.toLowerCase()
          ]?.chains;

        obj["coins"] = allChains?.map((chain) => {
          let coinDetected = false;
          chainsDetected?.map((item) => {
            if (item.id === chain.id) {
              coinDetected = true;
            }
          });
          return {
            coinCode: chain.code,
            coinSymbol: chain.symbol,
            coinName: chain.name,
            chain_detected: coinDetected,
            coinColor: chain.color,
          };
        });
        obj["wallet_metadata"] = apiResponse.user?.user_wallets[i]?.wallet;
        obj["id"] = `wallet${i + 1}`;
        let chainLength =
          apiResponse.wallets[apiResponse.user?.user_wallets[i]?.address]
            ?.chains?.length ||
          apiResponse.wallets[
            apiResponse.user?.user_wallets[i]?.address.toLowerCase()
          ]?.chains?.length;
        obj["coinFound"] = chainLength > 0 ? true : false;
        obj["nickname"] = apiResponse.user.user_wallets[i]?.nickname;
        obj["showAddress"] =
          apiResponse.user.user_wallets[i]?.nickname === "" ? true : false;
        obj["showNickname"] =
          apiResponse.user.user_wallets[i]?.nickname !== "" ? true : false;
        obj["nameTag"] = apiResponse.user.user_wallets[i].tag
          ? apiResponse.user.user_wallets[i].tag
          : "";
        obj["showNameTag"] = apiResponse.user.user_wallets[i].tag
          ? true
          : false;
        newAddWallet.push(obj);
      }
      window.localStorage.setItem("addWallet", JSON.stringify(newAddWallet));
      addLocalWalletList(JSON.stringify(newAddWallet));
      if (userFunction) {
        setTimeout(() => {
          userFunction();
        }, 200);
      }
    } else {
      toast.error(res.data.message || "Something Went Wrong");
    }
  });
};
