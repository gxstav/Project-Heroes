import React from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Menu, Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './style.css';
import iconheroes from '../../assets/images/iconheroes.png';

const { Header } = Layout;


function Navbar(){

  const history = useHistory()

  function gotoCadastro() {
    history.push('/cadastro')
  }

  function gotoHome() {
    history.push('/')
  }

  function gotoAbout() {
    history.push('/sobre')
  } 

  return(
   
  <Layout id="layout">
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" onClick={gotoHome}>Início</Menu.Item>
        <Menu.Item key="2" onClick={gotoAbout}>Conheça os Heroes</Menu.Item>
        <Menu.Item key="3">Meus projetos</Menu.Item>
        <div className="signUp">
          <img src={ iconheroes } alt="Heroes"/>
          <Button id="botao" type="primary" onClick={gotoCadastro}>Cadastre-se</Button>
          <Avatar id="avatar" size={44} icon={<UserOutlined />} />
        </div>
      </Menu>
    </Header>
  </Layout>
  )}
export default Navbar;