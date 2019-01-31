import {book} from 'mdx-deck/themes';

export default {
  ...book,
  css: {
    ...book.css,
    'strong, .affix': {
      color: '#C65146'
    },
    'blockquote > p': {
      fontStyle: 'italic'
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
  }
}
