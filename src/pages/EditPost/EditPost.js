import styles from "./EditPost.module.css"

// para pegar os estados
import { useEffect, useState} from 'react';
// para redirecionar após a criação do post
import { useNavigate, useParams } from "react-router-dom";
// para pegar o usuário e conseguir atrelar ele ao post
import { useAuthValue } from '../../context/AuthContext';

// chamando o hook para editar posts
import { useUpdateDocument } from "../../hooks/useUpdateDocument";

import { useFetchDocument } from "../../hooks/useFetchDocument";

const EditPost = () => {

  // pegando os parametros da URL para saber o post
  const {id} = useParams()
  // pegando o documento em especifico
  const { document: post} = useFetchDocument('posts', id)

  const [ title, setTitle ] = useState("")
  const [ image, setImage ] = useState("")
  const [ body, setBody ] = useState("")
  const [ tags, setTags ] = useState([])
  const [ formError, setFormError ] = useState("")

  useEffect(() => {
    if(post) {
        setTitle(post.title)
        setBody(post.body)
        setImage(post.image)

        const textTags = post.tagsArray.join(", ")

        setTags(textTags)
    }
  }, [post])

  // chamando hook de atualizar documento
  const {updateDocument, response} = useUpdateDocument("posts", id)

  // importandoo hook navigate
  const navigate = useNavigate()

  //pegando usuario
  const {user} = useAuthValue()

  const handleSubmit = (e) => {

    e.preventDefault()
    setFormError("")

    // validar url da imagem
    try {
      new URL(image)
    } catch (error) {
      setFormError("A imagem precisa ser uma URL. ")
    }

    // criar array de tags
    // esse trim tira todos espaços em branco que tiverem
    const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase())
    // checar todos os valores
    if(!title || !image || !tags || !body ) {
      setFormError("Por favor, preencha todos os campos.")
    }

    if(formError) return

    // inserir dados
    const data = {
        title,
        image,
        body,
        tagsArray,
        uid: user.uid,
        createdBy: user.displayName,
      }
    updateDocument(id, data)
    // redirect to home page
    navigate('/dashboard')
  }


  return (
    <div className={styles.edit_post}>
        {post && (
            <>
                <h2>Editando post: {post.title}</h2>
                <p>Altere os dados do post como desejar</p>
                <form onSubmit={handleSubmit}>
                <label>
                    <span>Título</span>
                    <input
                    type="text"
                    name="title"
                    required
                    placeholder="Digite o título do artigo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <label>
                    <span>URL da imagem</span>
                    <input
                    type="text"
                    name="image"
                    required
                    placeholder="Insira o URL da imagem"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    />
                </label>
                <p className={styles.preview_title}>Preview da imagem atual: </p>
                <img className={styles.image_preview} src={post.image} alt={post.title} />
                <label>
                    <span>Conteúdo</span>
                    <textarea
                    type="text"
                    name="body"
                    required
                    placeholder="Insira o conteúdo do post"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    />
                </label>
                <label>
                    <span>Tags:</span>
                    <input type="text"
                    name="tags"
                    required
                    placeholder="Insira as tags separadas por vírgula"
                    onChange={(e) => setTags(e.target.value)}
                    value={tags}
                    />
                </label>
                {!response.loading && <button className="btn">Editar</button>}
                {response.loading && (
                    <button className="btn" disable>Editando...</button>
                )}
                {response.error && <p className="error">{response.error}</p>}
                {formError && <p className="error">{formError}</p>}
                </form>
            </>
        )}
    </div>
  )
}

export default EditPost
