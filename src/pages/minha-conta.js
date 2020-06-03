import { Page, Navbar, List, ListItem, Icon, Block, Button } from 'framework7-react';
import preset from 'jss-preset-default';
import FadeIn from 'react-fade-in';
import React from 'react';
import jss from 'jss';

jss.setup(preset());

//<Icon slot="media" className="mdi mdi-dark mdi-inactive mdi-checkbox-blank fs-30" />

export default class extends React.Component {
  
  render() {
    const user = this.state.user;
    return (
      <Page name={this.state.name} className={stylesScoped.page}>
        <Navbar title={this.state.title} backLink="Back" />
        <FadeIn className="block center">
          <div className="foto-perfil elevation-3 lazy lazy-fade-in" style={{
            backgroundImage: 'url("' + (app.data.user_account.foto_perfil || app.data.photo_profile) + '")'
          }}> <Button onClick={() => this.actionsPhoto()} fill className="editar-foto center"><Icon className="mdi mdi-pencil" /></Button>
          </div>
        </FadeIn>
        <List noHairlines noHairlinesBetween>
          <ListItem link="/dados-pessoais" title="Dados pessoais" />
          <ListItem link="/dados-complementares" title="Dados complementares" after="(apenas vendedor)" />
        </List>
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'minha-conta',
      title: 'Minha conta'
    };
  }
  
  actionsPhoto() {
    app.actions.create({
      grid: true,
      buttons: [
        { text: 'Upload foto', label: true },
        { text: 'Abrir câmera', icon: '<i class="icon mdi mdi-camera"></i>', onClick: () => this.uploadPhoto('camera') },
        { text: 'Abrir galeria', icon: '<i class="icon mdi mdi-image-multiple"></i>', onClick: () => this.uploadPhoto('galeria') },
      ],
      on: {
        open: (actions) => actions.$el.find('.actions-button').addClass('w-50 notransition')
      }
    }).open();
  }
  
  loadPhoto(foto_perfil) {
    app.methods.request(self, 'put', '/minha-conta/foto-perfil', { foto_perfil }, (res) => {
      let localSession = app.methods.localSessionAPI();
      localSession.updateUserAccountData({ foto_perfil });
      this.forceUpdate();
    }, 'preloader');
  }
  
  uploadPhoto(type) {
    const self = this;
    if (window.cordova) {
      let options = {
        quality: 50,
        allowEdit: true,
        targetWidth: 200,
        targetHeight: 200,
        encodingType: Camera.EncodingType.JPEG,
        destinationType: Camera.DestinationType.DATA_URL,
        cameraDirection: Camera.Direction.BACK,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true,
        saveToPhotoAlbum: false,
      };
      switch (type) {
        case 'camera': options.sourceType = Camera.PictureSourceType.CAMERA; break;
        case 'galeria': options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY; break;
      }
      navigator.camera.getPicture((dataFile) => {
        self.loadPhoto('data:image/jpeg;base64,' + dataFile);
      }, (err) => console.log(err), options);
    } else {
      let input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/*';
      input.onchange = async (e) => {
        let file = e.target.files[0];
        let dataFile = await app.methods.fileToBase64(file);
        self.loadPhoto(dataFile);
      }; input.click();
    }
  }
  
}

const styles = {
  page: {
    '& .foto-perfil': {
      width: '175px',
      height: '175px',
      backgroundSize: 'cover',
      borderRadius: '50%',
      '& .editar-foto': {
        position: 'absolute',
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        bottom: '0px',
        right: '0px',
      }
    },
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
