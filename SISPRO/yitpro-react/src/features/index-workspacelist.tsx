import 'antd/dist/reset.css';
import ReactDOM from 'react-dom/client';
import WorkspaceList from '../components/WorkspaceList';


const rootwsl = ReactDOM.createRoot(document.getElementById('workspacelist'));
rootwsl.render(<WorkspaceList />);