import { Page, Navbar, List, ListItem, Icon, Block, Button, Fab, SwipeoutActions, SwipeoutButton } from 'framework7-react';
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
        ) : this.state.mascaras.length == 0 ? (
          <Block className="center mt-50">Nenhuma mascara foi publicada!</Block>
        ) : (
          <div>
            <Block className="text-align-center st">Arraste a mascara desejada para a direita para deletar e/ou editar.</Block>
            <List mediaList noHairlines noHairlinesBetween>
              {this.state.mascaras.map((i, index) => (
                <ListItem swipeout
                  key={index}
                  link="#" onClick={() => {
                    let { _id } = app.data.user_account; i.usuario = { _id };
                    let props = { mascara: i };
                    this.$f7router.navigate('/mascara', { props });
                  }}
                  title={i.titulo}
                  subtitle={'Valor: '}
                > <span slot="subtitle" className="ml-5">{numeral(i.valor).format('$0,0.00')}</span>
                  <FadeIn slot="media">
                    <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{
                      backgroundImage: 'url(' + i.foto_capa + ')'
                    }}></div>
                  </FadeIn>
                  <SwipeoutActions left>
                    <SwipeoutButton color="red" onClick={(e) => this.deletarMascara(e, i)}>Deletar</SwipeoutButton>
                    <SwipeoutButton color="blue" onClick={() => {
                      let props = { 'mascara': i, 'previousComponent': this };
                      this.$f7router.navigate('/editar-mascara', { props });
                    }}>Editar</SwipeoutButton>
                  </SwipeoutActions>
                </ListItem>
              ))}
            </List>
          </div>
        )}
        <Fab onClick={() => this.$f7router.navigate('/nova-mascara', { props: { 'previousComponent': this } })}
          position="center-bottom" slot="fixed" text="Nova mascara">
          <Icon className="mdi mdi-plus" />
        </Fab>
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'minhas-mascaras',
      title: 'Minhas máscaras',
      preloader: true,
      mascaras: [],
    };
  }
  
  onPageInit() {
    this.loadMasks();
  }
  
  loadMasks() {
    const self = this;
    self.setState({ preloader: true }, () => {
      app.methods.request(self, 'get', '/minhas-mascaras', null, (res) => {
        self.setState({
          mascaras: res.mascaras,
          preloader: false
        });
      });
    });
  }
  
  deletarMascara(e, i) {
    const self = this, mascaraID = i._id;
    let el = $(e.target).closest('.swipeout');
    app.dialog.create({
      title: 'Deseja mesmo deletar essa mascara?',
      text: 'Não será mais possível recuperá-la.',
      buttons: [
        {
          text: 'Sim, deletar', color: 'red',
          onClick() {
            app.methods.request(self, 'delete', `/minhas-mascaras/${mascaraID}`, null, () => {
              app.swipeout.delete(el);
            }, 'preloader');
          }
        },
        { text: 'Cancelar' }
      ]
    }).open();
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
    '& .fab': {
      width: '190px',
    },
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
