
import styles from './Register.module.css'

import { useState, useEffect } from 'react';

// hooks
import { useAuthentication } from '../../hooks/useAuthentication';

const Register = () => {

  const [ displayName, setDisplayName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  // esse erro eh de front ent
  const [ error, setError ] = useState('');

  // esse erro eh de back end: estou renomeando o error que chega para authError
  const { createUser, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("")

    const user = {
      displayName,
      email,
      password,
      confirmPassword
    }
    if(password !== confirmPassword) {
        setError("As senhas precisam ser iguais!")
        return
      }

      const res = await createUser(user)
      console.log(res)
  };

  // esse use effect vai fica mapeando se o erro mudou
  useEffect(() => {

    if(authError) {
      setError(authError)
    }
  })

  return (
    <div className={styles.register}>
        <h1>Cadastre-se para postar</h1>
        <p>Crie seu usuário e compartilhe suas histórias!</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Nome:</span>
            <input type="text" name='displayName'
            required
            placeholder='Nome do usuário'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
          <label>
            <span>E-mail:</span>
            <input type="email" name='email'
            required
            placeholder='E-mail do usuário'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <span>Senha:</span>
            <input type="password" name='password'
            required
            placeholder='Senha do usuário'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            <span>Confirmação de senha:</span>
            <input type="password" name='cofirmPassword'
            required
            placeholder='Confirme sua senha'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          {!loading && <button className='btn'>Cadastrar</button>}
          {loading && <button className='btn' disabled>Aguarde...</button>}
          {error && <p className='error'>{error}</p>}
        </form>
    </div>
  )
}

export default Register
