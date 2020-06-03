import { Panel, View, Page, Navbar, BlockTitle, List, ListItem, Icon } from 'framework7-react';
import preset from 'jss-preset-default';
import React from 'react';
import jss from 'jss';

jss.setup(preset());

export default class extends React.Component {
  
  //swipe
  
  render() {
    return this.state.visible && (
      <Panel left cover themeDark visibleBreakpoint={960}>
        <View>
          <Page className={stylesScoped.page}>
            <Navbar title={this.title()} />
            <BlockTitle>Navegação</BlockTitle>
            <List noChevron noHairlines noHairlinesBetween>
              <ListItem link="/minha-conta" view=".view-main" panelClose title="Minha conta">
                <Icon slot="media" className="mdi mdi-account" />
              </ListItem>
              {app.methods.cadastroConcluido('vendedor') ? (
                <ListItem link="/minhas-mascaras" view=".view-main" panelClose title="Minhas máscaras">
                  <Icon slot="media" className="mdi mdi-segment" />
                </ListItem>
              ) : (
                <ListItem link="#" onClick={() => this.venderMascaras()} panelClose title="Vender máscaras">
                  <Icon slot="media" className="mdi mdi-cart" />
                </ListItem>
              )}
              {app.methods.cadastroConcluido('vendedor') && (
                <ListItem link="/minhas-vendas" view=".view-main" panelClose title="Minhas vendas">
                  <Icon slot="media" className="mdi mdi-cart-arrow-up" />
                </ListItem>
              )}
              <ListItem link="/minhas-compras" view=".view-main" panelClose title="Minhas compras">
                <Icon slot="media" className="mdi mdi-cart-arrow-down" />
              </ListItem>
              <ListItem link="/formas-de-pagamento" view=".view-main" panelClose title="Formas de pagamento">
                <Icon slot="media" className="mdi mdi-currency-usd-circle" />
              </ListItem>
              {app.methods.cadastroConcluido('vendedor') && (
                <ListItem link="/taxas-e-cobrancas" view=".view-main" panelClose title="Taxas & Cobranças">
                  <Icon slot="media" className="mdi mdi-currency-usd-circle-outline" />
                </ListItem>
              )}
              <ListItem link="#" onClick={() => app.methods.logoutAccount()} panelClose title="Sair da conta">
                <Icon slot="media" className="mdi mdi-logout-variant" />
              </ListItem>
            </List>
          </Page>
        </View>
      </Panel>
    );
  }
  //{app.methods.cadastroConcluido('vendedor') && (
  //  <ListItem link="/conta-bancaria" view=".view-main" panelClose title="Conta bancária">
  //    <Icon slot="media" className="mdi mdi-bank" />
  //  </ListItem>
  //)}
  
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  
  componentDidMount() {
    this.$f7ready(() => {
      app.components.panelLeft = this;
    });
  }
  
  venderMascaras() {
    app.dialog.create({
      title: 'Conclua seu cadastro',
      text: 'Para poder vender mascaras em nosso aplicativo é nessesário completar o cadastro preenchendo todos os requisitos das "informações complementares" da sua conta.',
      buttons: [
        { text: 'Concluir cadastro', onClick: () => app.view.main.router.navigate('/minha-conta') },
        { text: 'Cancelar' }
      ]
    }).open();
  }
  
  title() {
    return app.data.user_account.nome;
  }
  
  show() {
    this.setState({visible: true});
  }
  
  hide() {
    this.setState({visible: false});
  }
  
}

const styles = {
  page: {
    '& .item-inner': {
      marginLeft: '5px !important'
    }
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
