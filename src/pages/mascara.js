import { Page, Navbar, List, ListItem, Icon, Block, BlockHeader, BlockTitle, Button, Swiper, SwiperSlide, Chip } from 'framework7-react';
import preset from 'jss-preset-default';
import FadeIn from 'react-fade-in';
import React from 'react';
import jss from 'jss';

jss.setup(preset());

export default class extends React.Component {
  
  render() {
    const user = this.state.user;
    return (
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} className={stylesScoped.page}>
        <Navbar title={this.props.mascara.titulo} backLink="Back" large transparent noShadow />
        <Swiper pagination scrollbar className="bg-color-black">
          <SwiperSlide className="foto-perfil elevation-3 lazy lazy-fade-in" style={{
            backgroundImage: `url("${this.props.mascara.foto_capa}")`
          }} />
          {this.props.mascara.foto_1 && (
            <SwiperSlide className="foto-perfil elevation-3 lazy lazy-fade-in" style={{
              backgroundImage: `url("${this.props.mascara.foto_1}")`
            }} />
          )}
          {this.props.mascara.foto_2 && (
            <SwiperSlide className="foto-perfil elevation-3 lazy lazy-fade-in" style={{
              backgroundImage: `url("${this.props.mascara.foto_2}")`
            }} />
          )}
          {this.props.mascara.foto_3 && (
            <SwiperSlide className="foto-perfil elevation-3 lazy lazy-fade-in" style={{
              backgroundImage: `url("${this.props.mascara.foto_3}")`
            }} />
          )}
        </Swiper>
        <BlockHeader className="mb-0">Valor</BlockHeader>
        <BlockTitle medium className="mt-0">{numeral(this.props.mascara.valor).format('$0,0.00')}</BlockTitle>
        <BlockHeader className="mb-0">Descrição</BlockHeader>
        <Block className="mt-5">{this.props.mascara.descricao}</Block>
        <Block>
          {this.props.mascara.usuario._id == app.data.user_account._id ? (
            <Chip outline className="fs-20 st center-h" text="Minha mascara" />
          ) : this.mascaraComprada() ? (
            <Button large outline href={'https://api.whatsapp.com/send?phone=' + this.props.telefone_vendedor} target="_blank" external={true}>
              <Icon className="mdi mdi-whatsapp -ml-10 mr-5" /> Abrir whatsapp do vendedor
            </Button>
          ) : this.mascaraVendida() ? (
            <Button large outline href={'https://api.whatsapp.com/send?phone=' + this.props.telefone_comprador} target="_blank" external={true}>
              <Icon className="mdi mdi-whatsapp -ml-10 mr-5" /> Abrir whatsapp do comprador
            </Button>
          ) : (
            <Button large fill onClick={() => this.comprar()}>Comprar agora</Button>
          )}
        </Block>
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'mascara',
      //title: 'Mascara',
      mascara: {},
    };
  }
  
  onPageInit() {
    let swiperEl = $(this.$f7router.currentPageEl).find('.swiper-container');
    let swiper = app.swiper.get(swiperEl);
    setTimeout(() => swiper.virtual.update(), 100);
  }
  
  mascaraComprada() {
    let { minhas_compras } = app.data.user_account;
    let comprasIDs = (minhas_compras || []).map(i => i.mascara);
    return comprasIDs.includes(this.props.mascara._id);
  }
  
  mascaraVendida() {
    let { minhas_vendas } = app.data.user_account;
    let vendasIDs = (minhas_vendas || []).map(i => i.mascara);
    return vendasIDs.includes(this.props.mascara._id);
  }
  
  comprar() {
    const self = this;
    app.dialog.create({
      title: 'Deseja mesmo comprar essa mascara?',
      text: `
        Ao confirmar a compra dessa mascara o contato do vendedor será exibido para troca de mensagens via whatsapp.<br />
        Caso o vendedor notifique-nos que a venda não foi realizada será cobrado uma multa de R$ 2,00 reais da sua conta no aplicativo.
        Você pode visualizar essas cobranças no menu da tela inicial em <b>"Taxas & Cobranças"</b>.
      `,
      buttons: [
        {
          text: 'Sim, comprar', onClick() {
            app.methods.request(self, 'post', `/mascaras/${self.props.mascara._id}/comprar`, null, (res) => {
              let { compra } = res, { user_account } = app.data;
              user_account.minhas_compras.push({ _id: compra._id, mascara: compra.mascara });
              app.methods.localSessionAPI().updateUserAccountData(user_account);
              self.forceUpdate();
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
    '& .page-content': {
      paddingTop: '0px !important',
    },
    '& .foto-perfil': {
      width: '100vw',
      height: '0px',
      paddingBottom: '100%',
      backgroundSize: 'cover',
      boxShadow: '0px 100px 100px rgba(0,0,0,0.5) inset !important',
      //filter: 'brightness(75%)',
    },
    '& .swiper-pagination span': {
      backgroundColor: 'white',
    },
    '& .navbar, .navbar .link': {
      color: 'white',
    },
    '& .navbar .navbar-bg': {
      background: 'transparent !important',
    }
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
