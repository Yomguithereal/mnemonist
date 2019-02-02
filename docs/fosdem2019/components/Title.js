import React from 'react';
import components from 'mdx-deck/dist/components';

export default function Title({affix, level = 2, children}) {

  let H = components.h2;

  if (level === 3)
    H = components.h3;

  return (
    <H><span className="affix">•</span> {children}</H>
  );
};
