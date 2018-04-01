import React from "react";
import PropTypes from "prop-types";

import Main from "../components/Main";
import Article from "../components/Main/Article";
import PageHeader from "../components/Page/PageHeader";

const NotFoundPage = props => {
    const { data } = props;
  
    return (
      <Main>
        <Article>
          <PageHeader title="404 Not Found" />
          Sorry the content, you were looking for is not avaliable.
        </Article>
      </Main>
    );
  };

  export default NotFoundPage;