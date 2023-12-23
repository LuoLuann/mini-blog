import { useState, useEffect } from "react";
import { db } from '../firebase/config'

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    where,
    QuerySnapshot
} from 'firebase/firestore'

// nessa funcao esperamos a coleção onde estou pegando os dados,
// e o parametro da busca
export const useFetchDocuments = (docCollection, search = null, uid = null) => {

    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    // deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    // vamos mapear o que chega nessa função utilizando useEffect
    useEffect(() => {

        async function loadData () {
            if(cancelled) return

            setLoading(true)

            const collectionReference = await collection(db, docCollection)

            try {
                let q

                // busca
                if(search) {
                    q = await query(collectionReference,
                        where('tagsArrays', 'array-contains', search),
                        orderBy('createdAt', 'desc'))

                }  // dashboard: ou seja, vem o id do usuario
                else if(uid) {
                    q = await query(
                        collectionReference,
                        where('uid', '==', uid),
                        orderBy('createdAt', 'desc')
                    )
                } else {
                    // todos dados ordenado pela criação
                    q = await query(collectionReference, orderBy('createdAt', 'desc'))
                }

                // mapeando os dados com onSnapshot que tmb sempre tras os dados novos
                await onSnapshot(q, (querySnapshot) => {
                    setDocuments(
                        // o id do firebase vem diferente dos outros dados
                        querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                    )
                })

                setLoading(false)

            } catch (error) {
                console.log(error)
                setError(error.message)
                setLoading(false)
            }
        }
        // essa função so sera executada quando alguma coisa mudar
        // ou seja, for passada uma colecao, o estado de algo mudar, etc
        loadData()
    }, [docCollection, search, uid, cancelled])


    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    return {
        documents,
        loading,
        error
    }
}
