import { Component } from "react";

import { connect } from "react-redux";
import { mobileCheck } from "../../utils/ReusableFunctions";
import { getUser } from "../common/Api";
import { Image } from "react-bootstrap";
import {
  AudioCallExpertsIcon,
  ChatExpertsIcon,
  DownloadArrowBoxIcon,
  ExpertCallMuteMicIcon,
  ExpertCallPhoneIcon,
  SendChatMessageIcon,
  TransactionCardIcon,
} from "../../assets/images/icons";
import moment from "moment";
import ExpertCallContentMobile from "./ExpertCallContentMobile";

class ExpertCallContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: false,
      isMobile: mobileCheck(),
      callTranscript: [
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium. Maiores cumque non, esse obcaecati nesciunt eaque sequi earum.",
          time: new Date(),
        },
      ],
      allChats: [
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
        {
          user: "You",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/df3e/6848/191f19342dc8a8a6ff1928adfa2af324?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oR-6Do6UkmCPuws~lvVzSUVuJnTbOkAaHtC~gc0byauCOfOznwt2SOmR8gzryf03f-oHROx7ZNKUHUi417Sy11UptFd6CXGwMAJFGk6Ps0oIE2kjmLwfCEbo5W6m4O9Ss2eed~wb5FjgBFbm~9zInwPwGSVuy3T58hy7NQHIMUJeWDVg0YgXOPF-gOS6p~PXcv9s7o4JFjqeC9BECnYoq-oQ0VtyK07aCgksczui2P5F~6WLrCQNE8B41JWyOdOaWGlupgqsOI84Ll6OLcCl4VQgJSaYCzbKGBCcfdBuWK0EvJI7daw8XFVhHpewbGUOsEhiVqMvWIJex0S4Wquv4w__",
        },
        {
          user: "SMARTESTMONEY_",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis reprehenderit fugiat ex, molestias ullam ad similique sint laboriosam ipsum, necessitatibus praesentium.",
          image:
            "https://s3-alpha-sig.figma.com/img/b2d4/3287/b54d8cbfa3890b921fe78bb145922337?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Hqo5du5UiJKN~OQh94x-mORhA4jt58pbsIgkV7DfY3YMauYfwwy46eqEXNYy~jpVmq4u~c7J57145rEbXL~eEltmGHEQ321DYfFYRohT-b1wUxWK4POL1RUVZLGqFiK67vGvV~OF7MxOrAe0wh1zQMHwLqq~CVrkupQwsrqh132Nl7zv1oiOSfJYwPzgj5MZ-o-u-tZuFT-fvrO7GfOKF0a9rr2IpIC7eakgYIxrwBnDETM3iSgIRjCqY1rXEaISU4NjhaFoAIoTjs3~BDCjMv~SSmxu1eInv3mrNTWrDsipVkCSh6Tilgff7-SwODFCUob9bvsmeWHD0FJedmC5yA__",
        },
      ],
    };
  }
  componentDidMount() {}

  render() {
    if (this.state.isMobile) {
      return (
        <ExpertCallContentMobile
          allChats={this.state.allChats}
          callTranscript={this.state.callTranscript}
          isDarkMode={this.state.isDarkMode}
        />
      );
    }
    return (
      <div className="exper-call-running-page">
        <div className="exper-call-finished-page-block-top-gradient" />
        <div
          className={`ecrp-block-container ${
            this.props.isPreviousCall ? "ecrp-block-prev-container" : ""
          }`}
        >
          <div className="ecrp-block ecrp-block-left">
            <div className="ecrp-b-left-header">
              <div className=" ecrp-b-lh-icon-text ecrp-b-lh-icon-text-transition">
                <Image src={TransactionCardIcon} className="ecrp-b-lh-icon" />
                <div>Transcript</div>
              </div>
              <div className="ecrp-b-lh-icon-text ecrp-b-lh-icon-text-download">
                <Image src={DownloadArrowBoxIcon} className="ecrp-b-lh-icon" />
                <div>Download</div>
              </div>
            </div>
            <div className="ecrp-b-left-transcript">
              {this.state.callTranscript.map((transcript, transIndex) => {
                return (
                  <div
                    className={`ecrp-b-l-lt-block ${
                      transcript.user !== "You"
                        ? "ecrp-b-l-lt-block-purple"
                        : ""
                    }`}
                    style={{
                      marginTop: transIndex === 0 ? "0rem" : "",
                    }}
                  >
                    <div className="ecrp-b-l-lt-block-header">
                      <div className="ecrp-b-l-lt-bh-name">
                        {transcript.user}
                      </div>
                      <div className="ecrp-b-l-lt-bh-date">
                        {moment(transcript.time).format("hh:mm A")}
                      </div>
                    </div>
                    <div className="ecrp-b-l-lt-block-message">
                      {transcript.message}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ecrp-block ecrp-block-center">
            <div className="ecrp-bc-title">
              {this.props.isPreviousCall ? "You had call with" : "On call with"}
            </div>
            <div className="ecrp-bc-items">
              <div className="ecrp-bc-user">
                <Image
                  src={this.state.allChats[0].image}
                  className="ecrp-bc-u-dp"
                />
                <div className="ecrp-bc-u-name">@smartestmoney_</div>
              </div>
              <div className="ecrp-bc-audio-call">
                <Image
                  src={AudioCallExpertsIcon}
                  className="ecrp-bc-audio-image"
                />
                <div className="ecrp-bc-audio-text">12:30</div>
              </div>
              {this.props.isPreviousCall ? (
                <div />
              ) : (
                <div className="ecrp-bc-audio-btns">
                  <div className="ecrp-bc-audio-mute-btn">
                    <Image
                      className="ecrp-bc-audio-mute-icon"
                      src={ExpertCallMuteMicIcon}
                    />
                  </div>
                  <div className="ecrp-bc-audio-call-cut-btn">
                    <Image
                      className="ecrp-bc-audio-phone-icon"
                      src={ExpertCallPhoneIcon}
                    />
                    <div className="ecrp-bc-audio-phone-text">Disconnect</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="ecrp-block ecrp-block-right">
            <div className="ecrp-b-right-header">
              <div />

              <div className="ecrp-b-rh-icon-text ecrp-b-rh-icon-text-transition">
                <Image src={ChatExpertsIcon} className="ecrp-b-rh-icon" />
                <div>Chat</div>
              </div>
            </div>
            <div className="ecrp-b-right-transcript">
              {this.state.allChats.map((transcript, transIndex) => {
                return (
                  <div
                    className={`ecrp-b-r-rt-block ${
                      transcript.user !== "You"
                        ? "ecrp-b-r-rt-block-purple"
                        : ""
                    }`}
                    style={{
                      marginTop: transIndex === 0 ? "0rem" : "",
                    }}
                  >
                    <Image
                      src={transcript.image}
                      className="ecrp-b-r-rt-block-dp"
                    />
                    <div className="ecrp-b-r-rt-block-message">
                      {transcript.message}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="ecrp-b-right-transcript-input-message">
              <div className="ecrp-b-right-transcript-input">
                <input
                  placeholder="Send a message here"
                  className="ecrp-b-right-transcript-input-box"
                />
                <Image
                  src={SendChatMessageIcon}
                  className="ecrp-b-right-transcript-input-icon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(ExpertCallContent);
