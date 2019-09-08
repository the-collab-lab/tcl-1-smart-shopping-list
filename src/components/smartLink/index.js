import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
  pointer-events: ${props =>
    props.visualstate === 'disabled' ? 'none' : 'auto'};
  cursor: ${props =>
    props.visualstate === 'disabled' ? 'not-allowed' : 'auto'};
  visibility: ${props =>
    props.visualstate === 'hidden' ? 'hidden' : 'visible'};
`;

const SmartAnchor = ({ className, children, routeTo, visualstate }) => (
  <a
    className={className}
    href={routeTo}
    target="_blank"
    visualstate={visualstate}
  >
    {children}
  </a>
);

const StyledAnchor = styled(SmartAnchor)`
  pointer-events: ${props =>
    props.visualstate === 'disabled' ? 'none' : 'auto'};
  cursor: ${props =>
    props.visualstate === 'disabled' ? 'not-allowed' : 'auto'};
  visibility: ${props =>
    props.visualstate === 'hidden' ? 'hidden' : 'visible'};
`;

const SmartLink = ({ className, children, onClick, routeTo, visualState }) => {
  const isExternalLink = routeTo.indexOf('http') !== -1;

  return isExternalLink ? (
    <StyledAnchor
      className={className}
      routeTo={routeTo}
      target="_blank"
      visualstate={visualState}
    >
      {children}
    </StyledAnchor>
  ) : (
    <StyledLink
      className={className}
      to={routeTo}
      onClick={onClick}
      visualstate={visualState}
    >
      {children}
    </StyledLink>
  );
};

export default SmartLink;

SmartLink.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  visualState: PropTypes.oneOf(['default', 'disabled', 'hidden']),
  routeTo: PropTypes.string,
};

SmartLink.defaultProps = {
  visualState: 'default',
  routeTo: '/',
};
