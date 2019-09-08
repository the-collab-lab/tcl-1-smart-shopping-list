import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import SmartLink from '../smartLink';

const StyledHeader = styled.header`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-self: flex-start;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  padding: 10px 20px;
  background-color: #eee;
`;

const StyledH1 = styled.h1`
  padding: 0;
  margin: 0;
`;

const Header = ({ showBackLink, whichRoute }) => (
  <StyledHeader className="header">
    <SmartLink
      className="back-link"
      routeTo={whichRoute}
      visualState={showBackLink ? 'default' : 'hidden'}
    >
      Go Back
    </SmartLink>
    <SmartLink className="title-link">
      <StyledH1>iNeedToBuy</StyledH1>
    </SmartLink>
    <SmartLink className="example-link" routeTo="http://app.ineedtobuy.xyz/">
      See Example
    </SmartLink>
  </StyledHeader>
);

export default Header;

Header.propTypes = {
  showBackLink: PropTypes.bool,
  whichRoute: PropTypes.string,
};

Header.defaultProps = {
  showBackLink: false,
  whichRoute: '/',
};
