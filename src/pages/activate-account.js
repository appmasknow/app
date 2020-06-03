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
        <form onSubmit={(e) => this.validateAccountCode(e)} noValidate>
          <List noHairlines noHairlinesBetween>
            <ListInput type="number" name="codigo_ativacao" placeholder="Código de ativação" autofocus={true} required />
            <ListItem className="submit-button"><Button fill large type="submit" text="Prosseguir" /></ListItem>
            <ListItem><Button large back className="w-100" text="Voltar" /></ListItem>
          </List>
        </form>
        <BlockFooter><br /></BlockFooter>
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'activate-account',
      title: 'Ativar conta',
    };
  }
  
  componentDidMount() {
    //code
  }
  
  validateAccountCode(e) {
    e.preventDefault();
    const { context } = this.$f7route;
    const self = this, formEl = self.$f7router.currentPageEl;
    app.methods.validInputs(formEl, (formData) => {
      app.methods.request(self, 'post', '/auth/activate-account', { ...formData, ...context }, (res) => {
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
    '& .item-input-invalid': {
      paddingBottom: '0px',
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

