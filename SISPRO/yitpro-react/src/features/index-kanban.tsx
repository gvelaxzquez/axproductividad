import 'antd/dist/reset.css';
import ReactDOM from 'react-dom/client';
import KanbanBoard from '../components/KanbanBoard';


const rootkanban = ReactDOM.createRoot(document.getElementById('kanban'));
rootkanban.render(<KanbanBoard />);