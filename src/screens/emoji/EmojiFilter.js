import React from 'react';
import styles from './scss/Emoji.module.scss';

export default function EmojiFilter({
  categoryOptions, groupOptions, selectedCategory, handleSelectOnchange,
  selectedGroup, handleSearch, searchQuery,
}) {
  return (
    <div className={styles.emojiFilterWrapper}>
      <div>
        <select onChange={(e) => handleSelectOnchange('Category', e.target.value, 'Group', selectedGroup)} value={selectedCategory}>
          <option>Category</option>
          {categoryOptions.map((ele, idx) => (
            <option key={`${idx * 1}_cat`}>{ele}</option>
          ))}
        </select>
        <select onChange={(e) => handleSelectOnchange('Group', e.target.value, 'Category', selectedCategory)} value={selectedGroup}>
          <option>Group</option>
          {(groupOptions[selectedCategory] || []).map((ele, idx) => (
            <option key={`${idx * 1}_grp`}>{ele}</option>
          ))}
        </select>
      </div>
      <div>
        <input
          placeholder="Search"
          type="text"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}
