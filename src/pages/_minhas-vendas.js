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
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} onPageReinit={this.onPageReinit.bind(this)} className={stylesScoped.page}>
        <Navbar title={this.state.title} backLink="Back" />
        {this.state.preloader ? (
          <PreloaderMain />
        ) : this.vendasPendentes().length == 0 &&
            this.vendasConfirmadas().length == 0 &&
            this.vendasCanceladas().length == 0 &&
            this.vendasRecusadas().length == 0 ? (
          <Block className="center mt-50">Nenhuma venda no momento!</Block>
        ) : (
          <div>
            
            <BlockHeader>Vendas pendentes de confirmação</BlockHeader>
            {this.vendasPendentes().length == 0 ? (
              <Block className="center m-25">Nenhuma venda no momento!</Block>
            ) : (
              <List mediaList noHairlines noHairlinesBetween>
                {this.vendasPendentes().map((i, index) => (
                  <ListItem
                    key={index}
                    link="#" onClick={() => this.opcoesDaVenda(i)}
                    title={i.mascara.titulo}
                    subtitle={'Valor da venda: '}
                  > <span slot="subtitle" className="ml-5">{numeral(i.valor_mascara).format('$0,0.00')}</span>
                    <Badge color="orange">Aguardando confirmação da venda</Badge>
                    <FadeIn slot="media">
                      <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                        backgroundImage: 'url(' + i.mascara.foto_capa + ')'
                      }}> <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                            backgroundImage: 'url(' + (i.comprador.foto_perfil || app.data.photo_profile) + ')',
                            width: '40px', height: '40px',
                            border: '2px solid #fff',
                          }}></div>
                      </div>
                    </FadeIn>
                  </ListItem>
                ))}
              </List>
            )}
            
            <BlockHeader>Vendas confirmadas</BlockHeader>
            {this.vendasConfirmadas().length == 0 ? (
              <Block className="center m-25">Nenhuma venda no momento!</Block>
            ) : (
              <List mediaList noHairlines noHairlinesBetween>
                {this.vendasConfirmadas().map((i, index) => (
                  <ListItem
                    key={index}
                    link="#" onClick={() => {
                      let props = { mascara: i.mascara };
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
                        backgroundImage: 'url(' + i.mascara.foto_capa + ')'
                      }}> <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                            backgroundImage: 'url(' + (i.comprador.foto_perfil || app.data.photo_profile) + ')',
                            width: '40px', height: '40px',
                            border: '2px solid #fff',
                          }}></div>
                      </div>
                    </FadeIn>
                  </ListItem>
                ))}
              </List>
            )}
            
            <BlockHeader>Vendas canceladas</BlockHeader>
            {this.vendasCanceladas().length == 0 ? (
              <Block className="center m-25">Nenhuma venda no momento!</Block>
            ) : (
              <List mediaList noHairlines noHairlinesBetween>
                {this.vendasCanceladas().map((i, index) => (
                  <ListItem
                    key={index}
                    link="#" onClick={() => {
                      let props = { mascara: i.mascara };
                      this.$f7router.navigate('/mascara', { props });
                    }}
                    title={i.mascara.titulo}
                    subtitle={'Valor da venda: '}
                  > <span slot="subtitle" className="ml-5">{numeral(i.valor_mascara).format('$0,0.00')}</span>
                    <Badge color="red">Venda cancelada {i.cancelado_por == 'vendedor' ? 'por mim' : 'pelo comprador'}</Badge>
                    <FadeIn slot="media">
                      <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                        backgroundImage: 'url(' + i.mascara.foto_capa + ')'
                      }}> <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                            backgroundImage: 'url(' + (i.comprador.foto_perfil || app.data.photo_profile) + ')',
                            width: '40px', height: '40px',
                            border: '2px solid #fff',
                          }}></div>
                      </div>
                    </FadeIn>
                  </ListItem>
                ))}
              </List>
            )}
            
            <BlockHeader>Vendas recusadas</BlockHeader>
            {this.vendasRecusadas().length == 0 ? (
              <Block className="center m-25">Nenhuma venda no momento!</Block>
            ) : (
              <List mediaList noHairlines noHairlinesBetween>
                {this.vendasRecusadas().map((i, index) => (
                  <ListItem
                    key={index}
                    link="#" onClick={() => {
                      let props = { mascara: i.mascara };
                      this.$f7router.navigate('/mascara', { props });
                    }}
                    title={i.mascara.titulo}
                    subtitle={'Valor da venda: '}
                  > <span slot="subtitle" className="ml-5">{numeral(i.valor_mascara).format('$0,0.00')}</span>
                    <Badge color="red">Venda recusada</Badge>
                    <FadeIn slot="media">
                      <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                        backgroundImage: 'url(' + i.mascara.foto_capa + ')'
                      }}> <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                            backgroundImage: 'url(' + (i.comprador.foto_perfil || app.data.photo_profile) + ')',
                            width: '40px', height: '40px',
                            border: '2px solid #fff',
                          }}></div>
                      </div>
                    </FadeIn>
                  </ListItem>
                ))}
              </List>
            )}
            
          </div>
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
    this.initializeAll();
  }
  
  onPageReinit() {
    this.initializeAll();
  }
  
  initializeAll() {
    const self = this;
    self.setState({ preloader: true }, () => {
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
      });
    });
  }
  
  vendasPendentes() {
    return this.state.minhas_vendas.filter(i => !i.data_confirmacao_vendedor && !i.data_recusacao_vendedor && !i.data_cancelamento);
  }
  
  vendasConfirmadas() {
    return this.state.minhas_vendas.filter(i => i.data_confirmacao_vendedor && !i.data_cancelamento);
  }
  
  vendasRecusadas() {
    return this.state.minhas_vendas.filter(i => i.data_recusacao_vendedor);
  }
  
  vendasCanceladas() {
    return this.state.minhas_vendas.filter(i => i.data_cancelamento);
  }
  
  opcoesDaVenda(i) {
    const self = this;
    let { mascara, comprador } = i;
    app.sheet.create({
      content: `
        <div class="sheet-modal h-auto ${stylesScoped.page}">
          <div class="navbar no-shadow">
            <div class="navbar-bg"></div>
            <div class="navbar-inner">
              <div class="title">Minha venda</div>
              <div class="right">
                <a href="#" class="link sheet-close">
                  <i class="icon mdi mdi-close"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="sheet-modal-inner">
            <div class="block-header mt-25 mb-0 strong">Mascara</div>
            <div class="list no-chevron media-list no-hairlines no-hairlines-between m-0">
              <ul>
                <li class="item-link item-content">
                  <div class="item-media">
                    <div>
                      <div style="transition: opacity 400ms ease 0s, transform 400ms ease 0s; transform: translateY(0px); opacity: 1;">
                        <div class="foto-capa elevation-3 lazy lazy-fade-in" style="background-image: url(${mascara.foto_capa});"></div>
                      </div>
                    </div>
                  </div>
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title">${mascara.titulo}</div>
                    </div>
                    <div class="item-subtitle">Valor: <span slot="subtitle" class="ml-5">R$ ${mascara.valor}</span></div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="block-header mt-10 mb-0 strong">Comprador</div>
            <div class="list no-chevron media-list no-hairlines no-hairlines-between m-0">
              <ul>
                <li class="item-link item-content">
                  <div class="item-media">
                    <div>
                      <div style="transition: opacity 400ms ease 0s, transform 400ms ease 0s; transform: translateY(0px); opacity: 1;">
                        <div class="foto-capa elevation-3 lazy lazy-fade-in" style="background-image: url(${comprador.foto_perfil || app.data.photo_profile});"></div>
                      </div>
                    </div>
                  </div>
                  <div class="item-inner">
                    <div class="item-title">${comprador.nome}</div>
                    <div class="item-text">
                      <i class="mdi mdi-map-marker icon"></i> ${comprador.distancia}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="list inset">
              <ul>
                <li><a href="#" class="button button-large border-radius button-fill confirmar">Confirmar venda</a></li>
                <li><a href="#" class="button button-large border-radius color-red recusar">Recusar venda</a></li>
              </ul>
            </div>
          </div>
        </div>
      `,
      on: {
        open(sheet) {
          sheet.$el.find('.confirmar').once('click', () => self.request('confirmar', i));
          sheet.$el.find('.recusar').once('click', () => self.request('recusar', i));
        },
        closed: sheet => sheet.destroy()
      }
    }).open();
  }
  
  request(tipoAcao, i) {
    const self = this, vendaID = i._id;
    app.methods.request(self, 'put', `/minhas-vendas/${vendaID}/${tipoAcao}`, null, (res) => {
      Object.assign(i, res.venda); app.sheet.close(); self.forceUpdate();
    }, 'preloader');
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
