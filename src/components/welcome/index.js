import React from 'react';
import { Link } from 'react-router-dom'
import styled from '@emotion/styled';

const StyledWelcome = styled.footer`
  display: flex;
  flex-direction: column;
  align-self: center;
  text-align: center;
  width: 50vw;
  padding: 10px 20px;
  position: fixed;
  margin-top: 20%;
`;

const Welcome = () => (
  <StyledWelcome className="footer">
    <section>
      <p>No purchases just yet.</p>
      <Link to="/add-item">
        Add Item
      </Link>
    </section>
  </StyledWelcome>
);

export default Welcome;
