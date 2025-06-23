import React from 'react';
import ReactDOM from 'react-dom/client';
import Kanban from './components/kanban';
import 'antd/dist/reset.css';


const rootkanban = ReactDOM.createRoot(document.getElementById('kanban'));
rootkanban.render(<Kanban />);