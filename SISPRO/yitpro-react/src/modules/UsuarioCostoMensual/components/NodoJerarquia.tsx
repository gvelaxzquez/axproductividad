// src/components/usuarioCosto/NodoJerarquia.tsx
import React from 'react';
import type { UsuarioCosto } from '../../../model/UsuarioCostoMensual.model';
import UsuarioCard from './UsuarioCard';
interface UsuarioNodo extends UsuarioCosto {
    hijos?: UsuarioNodo[];
}

interface Props {
    nodo: UsuarioNodo;
    vistaAnalitica: boolean;
}

const NodoJerarquia: React.FC<Props> = ({ nodo, vistaAnalitica }) => {
    const tieneNietos = nodo.hijos?.some((h) => h.hijos && h.hijos.length > 0);
    const hijos = nodo.hijos ?? [];

    return (
        <div className="nodo">
            <div className="nodo-card">
                <UsuarioCard usuario={nodo} vistaAnalitica={vistaAnalitica} />
            </div>

            {hijos.length > 0 && (
                <div className={`nodo-hijos ${!tieneNietos ? 'nodo-hijos-final' : ''}`}>
                    {hijos.map((hijo) => (
                        <NodoJerarquia key={hijo.idUsuario} nodo={hijo} vistaAnalitica={vistaAnalitica} />
                    ))}
                </div>
            )}
        </div>
    );
};
export default NodoJerarquia;
