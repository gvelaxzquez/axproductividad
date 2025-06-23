import React from 'react';
import ReactDOM from 'react-dom/client';
import WorkspaceList from './components/WorkspaceList';
import 'antd/dist/reset.css';


const rootwsl = ReactDOM.createRoot(document.getElementById('workspacelist'));
rootwsl.render(<WorkspaceList />);