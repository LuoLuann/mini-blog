import { useState, useEffect, useReducer } from 'react';
import { db } from '../firebase/config'

// collection pq eh no sql, addDoc eh para fazer insert no banco
// timestamp eh para ter a horaque foi criado
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// um estado inicial para o reducer, que será usado para trabalharmos outra forma de
// fazermos loading e erros
const initialState = {
    loading: null,
    error: null
}
// o reducer aceita o estado e ação que queremos executar
const insertReducer = (state, action) => {
    // aqui teremos uma checagem do tipo da ação
    switch(action.type) {
        case "LOADING":
            return {loading: true, error: null}
        case "INSERTED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state;
    }
}
// aqui passamos uma colecao que pode ser qualquer uma, n necessariamente
// um post
export const useInsertDocument = (docCollection) => {

    // criando o reducer em si para iniciar o hook
    // que passa a função que vai tratar do reducer e o estado inicial
    const [response, dispatch] = useReducer(insertReducer, initialState)

    // deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    // funcao para ver se precisa continuar ou não com o hook
    const checkCancelBeforeDispatch = (action) => {
        if(!cancelled) {
            dispatch(action)
        }
    }

    const insertDocument = async(document) => {

         // colocando o dispatch para fazer o reducer funcionar
         checkCancelBeforeDispatch({
            type: "LOADING"
        })

        try {
            // pegar os dados que foi passado pela função
            // e como queremos o Timestamp, creiamos o createdAt
            // colocando o timestamp.noew
            const newDOcument = {...document, createdAt: Timestamp.now()}

            // funcao que insere o objeto criado ali
            const insertedDocument = await addDoc(
                // esse collection foi o metodo importado, onde passamos
                // o database importado la encima e a coleção que passamos
                // como argumento da função
                // ou seja, vamos no banco procurar a coleção que queremos e se der td
                // certo, vamos inserir o novo documento
                collection(db, docCollection),
                newDOcument
            )
             // colocando o dispatch para fazer o reducer funcionar
             checkCancelBeforeDispatch({
                type: "INSERTED_DOC",
                payload: insertedDocument
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
        insertDocument,
        response
    }
}

