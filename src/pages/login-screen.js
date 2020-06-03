import { LoginScreen, View, Page, LoginScreenTitle, List, ListInput, ListItem, ListButton, BlockFooter, Link, Button } from 'framework7-react';
import preset from 'jss-preset-default';
import React from 'react';
import jss from 'jss';

jss.setup(preset());

export default class extends React.Component {
  
  render() {
    return (
      <Page noToolbar noNavbar noSwipeback loginScreen name={this.state.name} className={stylesScoped.page}>
        <LoginScreenTitle>{this.state.title}</LoginScreenTitle>
        <form onSubmit={(e) => this.login(e)} noValidate>
          <List noHairlines noHairlinesBetween>
            <ListInput type="email" name="email" placeholder="E-mail" required />
            <ListInput type="password" name="senha" placeholder="Senha" required />
            <ListItem className="submit-button"><Button fill large type="submit" text="Entrar na conta" /></ListItem>
            <ListItem><Button large href="/sign-up" className="w-100" text="Criar uma conta" /></ListItem>
          </List>
        </form>
      </Page>
    );
  }
  //<BlockFooter>
  //  <Link href="#" text="Esqueci minha senha" color="gray" noLinkClass />
  //</BlockFooter>
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'login-screen',
      title: 'Login',
    };
  }
  
  componentDidMount() {
    this.$f7ready(() => {
      app.methods.hidePanels();
    });
  }
  
  login(e) {
    e.preventDefault();
    const self = this, formEl = $(self.$f7router.currentPageEl).find('form');
    app.methods.validInputs(formEl, (formData) => {
      app.methods.request(self, 'post', '/auth/authenticate', formData, (res) => {
        let localSession = app.methods.localSessionAPI(), { session_token, user_account } = res;
        localSession.open({ session_token, user_account });
        app.methods.goInitialPage();
      }, 'preloader');
    });
  }
  
}

const styles = {
  page: {
    '& input': {
      fontSize: '22px !important',
    },
    '& li': {
      '&.submit-button': {
        marginTop: '20px',
      },
      '&:not(.submit-button) .item-inner': {
        paddingTop: '0px',
      }
    },
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;

