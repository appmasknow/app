import { Page, Navbar, NavLeft, NavTitle, NavTitleLarge, NavRight, BlockTitle, List, ListItem, Icon, Link, Badge, Block
} from 'framework7-react';
import preset from 'jss-preset-default';
import FadeIn from 'react-fade-in';
import React from 'react';
import jss from 'jss';

import geoDistance from '../js/geo-distance';

import PreloaderMain from '../components/PreloaderMain';

import Map from '../components/Map';

jss.setup(preset());

export default class extends React.Component {
  render() {
    return (
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} onPageReinit={this.onPageReinit.bind(this)} className={stylesScoped.page}>
        
        <Navbar sliding={false}>
          <NavLeft>
            <Link panelOpen="left">
              <Icon className="mdi mdi-menu" />
            </Link>
          </NavLeft>
          <NavTitle sliding>{this.state.title}</NavTitle>
          <NavRight>
            {app.methods.cadastroConcluido('vendedor') && (
              <Link href="/minhas-vendas">
                <Icon className="mdi mdi-cart-arrow-up">
                  {/*<Badge className="mt-10 strong" color="red">5</Badge>*/}
                </Icon>
              </Link>
            )}
            <Link href="/minhas-compras">
              <Icon className="mdi mdi-cart-arrow-down">
                {/*<Badge className="mt-10 strong" color="red">5</Badge>*/}
              </Icon>
            </Link>
          </NavRight>
        </Navbar>
        <Map />
        <BlockTitle>Venda de mascaras próximas à sua localização</BlockTitle>
        {this.state.preloader ? (
          <PreloaderMain />
        ) : this.state.mascaras.length == 0 ? (
          <Block className="center mt-50">Nenhuma mascara no momento!</Block>
        ) : (
          <List mediaList noHairlines noHairlinesBetween>
            {this.state.mascaras.map((i, index) => (
              <ListItem
                key={index}
                link="#" onClick={() => {
                  let props = {
                    'mascara': i,
                    'telefone_vendedor': i.usuario.telefone_celular
                  };
                  this.$f7router.navigate('/mascara', { props });
                }}
                title={i.titulo}
                subtitle={'Valor: '}
              > <span slot="subtitle" className="ml-5">{numeral(i.valor).format('$0,0.00')}</span>
                <span slot="text">
                  <Icon className="mdi mdi-map-marker" /> {i.distancia}
                </span>
                <FadeIn slot="media">
                  <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                    backgroundImage: 'url(' + i.foto_capa + ')'
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
      name: 'home',
      title: 'Masknow',
      preloader: true,
      mascaras: [],
    };
  }
  
  onPageInit() {
    app.methods.showPanels();
    this.loadMasks();
  }
  
  onPageReinit() {
    this.loadMasks();
  }
  
  loadMasks() {
    const self = this;
    app.methods.request(self, 'get', `/mascaras`, null, (res) => {
      app.methods.geolocation().getMyCurrentPosition(position => {
        res.mascaras.map(mascara => {
          let { minha_geolocalizacao } = mascara.usuario;
          mascara.distancia = geoDistance.between(position, minha_geolocalizacao, 'km').getMode('string');
          mascara._distancia = geoDistance.between(position, minha_geolocalizacao, 'km').getMode('number');
        });
        res.mascaras.sort((a, b) => { // ordena em 'asc' de acordo com a distância
          let key = '_distancia'; a = a[key], b = b[key];
          return (a > b ? 1 : a < b ? -1 : 0);
        });
        self.setState({
          mascaras: res.mascaras,
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

