import { Page, Navbar, List, ListItem, Icon, Block, BlockTitle, Button, Fab, ListInput, Swiper, SwiperSlide, Actions, ActionsGroup, Row, Col,
ActionsLabel, ActionsButton } from 'framework7-react';
import preset from 'jss-preset-default';
import FadeIn from 'react-fade-in';
import React from 'react';
import jss from 'jss';

import PreloaderMain from '../components/PreloaderMain';

import resizeImageBase64 from '../js/resize-image-base64';

jss.setup(preset());

export default class extends React.Component {
  
  render() {
    const user = this.state.user;
    return (
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} className={stylesScoped.page}>
        <Navbar title={this.state.title} backLink="Back" />
        <form onSubmit={(e) => this.submitForm(e)} noValidate>
          <List noHairlines noHairlinesBetween className="mt-20 mb-20">
            <ListInput type="text" name="titulo" label="Título" outline floatingLabel required onInput={(e) => {this.formatInput(e)}} />
            <ListInput type="text" name="valor" label="Valor" inputmode="numeric" placeholder="0,00" outline floatingLabel required />
            <ListInput type="textarea" name="descricao" label="Descrição" outline floatingLabel />
          </List>
          <Block className="m-0">
            <div className="foto-capa elevation-3 lazy lazy-fade-in" style={{ backgroundImage: 'url("' + this.state.foto_capa + '")' }}
              onClick={(e) => this.actionsPhoto('foto_capa')}
            > {this.state.foto_capa ? (
                <Button onClick={() => this.removePhoto('foto_capa')} fill className="remover-foto center color-red"><Icon className="mdi mdi-delete" /></Button>
              ) : (
                <div className="w-100 h-100 center" style={{ paddingTop: 'calc(75% / 2)', paddingBottom: 'calc(75% / 2)' }}>
                  <div className="p-10 pl-15 medium-strong st p-absolute top-0 left-0">Foto de capa</div>
                  <Icon className="mdi mdi-image-plus fs-50 st" />
                </div>
              )}
            </div>
            <Row className="mt-15">
              {[1, 2, 3].map(index => (
                <Col key={index}>
                  <div className="foto elevation-3 lazy lazy-fade-in" style={{ backgroundImage: 'url("' + this.state['foto_' + index] + '")' }}
                    onClick={() => this.actionsPhoto('foto_' + index)}
                  > {this.state['foto_' + index] ? (
                      <Button onClick={() => this.removePhoto('foto_' + index)} fill className="remover-foto center color-red"><Icon className="mdi mdi-delete" /></Button>
                    ) : (
                      <div className="w-100 h-100 center" style={{ paddingTop: '50%', paddingBottom: '50%' }}>
                        <Icon className="mdi mdi-image-plus fs-30 st" />
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          </Block>
          <Block>
            <Button type="submit" large fill text="Salvar alterações" />
          </Block>
        </form>
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'editar-mascara',
      title: 'Editar mascara',
      foto_capa: null,
      foto_1: null,
      foto_2: null,
      foto_3: null,
    };
  }
  
  onPageInit() {
    let formEl = $(this.$f7router.currentPageEl).find('form');
    let { foto_capa, foto_1, foto_2, foto_3, valor } = this.props.mascara;
    this.setState({ foto_capa, foto_1, foto_2, foto_3 });
    app.form.fillFromData(formEl, { ...this.props.mascara, valor: numeral(valor).format('0,0.00') });
    jQuery(this.$f7router.currentPageEl).find('[name="valor"]').mask('#.##0,00', {reverse: true});
  }
  
  submitForm(e) {
    e.preventDefault();
    const mascaraID = this.props.mascara._id;
    const self = this, formEl = $(self.$f7router.currentPageEl).find('form');
    app.methods.validInputs(formEl, (formData) => {
      ['foto_capa', 'foto_1', 'foto_2', 'foto_3'].forEach(key => {
        let image = self.state[key];
        if (image) formData[key] = resizeImageBase64(image, 720, 720);
      });
      formData.valor = numeral(formData.valor).value();
      if (!formData.foto_capa) app.dialog.alert('Faça o upload da foto de capa para publicar essa mascara.<br />Para fazer o upload da foto toque no ícone <div class="chip chip-outline"><div class="chip-label"><i class="icon mdi mdi-image-plus st"></i></div></div> em <b>foto de capa</b>.', 'Foto de capa obrigatória'); else
      app.methods.request(self, 'put', `/minhas-mascaras/editar-mascara/${mascaraID}`, formData, () => {
        self.props.previousComponent.loadMasks();
        self.$f7router.back();
      }, 'preloader');
    });
  }
  
  actionsPhoto(context) {
    app.actions.create({
      grid: true,
      buttons: [
        { text: 'Upload foto', label: true },
        { text: 'Abrir câmera', icon: '<i class="icon mdi mdi-camera"></i>', onClick: () => this.uploadPhoto('camera', context) },
        { text: 'Abrir galeria', icon: '<i class="icon mdi mdi-image-multiple"></i>', onClick: () => this.uploadPhoto('galeria', context) },
      ],
      on: {
        open: (actions) => actions.$el.find('.actions-button').addClass('w-50 notransition')
      }
    }).open();
  }
  
  loadPhoto(image, context) {
    this.state[context] = image;
    this.forceUpdate();
  }
  
  removePhoto(context) {
    this.state[context] = null;
    this.forceUpdate();
  }
  
  uploadPhoto(type, context) {
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
        self.loadPhoto('data:image/jpeg;base64,' + dataFile, context);
      }, (err) => console.log(err), options);
    } else {
      let input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/*';
      input.onchange = async (e) => {
        let file = e.target.files[0];
        let dataFile = await app.methods.fileToBase64(file);
        self.loadPhoto(dataFile, context);
      }; input.click();
    }
  }
  
  formatInput(e) {
    let { name, value } = e.target;
    switch (name) {
      case 'titulo': e.target.value = value.toCapitalize(); break;
    }
  }
  
}

const styles = {
  page: {
    '& .foto-capa, .foto': {
      width: '100%',
      height: '0px',
      paddingBottom: '100%',
      borderRadius: '5px',
      '& .remover-foto': {
        position: 'absolute',
        height: '33px',
        width: '33px',
        right: '0px',
        top: '0px',
        '& .icon': {
          fontSize: '18px',
        }
      }
    },
    '& .foto-capa': {
      paddingBottom: '75%',
    },
    '& .swiper-wrapper': {
      marginTop: '15px',
    },
    '& input, textarea': {
      fontSize: '22px !important'
    },
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
