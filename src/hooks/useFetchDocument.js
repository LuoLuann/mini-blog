import { useState, useEffect } from "react";
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

// nessa funcao esperamos a coleção onde estou pegando os dados,
// e o parametro da busca
export const useFetchDocument = (docCollection, id) => {
    const [document, setDocument] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    // deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    // vamos mapear o que chega nessa função utilizando useEffect
    useEffect(() => {
        async function loadDocument () {
            if(cancelled) return
            setLoading(true)

            try {
                const docRef = await doc(db, docCollection, id)
                const docSnap = await getDoc(docRef)
                setDocument(docSnap.data())
            } catch (error) {
                console.log(error)
                setError(error.message)
            }
            setLoading(false)
        }
        // essa função so sera executada quando alguma coisa mudar
        // ou seja, for passada uma colecao, o estado de algo mudar, etc
        loadDocument()
    }, [docCollection, id, cancelled])

    return {
        document,
        loading,
        error
    }
}
