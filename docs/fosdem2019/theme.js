import {book} from 'mdx-deck/themes';

export default {
  ...book,
  css: {
    ...book.css,
    'strong, .affix': {
      color: '#c65146'
    }
  },
  colors: {
    background: 'F5F5F5',
    link: '#c65146',
    text: '#363636'
  },
  font: 'Bitter, sans-serif',
  heading: {
    fontWeight: 900,
    fontFamily: 'Muli, sans-serif'
  }
}
