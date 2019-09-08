import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const StyledContentWrapper = styled.section`
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: stretch;
  flex-grow: 1;
  padding: 20px;
`;

const ContentWrapper = ({ children }) => (
  <StyledContentWrapper>{children}</StyledContentWrapper>
);

export default ContentWrapper;

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
ContentWrapper.defaultProps = {};
