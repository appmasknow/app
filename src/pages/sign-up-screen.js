import { LoginScreen, View, Page, LoginScreenTitle, List, ListInput, ListItem, ListButton, BlockFooter, Link, Button, Icon } from 'framework7-react';
import preset from 'jss-preset-default';
import React from 'react';
import jss from 'jss';

jss.setup(preset());

export default class extends React.Component {
  
  render() {
    return (
      <Page noToolbar noNavbar noSwipeback loginScreen name={this.state.name} className={stylesScoped.page}>
        <LoginScreenTitle>{this.state.title}</LoginScreenTitle>
        <form onSubmit={(e) => this.signUp(e)} noValidate>
          <List noHairlines noHairlinesBetween>
            <ListInput type="text" name="nome" placeholder="Nome" required onInput={(e) => this.formatInput(e)} pattern="[A-Za-z\s]+" autofocus={true}>
              <Link slot="inner-end" className="info" onClick={() => this.info('nome')}><Icon className="mdi mdi-information fs-18" /></Link>
            </ListInput>
            <ListInput type="email" name="email" placeholder="E-mail" required onInput={(e) => this.formatInput(e)}>
              <Link slot="inner-end" className="info" onClick={() => this.info('email')}><Icon className="mdi mdi-information fs-18" /></Link>
            </ListInput>
            <ListInput type="password" name="senha" placeholder="Senha" required pattern="[^\s]+">
              <Link slot="inner-end" className="info" onClick={() => this.info('senha')}><Icon className="mdi mdi-information fs-18" /></Link>
            </ListInput>
            <ListItem className="submit-button"><Button fill large type="submit" text="Criar conta" /></ListItem>
            <ListItem><Button large back className="w-100" text="Já tenho conta" /></ListItem>
          </List>
        </form>
        <BlockFooter><br /></BlockFooter>
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'sign-up-screen',
      title: 'Criar uma conta',
    };
  }
  
  componentDidMount() {
    //code
  }
  
  signUp(e) {
    e.preventDefault();
    const self = this, formEl = $(self.$f7router.currentPageEl).find('form');
    app.methods.validInputs(formEl, (formData) => {
      app.methods.request(self, 'post', '/auth/register', formData, (res) => {
        app.dialog.alert(null, 'Seu código de ativação é: ' + res.codigo_ativacao, () => {
          self.$f7router.navigate('/activate-account', {
            context: { ...formData }
          });
        });
      }, 'preloader');
    });
  }
  
  formatInput(e) {
    let { name, value } = e.target;
    switch (name) {
      case 'nome': e.target.value = value.toCapitalize(); break;
      case 'email': e.target.value = value.toLowerCase(); break;
    }
  }
  
  info(inputName) {
    let message = '';
    switch (inputName) {
      case 'nome': message = 'O nome não pode conter números, caracteres especiais como: <b>_@*</b>, entre outros.'; break;
      case 'email': message = 'O e-mail informado deve ser válido.'; break;
      case 'senha': message = 'A senha não pode conter espaços.'; break;
    }
    app.dialog.alert(message, 'Info');
  }
  
}

const styles = {
  page: {
    '& input': {
      fontSize: '22px !important',
      width: 'calc(100% - 30px) !important',
    },
    '& li': {
      '&.submit-button': {
        marginTop: '20px',
      },
      '&:not(.submit-button) .item-inner': {
        paddingTop: '0px',
      }
    },
    '& .info': {
      position: 'absolute',
      justifyContent: 'flex-end',
      display: 'flex',
      marginTop: '5px',
      marginRight: '15px',
      right: '0px',
    }
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;

