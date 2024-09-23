import React from 'react';
import styles from './scss/Emoji.module.scss';

export default function EmojiLayout({ emojiList }) {
  return (
    <div className={styles.emojiWrapper}>
      {emojiList.map((ele) => {
        const codePoint = parseInt(ele.htmlCode[0].replace('&#', '').replace(';', ''), 10);
        
        return (
          <span key={ele.htmlCode[0]}>
            {Number.isInteger(codePoint) ? String.fromCodePoint(codePoint) : 'Invalid Code'}
          </span>
        );
      })}
    </div>
  );
}
