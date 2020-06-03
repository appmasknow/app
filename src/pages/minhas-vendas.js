import { Page, Navbar, List, ListItem, Icon, Block, Button, BlockHeader, Badge } from 'framework7-react';
import preset from 'jss-preset-default';
import FadeIn from 'react-fade-in';
import React from 'react';
import jss from 'jss';

import geoDistance from '../js/geo-distance';

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
        ) : this.vendasConfirmadas().length == 0 ? (
          <Block className="center mt-50">Nenhuma venda no momento!</Block>
        ) : (
          <List mediaList noHairlines noHairlinesBetween>
            {this.vendasConfirmadas().map((i, index) => (
              <ListItem
                key={index}
                link="#" onClick={() => {
                  let props = {
                    'mascara': i.mascara,
                    'telefone_comprador': i.comprador.telefone_celular
                  };
                  this.$f7router.navigate('/mascara', { props });
                }}
                title={i.mascara.titulo}
                subtitle={'Valor da venda: '}
              > <span slot="subtitle" className="ml-5">{numeral(i.valor_mascara).format('$0,0.00')}</span>
                <span slot="text">
                  <Icon className="mdi mdi-calendar-clock fs-18 mr-5" />Data/hora da venda:<br />{moment(i.data_confirmacao_vendedor).format('DD/MM/YYYY HH:mm:ss')}
                </span>
                <FadeIn slot="media">
                  <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                    backgroundImage: 'url("' + i.mascara.foto_capa + '")'
                  }}> <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                        backgroundImage: 'url("' + (i.comprador.foto_perfil || app.data.photo_profile) + '")',
                        width: '40px', height: '40px',
                        border: '2px solid #fff',
                      }}></div>
                  </div>
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
      name: 'minhas-vendas',
      title: 'Minhas vendas',
      preloader: true,
      minhas_vendas: [],
    };
  }
  
  onPageInit() {
    const self = this;
    app.methods.request(self, 'get', '/minhas-vendas', null, (res) => {
      let localSession = app.methods.localSessionAPI();
      let minhas_vendas = [];
      res.vendas.map(venda => {
        let { _id, mascara } = venda; mascara = mascara._id;
        minhas_vendas.push({ _id, mascara });
        let position = app.data.user_account.minha_geolocalizacao;
        let { minha_geolocalizacao } = venda.comprador;
        venda.comprador.distancia = geoDistance.between(position, minha_geolocalizacao, 'km').getMode('string');
      });
      localSession.updateUserAccountData({ minhas_vendas });
      self.setState({
        minhas_vendas: res.vendas,
        preloader: false
      });
      console.log(res.vendas);
    });
  }
  
  vendasConfirmadas() {
    return this.state.minhas_vendas.filter(i => i.data_confirmacao_vendedor && !i.data_cancelamento);
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
    },
    '& .foto-capa::before': {
      height: '25px',
      width: '25px',
    }
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;

