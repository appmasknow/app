import { Page, Navbar, BlockTitle, Block, List, ListInput, ListItem, Button, Icon, Link, Sheet, Toolbar, Input, ListButton
} from 'framework7-react';
import preset from 'jss-preset-default';
import React from 'react';
import jss from 'jss';

jss.setup(preset());

export default class extends React.Component {
  
  render() {
    let { user_account, sheet } = this.state;
    return (
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} onPageReinit={this.onPageReinit.bind(this)} className={stylesScoped.page}>
        <Navbar title={this.state.title} backLink="Back" />
        {!app.data.user_account.dados_complementares ? (
          <div>
            <BlockTitle medium className="center">Conclua seu cadastro!</BlockTitle>
            <Block className="text-align-center">Para poder vender mascaras no aplicativo conclua seu cadastro preenchendo algumas informações restantes.</Block>
            <Block>
              <Button onClick={() => this.goInput()} fill large text="Concluir cadastro" />
            </Block>
          </div>
        ) : (
          <div>
            <List noHairlines noHairlinesBetween>
              {this.state.campos.map((i, index) => (
                <ListItem
                  key={index}
                  link="#"
                  header={i.label}
                  after="Editar"
                  onClick={() => this.editInput(i.index)}
                > <Icon slot="media" className={`mdi mdi-dark mdi-${i.icon}`}></Icon>
                  <div slot="title" maskelement={i.name}>{(user_account[i.name] || 'N/A')}</div>
                </ListItem>
              ))}
            </List>
            <Sheet position="top" className={'h-auto ' + stylesScoped.sheet}>
              <Navbar title="Editar">
                <Link slot="left" sheetClose>
                  <Icon className="mdi mdi-arrow-left" />
                </Link>
              </Navbar>
              <form onSubmit={(e) => this.submitForm(e)} noValidate>
                <List noHairlines noHairlinesBetween className="mb-0 mt-25 list-buttons-centers">
                  <ListInput outline floatingLabel
                    type={sheet.type}
                    name={sheet.name}
                    label={sheet.label}
                    inputmode={sheet.inputmode}
                    pattern={sheet.pattern}
                    required
                    onInput={(e) => {this.formatInput(e)}}
                  > {sheet.info && (
                      <Link slot="inner-end" className="info" onClick={() => this.info(sheet.name)}>
                        <Icon className="mdi mdi-information fs-18" />
                      </Link>
                    )}
                  </ListInput>
                </List>
                <Block className="m-0 p-0 mt-25">
                  <Button type="submit" large className="w-100" text="Salvar" />
                </Block>
              </form>
            </Sheet>
          </div>
        )}
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'dados-pessoais',
      title: 'Dados pessoais',
      user_account: {},
      campos: [
        { index: 1, type: 'text', label: 'CNPJ', name: 'cnpj', placeholder: 'Opcional', inputmode: 'numeric', info: true, icon: 'text-box' },
        { index: 2, type: 'text', label: 'Endereço', name: 'endereco', placeholder: 'Seu endereço', icon: 'map-marker' },
        { index: 3, type: 'text', label: 'Cidade', name: 'cidade', placeholder: 'Sua cidade', icon: 'map-search' },
        { index: 4, type: 'text', label: 'Estado', name: 'estado', placeholder: 'Seu estádo', icon: 'map' },
        { index: 5, type: 'text', label: 'CEP', name: 'cep', placeholder: 'Seu CEP', icon: 'map-legend' },
      ],
      sheet: {}
    };
  }
  
  onPageInit() {
    this.maskComponents();
  }
  
  onPageReinit() {
    this.maskComponents();
  }
  
  maskComponents() {
    let pageEl = jQuery(this.$f7router.currentPageEl);
    let { user_account } = JSON.clone(app.data);
    this.setState({ user_account }, () => {
      if (user_account.cnpj) pageEl.find('[maskelement="cnpj"]').text(user_account.cnpj).unmask().mask('00.000.000/0000-00'); // CNPJ
      pageEl.find('[maskelement="cep"]').text(user_account.cep).unmask().mask('00000-000'); // CEP
    });
  }
  
  goInput() {
    let props = { formData: {} };
    this.$f7router.navigate('/dados-complementares/input/1', { props });
  }
  
  editInput(index) {
    const { user_account } = this.state;
    let pageEl = jQuery(this.$f7router.currentPageEl);
    let sheetEl = pageEl.find('.sheet-modal');
    let campo = this.state.campos.find(i => i.index == index);
    let sheet = JSON.clone(campo);
    this.setState({ sheet }, () => {
      let inputEl = sheetEl.find('input');
      let value = user_account[campo.name]; inputEl.val(value);
      if (index == 1) inputEl.mask('00.000.000/0000-00'); // CPF
      if (index == 5) inputEl.mask('00000-000'); // CEP
      app.sheet.open(sheetEl).once('opened', () => {
        inputEl.focus();
      }).once('closed', () => {
        inputEl.unmask();
      });
    });
  }
  
  submitForm(e) {
    e.preventDefault();
    const self = this, formEl = $('.sheet-modal.modal-in').find('form');
    app.methods.validInputs(formEl, (formData) => {
      app.methods.request(self, 'put', '/minha-conta/dados-complementares', formData, (res) => {
        let localSession = app.methods.localSessionAPI(), { user_account, session_token } = res;
        localSession.updateUserAccountData(user_account);
        localSession.updateSessionToken(session_token);
        self.maskComponents();
        app.sheet.close();
      }, 'preloader');
    });
  }
  
  formatInput(e) {
    let { name, value } = e.target;
    if (/endereco|cidade|estado/.test(name)) e.target.value = value.toCapitalize();
  }
  
  info(inputName) {
    let message = (inputName == 'cnpj' ? 'O CNPJ inserido deve ser válido. Este campo não é obrigatório.' : '');
    app.dialog.alert(message, 'Info');
  }
  
}

const styles = {
  page: {
    '& .item-link': {
      paddingTop: '10px',
      paddingBottom: '10px',
    }
  },
  sheet: {
    '& input': {
      fontSize: '22px !important',
      width: 'calc(100% - 30px) !important',
    },
    '& .info': {
      position: 'absolute',
      justifyContent: 'flex-end',
      display: 'flex',
      marginTop: '14.5px',
      marginRight: '27.5px',
      right: '0px',
    },
  },
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
