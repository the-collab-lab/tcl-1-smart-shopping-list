import React from 'react';
import { ContentWrapper, Footer, Header, PageWrapper } from '../../components';

const ItemDetail = () => {
  return (
    <PageWrapper>
      <Header showBackLink={true} />
      <ContentWrapper>
        this is the item detail page, I know you selected a specific item, but
        we're not there yet. BUT this page **does** have a back button.
      </ContentWrapper>
      <Footer />
    </PageWrapper>
  );
};

export default ItemDetail;
