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
        {!app.data.user_account.dados_pessoais ? (
          <div>
            <BlockTitle medium className="center">Conclua seu cadastro!</BlockTitle>
            <Block className="text-align-center">Para poder comprar e/ou vender mascaras no aplicativo conclua seu cadastro preenchendo algumas informações restantes.</Block>
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
                  <div slot="title" maskelement={i.name}>{user_account[i.name]}</div>
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
        { index: 1, type: 'text', label: 'Nome completo', name: 'nome', placeholder: 'Seu nome', pattern: '[A-Za-z\\s]+', info: true, icon: 'account' },
        { index: 2, type: 'email', label: 'E-mail', name: 'email', placeholder: 'Seu e-mail', info: true, icon: 'email' },
        { index: 3, type: 'text', label: 'CPF', name: 'cpf', placeholder: 'Seu CPF', inputmode: 'numeric', info: true, icon: 'text-box' },
        { index: 4, type: 'text', label: 'Data de nascimento', name: 'data_nascimento', placeholder: '00/00/0000', icon: 'calendar-month' },
        { index: 5, type: 'text', label: 'Telefone celular', name: 'telefone_celular', placeholder: 'Seu telefone celular', inputmode: 'numeric', icon: 'phone' },
      ],
      sheet: {}
    };
  }
  
  //componentDidMount() {}
  
  onPageInit() {
    this.maskComponents();
  }
  
  onPageReinit() {
    this.maskComponents();
  }
  
  maskComponents() {
    let pageEl = jQuery(this.$f7router.currentPageEl);
    let { user_account } = JSON.clone(app.data);
    app.methods.customizeObject(user_account).formatDate({ keys: ['data_nascimento'] });
    this.setState({ user_account }, () => {
      pageEl.find('[maskelement="cpf"]').text(user_account.cpf).unmask().mask('000.000.000-00'); // CPF
      pageEl.find('[maskelement="telefone_celular"]').text(user_account.telefone_celular).unmask().maskPhone(); // Telefone celular
    });
  }
  
  goInput() {
    let props = { formData: {} };
    this.$f7router.navigate('/dados-pessoais/input/1', { props });
  }
  
  editInput(index) {
    const { user_account } = this.state;
    let pageEl = jQuery(this.$f7router.currentPageEl);
    let sheetEl = pageEl.find('.sheet-modal');
    for (let campo of this.state.campos) {
      if (campo.index == index) {
        let sheet = JSON.clone(campo);
        this.setState({ sheet }, () => {
          let inputEl = sheetEl.find('input');
          let calendar = null, value = user_account[campo.name];
          inputEl.val(value); switch (index) {
            case 3: inputEl.mask('000.000.000-00'); break; // CPF
            case 4: inputEl.mask('00/00/0000'); break; // Data de nascimento
            case 5: inputEl.maskPhone(); break; // Telefone celular
          } app.sheet.open(sheetEl).once('opened', () => {
            if (index == 4) {
              calendar = app.calendar.create({ inputEl });
              calendar.open(); // Data de nascimento
            } inputEl.focus();
          }).once('closed', () => {
            inputEl.unmask().removeAttr('readonly');
            if (index == 4) calendar.destroy();
          });
        });
        break;
      }
    }
  }
  
  submitForm(e) {
    e.preventDefault();
    const self = this, formEl = $('.sheet-modal.modal-in').find('form');
    app.methods.validInputs(formEl, (formData) => {
      app.methods.request(self, 'put', '/minha-conta/dados-pessoais', formData, (res) => {
        app.sheet.close('.sheet-modal.modal-in:not(.calendar)');
        let localSession = app.methods.localSessionAPI(), { user_account, session_token } = res;
        localSession.updateUserAccountData(user_account);
        localSession.updateSessionToken(session_token);
        self.maskComponents();
      }, 'preloader');
    });
  }
  
  formatInput(e) {
    let { name, value } = e.target;
    switch (name) {
      case 'nome': e.target.value = value.toCapitalize(); break;
      case 'email': e.target.value = value.toLowerCase(); break;
    }
  }
  
  info(inputName) {
    let message = '';
    switch (inputName) {
      case 'nome': message = 'O nome não pode conter números, caracteres especiais como: <b>_@*</b>, entre outros.'; break;
      case 'email': message = 'O e-mail informado deve ser válido.'; break;
      case 'cpf': message = 'O CPF informado deve ser válido.'; break;
    }
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
