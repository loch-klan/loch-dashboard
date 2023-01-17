// import { receivedPosts } from "./HomeAction";
// import { preLoginInstance } from "../../utils";

// const fetchPosts = (cityName) => {
//     return function (dispatch, getState) {
//         // dispatch(requestPosts());
//         console.log('====================================');
//         console.log('clicked', getState());
//         console.log('====================================');
//         return preLoginInstance.get(`weather?q=${cityName},uk&APPID=${process.env.REACT_APP_WEATHER_API}/`)
//             .then(res => {
//                 console.log('res', res);
//                 dispatch(receivedPosts(res.data));
//             });
//     };
// }

// export default fetchPosts;