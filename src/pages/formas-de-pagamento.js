import { Page, Navbar, List, ListItem, Icon, Button, Block, BlockHeader } from 'framework7-react';
import preset from 'jss-preset-default';
import FadeIn from 'react-fade-in';
import React from 'react';
import jss from 'jss';

jss.setup(preset());

export default class extends React.Component {
  
  render() {
    const user = this.state.user;
    return (
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} className={stylesScoped.page}>
        <Navbar title={this.state.title} backLink="Back" />
        <BlockHeader>Escolha sua forma de pagamento</BlockHeader>
        <List noHairlines noHairlinesBetween>
          <ListItem link="#" title="Dinheiro">
            <div slot="after" className="strong">(auto selecionado)</div>
            <Icon slot="media" className="mdi mdi-dark mdi-cash-multiple"></Icon>
          </ListItem>
          <ListItem link="#" title="Cartão de débido" className="disabled">
            <div slot="after" className="strong">(em breve)</div>
            <Icon slot="media" className="mdi mdi-dark mdi-credit-card-outline"></Icon>
          </ListItem>
          <ListItem link="#" title="Cartão de crédito" className="disabled">
            <div slot="after" className="strong">(em breve)</div>
            <Icon slot="media" className="mdi mdi-dark mdi-credit-card"></Icon>
          </ListItem>
        </List>
        <Block className="text-align-center">Em breve notificaremos todos os usuários quando as opções <b>"cartao de débito"</b> e <b>"crédito"</b> estiverem disponíveis para uso no aplicativo.</Block>
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'formas-de-pagamento',
      title: 'Formas de pagamento'
    };
  }
  
  onPageInit() {
    //code
  }
  
}

const styles = {
  page: {
    //code
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
