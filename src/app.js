import { App, View } from 'framework7-react';
import React from 'react';

import data from './js/data';
import routes from './js/routes';
import methods from './js/methods';
import cordorva from './js/cordova';
import config from './js/config';

import PanelLeft from './components/PanelLeft';
import PanelRight from './components/PanelRight';

export default class extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      // Framework7 Parameters
      f7params: {
        id: 'com.appmasknow',
        name: 'Masknow',
        version: '1.1.0',
        theme: 'md',
        data,
        routes,
        methods,
        dialog: {
          title: 'Alerta',
          buttonOk: 'Ok',
          buttonCancel: 'Cancelar',
          usernamePlaceholder: 'Usuário',
          passwordPlaceholder: 'Senha',
          preloaderTitle: 'Carregando...',
          progressTitle: 'Processando...',
          destroyPredefinedDialogs: true,
          keyboardActions: true,
          autoFocus: true,
        },
        input: {
          scrollIntoViewOnFocus: true,
          scrollIntoViewCentered: true,
          scrollIntoViewAlways: true,
        },
        statusbar: {
          iosTextColor: 'white',
          androidTextColor: 'white',
          iosBackgroundColor: '#000000',
          androidBackgroundColor: '#000000',
          androidOverlaysWebView: false,
          iosOverlaysWebView: false,
          scrollTopOnClick: true,
          enabled: true,
        },
        on: {
          init() {
            config(this);
            cordorva(this);
            let localSession = app.methods.localSessionAPI();
            localSession.checkSession({
              opened(data) {
                console.log(data);
              }
            });
          }
        }
      },
    };
  }
  
  render() {
    return (
      <App params={this.state.f7params}>
        <PanelLeft />
        <View className="safe-areas" url="/" stackPages={true} main />
        <PanelRight />
      </App>
    )
  }
  
  componentDidMount() {
    const self = this;
    this.$f7ready(() => {
      app.components.root = this;
    });
  }
  
}

//removeElements={true}
