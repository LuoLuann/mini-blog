import { useState, useEffect, useReducer } from 'react';
import { db } from '../firebase/config'
import { updateDoc, doc } from 'firebase/firestore';

// um estado inicial para o reducer, que será usado para trabalharmos outra forma de
// fazermos loading e erros
const initialState = {
    loading: null,
    error: null
}
// o reducer aceita o estado e ação que queremos executar
const updateReducer = (state, action) => {
    // aqui teremos uma checagem do tipo da ação
    switch(action.type) {
        case "LOADING":
            return {loading: true, error: null}
        case "UPDATED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state;
    }
}
// aqui passamos uma colecao que pode ser qualquer uma, n necessariamente
// um post
export const useUpdateDocument = (docCollection) => {

    // criando o reducer em si para iniciar o hook
    // que passa a função que vai tratar do reducer e o estado inicial
    const [response, dispatch] = useReducer(updateReducer, initialState)

    // deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    // funcao para ver se precisa continuar ou não com o hook
    const checkCancelBeforeDispatch = (action) => {
        if(!cancelled) {
            dispatch(action)
        }
    }

    const updateDocument = async(id, data) => {
        // colocando o dispatch para fazer o reducer funcionar
        checkCancelBeforeDispatch({
            type: "LOADING"
        })

        try {

            const docRef = await doc(db, docCollection, id)

            const updatedDocument = await updateDoc(docRef, data)

             // colocando o dispatch para fazer o reducer funcionar
            checkCancelBeforeDispatch({
                type: "UPDATED_DOC",
                payload: updateDocument
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
        updateDocument,
        response
    }
}

