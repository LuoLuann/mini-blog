import { useState, useEffect, useReducer } from 'react';
import { db } from '../firebase/config'
import { doc, deleteDoc } from 'firebase/firestore';

// um estado inicial para o reducer, que será usado para trabalharmos outra forma de
// fazermos loading e erros
const initialState = {
    loading: null,
    error: null
}
// o reducer aceita o estado e ação que queremos executar
const deleteReducer = (state, action) => {
    // aqui teremos uma checagem do tipo da ação
    switch(action.type) {
        case "LOADING":
            return {loading: true, error: null}
        case "DELETED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state;
    }
}
// aqui passamos uma colecao que pode ser qualquer uma, n necessariamente
// um post
export const useDeleteDocument = (docCollection) => {

    // criando o reducer em si para iniciar o hook
    // que passa a função que vai tratar do reducer e o estado inicial
    const [response, dispatch] = useReducer(deleteReducer, initialState)

    // deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    // funcao para ver se precisa continuar ou não com o hook
    const checkCancelBeforeDispatch = (action) => {
        if(!cancelled) {
            dispatch(action)
        }
    }

    const deleteDocument = async(id) => {

         // colocando o dispatch para fazer o reducer funcionar
         checkCancelBeforeDispatch({
            type: "LOADING"
        })

        try {
            const deleteDocument = await deleteDoc(doc(db, docCollection, id))
             // colocando o dispatch para fazer o reducer funcionar
             checkCancelBeforeDispatch({
                type: "DELETED_DOC",
                payload: deleteDocument,
            })
        } catch (error) {
            // colocando o dispatch para fazer o reducer funcionar
            checkCancelBeforeDispatch({
                type: "ERROR",
                payload: error.message
            })
        }
    }
    // para evitar lixo de memoria para encerrar o componente
    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    return {
        deleteDocument,
        response
    }
}

