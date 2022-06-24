import React, { useEffect } from "react";
import ilo from "../../assets/images/iloli.gif";
import "./index.scss";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { updateSearch } from "../../store/Search/actioncreators";
const SearchForm = (props) => {
  /**
   * useEffect区
   */

  /**
   * 函数区
   */
  const handleCancelSearch = () => {
    props.updateSerach({ type: 0 });
  };
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      const value = e.target.value;
      handleCancelSearch();
      props.history.push(`/search/${value}`);
    }
  };
  return (
    <div id={"SearchForm"}>
      <div className="form">
        <h2>想要找点什么呢?</h2>
        <div className="form-region">
          <span className={"iconfont icon-sousuo1"}></span>
          <input type="text" placeholder="搜索" onKeyDown={handleSearch} />
        </div>
        <img src={ilo} alt="" className={"gifimg"} />
        <div className="sign" onClick={handleCancelSearch}>
          <div className="sign-region">
            <i className={"i1"}></i>
            <i className={"i2"}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(
  (state) => ({
    search: state.search,
  }),
  {
    updateSerach: updateSearch,
  }
)(withRouter(SearchForm));
