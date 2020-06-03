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
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} className={stylesScoped.page}>
        <Navbar title={this.state.title} backLink="Back" />
        {!app.data.user_account.dados_complementares ? (
          <form onSubmit={(e) => this.submitForm(e)} noValidate className="form_save">
            <List noHairlines noHairlinesBetween>
              <ListInput type="text" name="cnpj" label="CNPJ" inputmode="numeric" required outline floatingLabel autofocus>
                <Link slot="inner-end" className="info" onClick={() => this.info('cnpj')}>
                  <Icon className="mdi mdi-information fs-18" />
                </Link>
              </ListInput>
            </List>
            <Block>
              <Button type="submit" fill large className="w-100" text="Salvar" />
            </Block>
          </form>
        ) : (
          <div>
            <List noHairlines noHairlinesBetween>
              <ListItem link="#" header="CNPJ" after="Editar" onClick={() => this.editInput()}>
                <Icon slot="media" className="mdi mdi-dark mdi-text-box"></Icon>
                <div slot="title" maskelement={1}>{user_account.cnpj}</div>
              </ListItem>
            </List>
            <Sheet position="top" className={'h-auto ' + stylesScoped.sheet}>
              <Navbar title="Editar">
                <Link slot="left" sheetClose>
                  <Icon className="mdi mdi-arrow-left" />
                </Link>
              </Navbar>
              <form onSubmit={(e) => this.submitForm(e)} noValidate className="form_edit">
                <List noHairlines noHairlinesBetween className="mb-0 mt-25 list-buttons-centers">
                  <ListInput outline floatingLabel type="text" name="cnpj" label="CNPJ" inputmode="numeric" required>
                    <Link slot="inner-end" className="info" onClick={() => this.info('cnpj')}>
                      <Icon className="mdi mdi-information fs-18" />
                    </Link>
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
  //primary
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'dados-complementares',
      title: 'Dados complementares',
      user_account: {},
    };
  }
  
  //componentDidMount() {}
  
  onPageInit() {
    this.maskComponents();
  }
  
  maskComponents() {
    let pageEl = jQuery(this.$f7router.currentPageEl);
    let { user_account } = JSON.clone(app.data);
    this.setState({ user_account }, () => {
      if (user_account.dados_complementares) {
        pageEl.find('[maskelement="1"]').text(user_account.cnpj).unmask().mask('00.000.000/0000-00'); // CNPJ
      } else {
        pageEl.find('[name="cnpj"]').mask('00.000.000/0000-00');
      }
    });
  }
  
  editInput() {
    let sheetEl = jQuery(this.$f7router.currentPageEl).find('.sheet-modal');
    let value = this.state.user_account.cnpj;
    let inputEl = sheetEl.find('input');
    inputEl.val(value).mask('00.000.000/0000-00');
    app.sheet.open(sheetEl).once('opened', () => {
      inputEl.focus();
    }).once('closed', () => {
      inputEl.unmask();
    });
  }
  
  submitForm(e) {
    e.preventDefault();
    let { user_account } = app.data, edit = user_account.dados_complementares;
    const self = this, formEl = $(edit ? '.form_edit' : '.form_save');
    app.methods.validInputs(formEl, (formData) => {
      app.methods.request(self, 'put', '/minha-conta/dados-complementares', formData, (res) => {
        let localSession = app.methods.localSessionAPI(), { user_account, session_token } = res;
        localSession.updateUserAccountData(user_account);
        localSession.updateSessionToken(session_token);
        if (!edit) app.components.panelLeft.forceUpdate();
        self.maskComponents();
        app.sheet.close();
      }, 'preloader');
    });
  }
  
  info(inputName) {
    let message = '';
    switch (inputName) {
      case 'cnpj': message = 'O CNPJ informado deve ser válido.'; break;
    }
    app.dialog.alert(message, 'Info');
  }
  
}

const styles = {
  page: {
    '& .item-link': {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
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

styles.sheet = styles.page;

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
