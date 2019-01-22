import React from 'react';
import components from 'mdx-deck/dist/components';

export default function Title({affix, children}) {

  return (
    <components.h2><span className="affix">{affix}</span> {children}</components.h2>
  );
};
