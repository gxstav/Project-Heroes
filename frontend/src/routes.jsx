import React from 'react'
import { BrowserRouter , Route } from 'react-router-dom'

import Home from './pages/Home'
import Caso from './pages/Caso'
import Cadastro from './pages/Cadastro'
import Sobre  from './pages/Sobre'
import Projetos  from './pages/Projetos'
//
// ADICIONAR MAIS PÁGINAS AQUI
//

function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/projetos/:id"  component={Caso} />
      <Route path="/cadastro"  component={Cadastro} />
      <Route path="/sobre"  component={Sobre} />
      <Route path="/projetos" exact component={Projetos} />
    </BrowserRouter>
  )
}
 
export default Routes;