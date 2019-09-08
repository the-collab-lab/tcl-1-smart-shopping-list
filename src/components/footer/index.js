import React from 'react';
import styled from '@emotion/styled';

import SmartLink from '../smartLink';

const StyledFooter = styled.footer`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  justify-content: space-evenly;
  width: 100vw;
  padding: 10px 20px;
  background-color: #eee;
`;

const Footer = () => (
  <StyledFooter className="footer">
    <SmartLink className="list-link">My List</SmartLink>
    <SmartLink className="add-link" routeTo="/add-item">
      Add Item
    </SmartLink>
  </StyledFooter>
);

export default Footer;

Footer.propTypes = {};
Footer.defaultProps = {};
