import React, { useState } from 'react';
import Head from 'next/head';
import { GlobalStyle } from '../../styles';
import {
  Container,
  LayoutHeader,
  Main,
  Nav,
} from './layout.css';

interface Props {
  children: any;
}

const Layout = ({ children }: Props): JSX.Element => {
  const [navRevealed, setNavRevealed] = useState<boolean>(false);
  const setBodyOverflow = (overflow: boolean): void => {
    document.body.style.overflow = overflow ? 'auto' : 'hidden';
  }
  const toggleNav = (): void => {
    setNavRevealed(!navRevealed);
    setBodyOverflow(!!navRevealed);
  };
  const dismissNav = (): void => {
    setNavRevealed(false);
    setBodyOverflow(false);
  };

  return (
    <>
      <Head>
        <title>
          Cinematt 1.0.0
        </title>
        <meta
          name="description"
          content="Personal photography website of Matt Finucane"
        />
        <meta
          name="author"
          content="Matt Finucane"
        />
      </Head>
      <Container>
        <LayoutHeader
          onMenuButtonClick={toggleNav}
          navRevealed={navRevealed}
        />
        <Nav onNavigate={dismissNav} isRevealed={navRevealed} />
        <Main>
          {children}
        </Main>
      </Container>
      <GlobalStyle />
    </>
  );
};

export default Layout;
