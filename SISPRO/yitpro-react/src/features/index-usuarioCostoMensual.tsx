import 'antd/dist/reset.css';
import ReactDOM from 'react-dom/client';
import UsuarioCostoMensual from '../modules/UsuarioCostoMensual/components/UsuarioCostoMensual.index';


const root = document.getElementById('usuarioCostoMensual-root');
const proyectos = JSON.parse(root?.getAttribute('data-proyectos') || '[]');
const rootusuarioCostoMensual = ReactDOM.createRoot(root);

rootusuarioCostoMensual.render(<UsuarioCostoMensual proyectos={proyectos} />);