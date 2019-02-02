import React from 'react';
import {book} from 'mdx-deck/themes';
import darcula from 'react-syntax-highlighter/styles/prism/darcula';

function Provider({children}) {
  return children;
}

export default {
  ...book,
  css: {
    ...book.css,
    'strong, .affix': {
      color: '#C65146'
    },
    'blockquote > p': {
      fontStyle: 'italic'
    },
    'pre': {
      padding: '0.5em !important',
      lineHeight: 'normal !important'
    },
    'pre > code': {
      fontSize: '0.8em',
      lineHeight: 'normal !important'
    },
    '.very-small': {
      fontSize: '0.5em'
    }
  },
  colors: {
    background: 'F5F5F5',
    link: '#C65146',
    text: '#363636',
    codeBackground: '#f5f5f5',
    code: '#C65146'
  },
  font: 'Bitter, sans-serif',
  heading: {
    fontWeight: 900,
    fontFamily: 'Muli, sans-serif'
  },
  prism: {
    style: darcula
  },
  Provider
}
