import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import EmojiFilter from './EmojiFilter';
import EmojiLayout from './EmojiLayout';
import styles from './scss/Emoji.module.scss';

export default function EmojiMainPanel() {
  const [state, setState] = useState({
    loading: true,
    emojiList: [],
    categoryOptions: [],
    groupOptions: [],
    searchQuery: '',
    selectedCategory: '',
    selectedGroup: '',
  });

  const emojiListRef = useRef([]);
  const timeoutFn = useRef(() => {});

  const {
    loading, emojiList, categoryOptions, groupOptions,
    selectedCategory, selectedGroup, searchQuery,
  } = state;

  const getEmojiFromApi = useCallback((fieldName, value) => {
    setState((prevState) => ({
      ...prevState, loading: true,
    }));

    axios.get(`https://emojihub.yurace.pro/api/all${fieldName ? `/${fieldName}/${value}`.replace(/\s/g, '-') : ''}`)
      .then((respData) => {
        const { data } = respData;

        const categoryList = [];
        const groupObj = {};

        data.forEach((ele) => {
          if (!categoryList.includes(ele.category)) {
            categoryList.push(ele.category);
          }

          if (groupObj[ele.category] && !groupObj[ele.category].includes(ele.group)) {
            groupObj[ele.category].push(ele.group);
          } else if (!groupObj[ele.category]) {
            groupObj[ele.category] = [];
          }
        });
        emojiListRef.current = respData.data;
        setState((prevState) => ({
          ...prevState,
          loading: false,
          emojiList: respData.data,
          searchQuery: '',
          categoryOptions: prevState.categoryOptions.length > 0 ? prevState.categoryOptions : categoryList,
          groupOptions: fieldName === 'group' ? prevState.groupOptions : groupObj,
        }));
      });
  }, [])

  useEffect(() => {
    getEmojiFromApi();
  }, [getEmojiFromApi]);

  const handleSelectOnchange = useCallback((fieldName, value, anotherFieldName, anotherFieldVal) => {
    setState((prevState) => {
      let selectedVal = value;

      if (value === fieldName) {
        selectedVal = '';
      }

      return {
        ...prevState,
        [`selected${fieldName}`]: selectedVal,
      }
    });

    if (value === 'Group') {
      getEmojiFromApi(anotherFieldVal !== anotherFieldName ? anotherFieldName.toLowerCase() : '', anotherFieldVal === anotherFieldName ? '' : anotherFieldVal); 
    } else {
      getEmojiFromApi(value !== fieldName ? fieldName.toLowerCase() : '', value === fieldName ? '' : value);
    }

  }, [getEmojiFromApi]);

  const handleSearch = useCallback(({ target: { value } }) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
      searchQuery: value,
    }));

    clearTimeout(timeoutFn.current);

    timeoutFn.current = setTimeout(() => {
      if (value === '') {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          emojiList: emojiListRef.current,
        }));
      } else {
        const filteredEmojis = emojiListRef.current.filter(({ name, htmlCode, unicode }) => {
          let compVal = name;
          let searchVal = value;

          if (value.startsWith('&#')) {
            compVal = htmlCode[0];
          } else if (value.startsWith('U+')) {
            compVal = unicode[0];
          } else {
            searchVal = value.toLowerCase();
          }

          return compVal.includes(searchVal);
        });
  
        setState((prevState) => ({
          ...prevState,
          loading: false,
          emojiList: filteredEmojis,
        }));
      }
    }, 2000);
  }, []);

  return (
    <div>
      <EmojiFilter
        categoryOptions={categoryOptions}
        groupOptions={groupOptions}
        selectedCategory={selectedCategory}
        selectedGroup={selectedGroup}
        handleSelectOnchange={handleSelectOnchange}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
      />
      {loading
        ? (
          <div className={styles.loader}>Loading...</div>
        ) : (
          <>
            {emojiList.length > 0
              ? (
                <EmojiLayout emojiList={emojiList} />
              ) : (
                <div className={styles.loader}>No results for {searchQuery}</div>
              )}
          
          </>
        )}
    </div>
  );
}
