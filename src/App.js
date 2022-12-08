import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

const KanbanCard = ({ title, status, onDragStart }) => {
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
    <li draggable={true} onDragStart={handleDragStart} className="kanban-card">
      <div className="card-title">{title}</div>
      <div className="card-status">{displayTime}</div>
    </li>
  );
};

const KanbanNewCard = ({ onSubmit }) => {
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
    <li className="kanban-card">
      <h3>添加新卡片</h3>
      <div className="card-title">
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
};

const KanbanBoard = ({ children }) => {
  return <main className="kanban-board">{children}</main>;
};

const KanbanColumn = ({
  children,
  className,
  title,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDrop,
}) => {
  const combinedClassName = `kanban-column ${className}`;
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
      className={combinedClassName}
    >
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
};

const COLUMN_KEY_TODO = 'todo';
const COLUMN_KEY_ONGOING = 'ongoing';
const COLUMN_KEY_DONE = 'done';

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
        >
          {ongoingList.map((props) => (
            <KanbanCard key={props.title} {...props} />
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
        >
          {doneList.map((props) => (
            <KanbanCard key={props.title} {...props} />
          ))}
        </KanbanColumn>
      </KanbanBoard>
    </div>
  );
}

export default App;
