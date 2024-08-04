import React from 'react';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderMenuButton,
  HeaderGlobalBar,
  SkipToContent,
  Theme
} from '@carbon/react';

export default function TopHeader () {
  return (
    <Theme theme="g100">
    <HeaderContainer
        render={() => (
        <Header aria-label="Crypto Asset Discovery">
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
            />
            <HeaderName href="/" prefix=" ">
              Crypto Asset Discovery
            </HeaderName>
            <HeaderGlobalBar />
        </Header>
        )}
    />
    </Theme>
  );
}
