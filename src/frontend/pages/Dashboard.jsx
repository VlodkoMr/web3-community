import React from "react";
import { Container, InnerPageWrapper, Wrapper } from '../assets/css/common.style';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const Dashboard = () => (
  <InnerPageWrapper>
    <Header isInner={true} />

    <div
      id="home"
      className="relative h-[80px] bg-primary"
    >
    </div>

    <Wrapper>
      <Container>
        ...
      </Container>
    </Wrapper>

    <Footer />
  </InnerPageWrapper>
);
