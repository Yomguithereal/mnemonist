import React from 'react';
import components from 'mdx-deck/dist/components';

export default function MainTitle() {

  return (
    <components.h1 style={{textDecoration: 'underline'}}>
      Developing<br />data structures<br />for JavaScript
    </components.h1>
  );
};

export function MainTitleBis() {

  return (
    <components.h2 style={{textDecoration: 'underline'}}>
      Developing<br />data structures<br />for really any high-level interpreted language but with definitely a tight focus on JavaScript
    </components.h2>
  );
};
