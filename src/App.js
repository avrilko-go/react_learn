import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import KanbanCard from './KanbanCard';
import KanbanNewCard from './KanbanNewCard';
import KanbanColumn from './KanbanColumn';

const COLUMN_KEY_TODO = 'todo';
const COLUMN_KEY_ONGOING = 'ongoing';
const COLUMN_KEY_DONE = 'done';

const BG_COLOR_TODO = '#C9AF97';
const BG_COLOR_ONGOING = '#FFE799';
const BG_COLOR_DONE = '#C0E8BA';

function App() {
  const [todoList, setTodoList] = useState([{ title: '开发任务-1', status: '2022-12-07 22:41' }]);
  const [ongoingList, setOngoingList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  const handleAdd = () => {
    setShowAdd(true);
  };

  const handleSubmit = (title) => {
    setTodoList((currentTodoList) => [
      { title, status: new Date().toDateString() + new Date().toLocaleTimeString() },
      ...currentTodoList,
    ]);
    setShowAdd(false);
  };

  const todoTitle = (
    <>
      待处理
      <button disabled={showAdd} onClick={handleAdd}>
        &#8853; 添加新卡片
      </button>
    </>
  );

  const handleDrop = (evt) => {
    if (!draggedItem || !dragSource || !dragTarget || dragSource === dragTarget) {
      return;
    }

    const updaters = {
      [COLUMN_KEY_TODO]: setTodoList,
      [COLUMN_KEY_ONGOING]: setOngoingList,
      [COLUMN_KEY_DONE]: setDoneList,
    };

    if (dragSource) {
      updaters[dragSource]((currentStat) =>
        currentStat.filter((item) => !Object.is(item, draggedItem)),
      );
    }
    if (dragTarget) {
      updaters[dragTarget]((currentStat) => [draggedItem, ...currentStat]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        <KanbanColumn
          setIsDragSource={(isSrc) => {
            setDragSource(isSrc ? COLUMN_KEY_TODO : null);
          }}
          setIsDragTarget={(isSrc) => {
            setDragTarget(isSrc ? COLUMN_KEY_TODO : null);
          }}
          onDrop={handleDrop}
          className="column-todo"
          title={todoTitle}
          bgColor={BG_COLOR_TODO}
        >
          {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
          {todoList.map((props) => (
            <KanbanCard
              onDragStart={() => {
                setDraggedItem(props);
              }}
              key={props.title}
              {...props}
            />
          ))}
        </KanbanColumn>

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
        >
          {ongoingList.map((props) => (
            <KanbanCard
              onDragStart={() => {
                setDraggedItem(props);
              }}
              key={props.title}
              {...props}
            />
          ))}
        </KanbanColumn>
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
        >
          {doneList.map((props) => (
            <KanbanCard
              onDragStart={() => {
                setDraggedItem(props);
              }}
              key={props.title}
              {...props}
            />
          ))}
        </KanbanColumn>
      </KanbanBoard>
    </div>
  );
}

export default App;
