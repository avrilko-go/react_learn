/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import KanbanCard from './KanbanCard';
import { useState } from 'react';
import KanbanNewCard from './KanbanNewCard';

const kanbanColumnStyles = css`
  flex: 1 1;
  border: 1px solid gray;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  & > h2 {
    margin: 0.6rem 1rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid gray;
    & > button {
      float: right;
      margin-top: 0.2rem;
      padding: 0.2rem 0.5rem;
      border: 0;
      border-radius: 1rem;
      height: 1.8rem;
      line-height: 1rem;
      font-size: 1rem;
    }
  }

  & > ul {
    flex: 1;
    flex-basis: 0;
    margin: 1rem;
    padding: 0;
    overflow: auto;
  }
`;

export default function KanbanColumn({
  onAdd,
  canAddNew = false,
  cardList,
  bgColor,
  title,
  setDraggedItem,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDrop,
  onRemove,
}) {
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    setShowAdd(true);
  };

  const handleSubmit = (newCard) => {
    onAdd && onAdd(newCard);
    setShowAdd(false);
  };

  return (
    <section
      onDragStart={() => {
        setIsDragSource(true);
      }}
      onDragOver={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.effectAllowed = 'move';
        setIsDragTarget(true);
      }}
      onDragLeave={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.effectAllowed = 'none';
        setIsDragTarget(false);
      }}
      onDrop={(evt) => {
        evt.preventDefault();
        onDrop && onDrop(evt);
      }}
      onDragEnd={(evt) => {
        evt.preventDefault();
        setIsDragTarget(false);
        setIsDragSource(false);
      }}
      css={css`
        background-color: ${bgColor};
        ${kanbanColumnStyles}
      `}
    >
      <h2>
        {title}
        {canAddNew && (
          <button disabled={showAdd} onClick={handleAdd}>
            &#8853; 添加新卡片
          </button>
        )}
      </h2>
      <ul>
        {canAddNew && showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
        {cardList.map((props) => (
          <KanbanCard
            key={props.title}
            onDragStart={() => setDraggedItem && setDraggedItem(props)}
            {...props}
            onRemove={onRemove}
          ></KanbanCard>
        ))}
      </ul>
    </section>
  );
}
