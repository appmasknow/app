import { Page, Navbar, List, ListItem, Icon, Block, Button, Badge } from 'framework7-react';
import preset from 'jss-preset-default';
import FadeIn from 'react-fade-in';
import React from 'react';
import jss from 'jss';

import PreloaderMain from '../components/PreloaderMain';

jss.setup(preset());

export default class extends React.Component {
  
  render() {
    const user = this.state.user;
    return (
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} className={stylesScoped.page}>
        <Navbar title={this.state.title} backLink="Back" />
        {this.state.preloader ? (
          <PreloaderMain />
        ) : this.state.minhas_compras.length == 0 ? (
          <Block className="center mt-50">Nenhuma compra no momento!</Block>
        ) : (
          <List mediaList noHairlines noHairlinesBetween>
            {this.state.minhas_compras.map((i, index) => (
              <ListItem
                key={index}
                link="#" onClick={() => {
                  let props = {
                    'mascara': i.mascara,
                    'telefone_vendedor': i.vendedor.telefone_celular
                  };
                  this.$f7router.navigate('/mascara', { props });
                }}
                title={i.mascara.titulo}
                subtitle={'Valor da compra: '}
              > <span slot="subtitle" className="ml-5">{numeral(i.valor_mascara).format('$0,0.00')}</span>
                <span slot="text">
                  <Icon className="mdi mdi-calendar-clock fs-18 mr-5" />Data/hora da compra:<br />{moment(i.data_inclusao).format('DD/MM/YYYY HH:mm')}
                </span>
                <FadeIn slot="media">
                  <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                    backgroundImage: 'url(' + i.mascara.foto_capa + ')'
                  }}></div>
                </FadeIn>
              </ListItem>
            ))}
          </List>
        )}
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'minhas-compras',
      title: 'Minhas compras',
      preloader: true,
      minhas_compras: [],
    };
  }
  
  onPageInit() {
    const self = this;
    self.setState({ preloader: true }, () => {
      app.methods.request(self, 'get', '/minhas-compras', null, (res) => {
        let localSession = app.methods.localSessionAPI();
        let minhas_compras = [];
        res.compras.forEach(compra => {
          let { _id, mascara } = compra; mascara = mascara._id;
          minhas_compras.push({ _id, mascara });
        });
        localSession.updateUserAccountData({ minhas_compras });
        self.setState({
          minhas_compras: res.compras,
          preloader: false
        });
      });
    });
  }
  
}

const styles = {
  page: {
    '& .item-title': {
      fontWeight: 'bold !important',
    },
    '& .item-subtitle': {
      '& span': {
        fontWeight: 'bold',
        fontSize: '18px',
      }
    },
    '& .item-text': {
      fontSize: '16px',
      '& .icon': {
        marginTop: '-2px',
        marginLeft: '-3px',
        fontSize: '16px',
      },
    }
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
