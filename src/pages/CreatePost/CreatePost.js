import styles from "./CreatePost.module.css"

// para pegar os estados
import { useState} from 'react';
// para redirecionar após a criação do post
import { useNavigate } from "react-router-dom";
// para pegar o usuário e conseguir atrelar ele ao post
import { useAuthValue } from '../../context/AuthContext';

// chamando o hook para inserir posts
import { useInsertDocument } from "../../hooks/useInsertDocument";

const CreatePost = () => {

  const [ title, setTitle ] = useState("")
  const [ image, setImage ] = useState("")
  const [ body, setBody ] = useState("")
  const [ tags, setTags ] = useState([])
  const [ formError, setFormError ] = useState("")

  // chamando hook de inserir documento
  const {insertDocument, response} = useInsertDocument("posts")

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
    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    })
    // redirect to home page
    navigate('/')
  }


  return (
    <div className={styles.create_post}>
        <h2>Criar post</h2>
        <p>Escreva sobre o que quiser e compartilhe o seu conhecimento</p>
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
          {!response.loading && <button className="btn">Publicar</button>}
          {response.loading && (
            <button className="btn" disable>Publicando...</button>
          )}
          {response.error && <p className="error">{response.error}</p>}
          {formError && <p className="error">{formError}</p>}
        </form>
    </div>
  )
}

export default CreatePost
