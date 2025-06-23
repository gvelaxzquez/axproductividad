import React from 'react';
import ReactDOM from 'react-dom/client';
import Workspace from './modules/Workspace';
import 'antd/dist/reset.css';


const rootws = ReactDOM.createRoot(document.getElementById('workspace'));
rootws.render(<Workspace />);