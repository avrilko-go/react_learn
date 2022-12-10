/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { kanbanCardStyles, kanbanCardTitleStyles } from './KanbanCard';

export default function KanbanNewCard({ onSubmit }) {
  const [title, setTitle] = useState('');

  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };

  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      onSubmit(title);
    }
  };

  const inputElem = useRef(null);

  useEffect(() => {
    inputElem.current.focus();
  }, []);

  return (
    <li css={kanbanCardStyles}>
      <h3>添加新卡片</h3>
      <div css={kanbanCardTitleStyles}>
        <input
          type="text"
          ref={inputElem}
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </li>
  );
}
