import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const KanbanCard = ({ title, status }) => {
  return (
    <li className="kanban-card">
      <div className="card-title">{title}</div>
      <div className="card-status">{status}</div>
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

  return (
    <li className="kanban-card">
      <h3>添加新卡片</h3>
      <div className="card-title">
        <input type="text" value={title} onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </li>
  );
};

const KanbanBoard = ({ children }) => {
  return <main className="kanban-board">{children}</main>;
};

const KanbanColumn = ({ children, className, title }) => {
  const combinedClassName = `kanban-column ${className}`;
  return (
    <section className={combinedClassName}>
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
};

function App() {
  const [todoList, setTodoList] = useState([
    { title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' },
    { title: '开发任务-5', status: '22-05-22 18:15' },
    { title: '测试任务-3', status: '22-05-22 18:15' },
  ]);

  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    setShowAdd(true);
  };

  const handleSubmit = (title) => {
    setTodoList((currentTodoList) => [
      { title, status: new Date().toDateString() },
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        <KanbanColumn className="column-todo" title={todoTitle}>
          {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
          {todoList.map((props) => (
            <KanbanCard key={props.title} {...props} />
          ))}
        </KanbanColumn>
        <section className="kanban-column column-ongoing">
          <h2>进行中</h2>
        </section>
        <section className="kanban-column column-done">
          <h2>已完成</h2>
        </section>
      </KanbanBoard>
    </div>
  );
}

export default App;
