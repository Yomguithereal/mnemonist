import React from 'react';
import styled from 'styled-components';

const Root = styled.div([], {
  width: '80%'
});

export default function WideLayout({children}) {
  return (
    <Root>
      {children}
    </Root>
  );
}
