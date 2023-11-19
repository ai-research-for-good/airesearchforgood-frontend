import Preloader from "@/components/common/Preloader";
import Footer3 from "@/components/footer/Footer3";
import PopularPost from "@/components/home3/PopularPost";
import Topbar from "@/components/home3/Topbar";
import CommonHeader from "@/components/layout/CommonHeader";
import PostState from "@/context/post/PostState";
import TeamState from "@/context/team/TeamState";
import React, { useEffect, useReducer, useState } from "react";
const initalState = {
  isRightSidebarOpen: false,
  isleftSidebarOpen: false,
  isModal: false,
  activeMenu: "",
  activeSubMenu: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_RIGHT_SIDEBAR":
      return {
        ...state,
        isRightSidebarOpen: !state.isRightSidebarOpen,
      };
    case "TOGGLE_LEFT_SIDEBAR":
      return {
        ...state,
        isleftSidebarOpen: !state.isleftSidebarOpen,
      };
    case "TOGGLE_SEARCH_MODAL":
      return {
        ...state,
        isModal: !state.isModal,
      };
    case "SET_SCROllY":
      return { ...state, scrollY: action.payload };
    case "TOGGLE_MENU":
      return {
        ...state,

        activeMenu: state.activeMenu === action.menu ? "" : action.menu,
        activeSubMenu:
          state.activeMenu === action.menu ? state.activeSubMenu : "",
      };
    case "TOGGLE_SUB_MENU":
      return {
        ...state,
        activeSubMenu:
          state.activeSubMenu === action.subMenu ? "" : action.subMenu,
      };
    case "TOGGLE_SIDEBAR_MENU":
      return {
        ...state,
        isSidebarOpenMenu: !state.isSidebarOpenMenu,
      };
    default:
      return state;
  }
}

function Homepage() {
  const [state, dispatch] = useReducer(reducer, initalState);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      setLoading(true);
    }, 3000);
  }, []);

  return (
    <>
      {loading ? (
        <TeamState>
          <PostState>
            <Topbar />
            <CommonHeader state={state} dispatch={dispatch} />
            <PopularPost />
            <Footer3 />
          </PostState>
        </TeamState>
      ) : (
        <Preloader />
      )}
    </>
  );
}

export default Homepage;
