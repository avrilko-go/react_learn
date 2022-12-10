/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

export const kanbanCardStyles = css`
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid gray;
  border-radius: 1rem;
  list-style: none;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: left;
`;

export const kanbanCardTitleStyles = css`
  min-height: 3rem;
  & > input[type='text'] {
    width: 80%;
  }
`;

export default function KanbanCard({ title, status, onDragStart }) {
  const [displayTime, setDisplayTime] = useState(status);

  useEffect(() => {
    const updateDisplayTime = () => {
      const timePassed = new Date() - new Date(status);
      let relativeTime = '刚刚';
      if (MINUTE <= timePassed && timePassed < HOUR) {
        relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
      } else if (HOUR <= timePassed && timePassed < DAY) {
        relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
      } else if (DAY <= timePassed) {
        relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
      }
      setDisplayTime(relativeTime);
    };

    updateDisplayTime();

    const intervalId = setInterval(updateDisplayTime, UPDATE_INTERVAL);

    return function cleanup() {
      clearInterval(intervalId);
    };
  }, [status]);

  const handleDragStart = (evt) => {
    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setData('text/plain', title);
    onDragStart && onDragStart(evt);
  };

  return (
    <li draggable={true} onDragStart={handleDragStart} css={kanbanCardStyles}>
      <div css={kanbanCardTitleStyles}>{title}</div>
      <div
        css={css`
          text-align: right;
          font-size: 0.8rem;
          color: #333;
        `}
      >
        {displayTime}
      </div>
    </li>
  );
}
