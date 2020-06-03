import { Page, Navbar, List, ListItem, ListInput, Icon, Block, BlockTitle, Button, Card } from 'framework7-react';
import preset from 'jss-preset-default';
import React from 'react';
import jss from 'jss';

jss.setup(preset());

export default class extends React.Component {
  
  render() {
    const user = this.state.user;
    return (
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} className={stylesScoped.page}>
        <Navbar title={this.state.title} backLink="Back" />
        <Block>
          <Card className="bg-color-primary" title="Minhas dívidas com o Masknow" footer={'R$ ' + numeral(this.state.meu_saldo).format('0,0.00')} />
        </Block>
        <BlockTitle medium>Multa de cancelamento</BlockTitle>
        <List inlineLabels mediaList>
          <ListInput label="Valor:" type="text" value="R$ 2,00" disabled />
          <ListItem>
            <span slot="text">A multa de cancelamento é gerada para o usuário <b>(comprador)</b> após o ato da confirmação da compra e visualização da informação de contato do vendedor via whatsapp quando o vendedor da mascara nos relata que a compra não foi realizada por parte do comprador.</span>
          </ListItem>
        </List>
        <BlockTitle medium>Taxa de venda</BlockTitle>
        <List inlineLabels mediaList>
          <ListInput label="Porcentagem:" type="text" value="2%" disabled />
          <ListItem>
            <span slot="text">Será cobrado do <b>vendedor</b> a <b>taxa de 2%</b> em cima do valor escolhido para a mascara na sua venda.</span>
          </ListItem>
        </List>
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'taxas-e-cobrancas',
      title: 'Taxas & cobranças',
      meu_saldo: 0,
    };
  }
  
  onPageInit() {
    const self = this;
    app.methods.request(self, 'get', '/taxas-e-cobrancas', null, (res) => {
      let { meu_saldo } = res;
      self.setState({ meu_saldo });
    });
  }
  
}

const styles = {
  page: {
    '& .list': {
      '--f7-list-item-text-max-lines': '10',
      '& .disabled': {
        opacity: '1 !important',
      },
      '& input': {
        fontSize: '18px !important',
        fontWeight: 'bold',
      },
    },
    '& .card-header, .card-footer': {
      color: 'white',
    },
    '& .card-footer': {
      fontSize: '18px',
    }
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
