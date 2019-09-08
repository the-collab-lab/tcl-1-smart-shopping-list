import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const StyledPageWrapper = styled.main`
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: stretch;
  height: 100vh;
`;

const PageWrapper = ({ children }) => (
  <StyledPageWrapper className="page-wrapper">{children}</StyledPageWrapper>
);

export default PageWrapper;

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
PageWrapper.defaultProps = {};
