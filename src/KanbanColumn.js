/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

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
  children,
  bgColor,
  title,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDrop,
}) {
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
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
}
