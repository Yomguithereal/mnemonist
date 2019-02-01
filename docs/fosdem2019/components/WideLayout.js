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

const OtherRoot = styled.div([], {
  width: '80%',
  fontSize: '0.8em'
});

export function WideLayoutWithSmallCode({children}) {
  return (
    <OtherRoot>
      {children}
    </OtherRoot>
  );
}
