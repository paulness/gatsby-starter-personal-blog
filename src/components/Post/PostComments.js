import React from "react";
import PropTypes from "prop-types";
import injectSheet from "react-jss";
require("core-js/fn/array/find");

import config from "../../../content/meta/config";

const styles = theme => ({
  postComments: {
    margin: "3em 0 0",
    padding: "3em 0 0",
    borderTop: "1px solid #ddd"
  }
});

class PostComments extends React.Component {
  componentDidMount() {
    const scriptElem = document.createElement("script");
    scriptElem.type = "text/javascript";
    scriptElem.setAttribute("data-isso", "https://comments.paulness.com/");
    scriptElem.setAttribute("data-isso-css", "true");
    scriptElem.setAttribute("src", "https://comments.paulness.com/js/embed.min.js");
    scriptElem.async = true;

    const sectionElem = document.createElement("section");
    sectionElem.id = "isso-thread";
    this.instance.appendChild(scriptElem);
    this.instance.appendChild(sectionElem);
  }

  render() {
    const { classes, post, slug } = this.props;

    return (
      <div id="post-comments" className={classes.postComments} ref={el => (this.instance = el)} />
    );
  }
}

PostComments.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired
};

export default injectSheet(styles)(PostComments);
