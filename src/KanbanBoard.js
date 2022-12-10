/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import KanbanColumn from './KanbanColumn';
import { useState } from 'react';

const kanbanBoardStyles = css`
  flex: 10;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 1rem 1rem;
`;

const BG_COLOR_TODO = '#C9AF97';
const BG_COLOR_ONGOING = '#FFE799';
const BG_COLOR_DONE = '#C0E8BA';

export const COLUMN_KEY_TODO = 'todo';
export const COLUMN_KEY_ONGOING = 'ongoing';
export const COLUMN_KEY_DONE = 'done';

export default function KanbanBoard({ todoList, ongoingList, doneList, onAdd, onRemove }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  const handleDrop = (evt) => {
    if (!draggedItem || !dragSource || !dragTarget || dragSource === dragTarget) {
      return;
    }

    dragSource && onRemove(dragSource, draggedItem);
    dragTarget && onAdd(dragTarget, draggedItem);
  };

  return (
    <main css={kanbanBoardStyles}>
      <KanbanColumn
        onAdd={(newCard) => onAdd(COLUMN_KEY_TODO, newCard)}
        setIsDragSource={(isSrc) => {
          setDragSource(isSrc ? COLUMN_KEY_TODO : null);
        }}
        setIsDragTarget={(isSrc) => {
          setDragTarget(isSrc ? COLUMN_KEY_TODO : null);
        }}
        onDrop={handleDrop}
        className="column-todo"
        title="待处理"
        bgColor={BG_COLOR_TODO}
        cardList={todoList}
        setDraggedItem={setDraggedItem}
        canAddNew={true}
        onRemove={onRemove.bind(null, COLUMN_KEY_TODO)}
      ></KanbanColumn>

      <KanbanColumn
        setIsDragSource={(isSrc) => {
          setDragSource(isSrc ? COLUMN_KEY_ONGOING : null);
        }}
        setIsDragTarget={(isSrc) => {
          setDragTarget(isSrc ? COLUMN_KEY_ONGOING : null);
        }}
        onDrop={handleDrop}
        className="column-ongoing"
        title="进行中"
        bgColor={BG_COLOR_ONGOING}
        cardList={ongoingList}
        setDraggedItem={setDraggedItem}
        onRemove={onRemove.bind(null, COLUMN_KEY_ONGOING)}
      ></KanbanColumn>
      <KanbanColumn
        setIsDragSource={(isSrc) => {
          setDragSource(isSrc ? COLUMN_KEY_DONE : null);
        }}
        setIsDragTarget={(isSrc) => {
          setDragTarget(isSrc ? COLUMN_KEY_DONE : null);
        }}
        onDrop={handleDrop}
        className="column-done"
        title="已完成"
        bgColor={BG_COLOR_DONE}
        cardList={doneList}
        setDraggedItem={setDraggedItem}
        onRemove={onRemove.bind(null, COLUMN_KEY_DONE)}
      ></KanbanColumn>
    </main>
  );
}
