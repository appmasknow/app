import { Page, Navbar, BlockTitle, Block, List, ListInput, ListItem, Button, Icon, Link, Sheet, Toolbar, Input, ListButton
} from 'framework7-react';
import preset from 'jss-preset-default';
import React from 'react';
import jss from 'jss';

jss.setup(preset());

export default class extends React.Component {
  
  render() {
    let { conta_bancaria, sheet } = this.state;
    return (
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} onPageReinit={this.onPageReinit.bind(this)} className={stylesScoped.page}>
        <Navbar title={this.state.title} backLink="Back" />
        {!app.data.user_account.conta_bancaria ? (
          <div>
            <BlockTitle medium className="center">Cadastre sua conta bancária!</BlockTitle>
            <Block className="text-align-center">Informe seus dados bancários para poder receber o dinheiro das vendas de suas mascaras.</Block>
            <Block>
              <Button onClick={() => this.goInput()} fill large text="Cadastrar conta bancária" />
            </Block>
          </div>
        ) : (
          <div>
            <List noHairlines noHairlinesBetween>
              <ListItem link="#" header="Agência" after="Editar" onClick={() => this.editInput(1)}>
                <Icon slot="media" className="mdi mdi-dark mdi-account"></Icon>
                <div slot="title" maskelement={1}>{conta_bancaria.agencia}</div>
              </ListItem>
              <ListItem link="#" header="Código de peração" title={conta_bancaria.cod_operacao} after="Editar" onClick={() => this.editInput(2)}>
                <Icon slot="media" className="mdi mdi-dark mdi-email"></Icon>
              </ListItem>
              <ListItem link="#" header="Conta" after="Editar" onClick={() => this.editInput(3)}>
                <Icon slot="media" className="mdi mdi-dark mdi-text-box"></Icon>
                <div slot="title" maskelement={2}>{conta_bancaria.conta}</div>
              </ListItem>
              <ListItem link="#" header="Tipo da conta" after="Editar" onClick={() => this.editInput(4)}>
                <Icon slot="media" className="mdi mdi-dark mdi-calendar-month"></Icon>
                <div slot="title" maskelement={3}>{conta_bancaria.tipo_conta}</div>
              </ListItem>
              <ListItem link="#" header="Banco" after="Editar" onClick={() => this.editInput(5)}>
                <Icon slot="media" className="mdi mdi-dark mdi-phone"></Icon>
                <div slot="title" maskelement={4}>{conta_bancaria.banco}</div>
              </ListItem>
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
                    placeholder={sheet.placeholder}
                    inputmode={sheet.inputmode}
                    pattern={sheet.pattern}
                    required
                  > {sheet.type == 'select' && sheet.options.map((option, index) => (
                      <option key={index} value={option.value}>{option.display}</option>
                    ))}
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
      name: 'conta-bancaria',
      title: 'Conta bancária',
      conta_bancaria: {},
      campos: [
        { index: 1, type: 'text', label: 'Agência', name: 'agencia', placeholder: 'Sua agência bancária', inputmode: 'numeric' },
        { index: 2, type: 'text', label: 'Código de peração', name: 'cod_operacao', placeholder: 'Operação da sua agência', inputmode: 'numeric' },
        { index: 3, type: 'text', label: 'Conta', name: 'conta', placeholder: 'Número da sua conta bancária', inputmode: 'numeric' },
        { index: 4, type: 'select', label: 'Tipo da conta', name: 'tipo_conta', options: [
          { value: 0, display: 'Conta corrente' },
          { value: 1, display: 'Conta poupança' },
        ]},
        { index: 5, type: 'select', label: 'Banco', name: 'banco', placeholder: 'Seu CPF', options: [
          { value: '5ebeaaa3ff2f652fdb3e3218', display: '001 - Banco do Brasil S.A (BB)' },
          { value: '5ebeaacdff2f652fdb3e3219', display: '104 - Caixa Econômica Federal (CEF)' },
          { value: '5ebeaaf5ff2f652fdb3e321a', display: '237 - Bradesco S.A' },
          { value: '5ebeab2bff2f652fdb3e321b', display: '033 - Banco Santander Brasil S.A' },
        ]},
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
    const self = this;
    let pageEl = jQuery(this.$f7router.currentPageEl);
    let { conta_bancaria } = JSON.clone(app.data.user_account);
    if (!conta_bancaria) return null;
    this.setState({ conta_bancaria }, () => {
      pageEl.find('[maskelement="1"]').text(conta_bancaria.agencia).unmask().mask('0000-0'); // Agência
      pageEl.find('[maskelement="2"]').text(conta_bancaria.conta).unmask().mask('00.000-0'); // Conta
      for (let campo of self.state.campos) {
        if (/4|5/.test(campo.index)) {
          let valueInput = conta_bancaria[campo.name];
          for (let option of campo.options) {
            if (option.value == valueInput) {
              let el = pageEl.find(`[maskelement="${campo.index - 1}"]`).text(option.display);
            }
          }
        }
      }
    });
  }
  
  goInput() {
    let props = { formData: {} };
    this.$f7router.navigate('/conta-bancaria/input/1', { props });
  }
  
  editInput(index) {
    const { conta_bancaria } = this.state;
    let pageEl = jQuery(this.$f7router.currentPageEl);
    let sheetEl = pageEl.find('.sheet-modal');
    for (let campo of this.state.campos) {
      if (campo.index == index) {
        let sheet = JSON.clone(campo);
        this.setState({ sheet }, () => {
          let inputEl = sheetEl.find('input, select');
          let value = conta_bancaria[campo.name];
          inputEl.val(value); switch (index) {
            case 1: inputEl.mask('0000-0'); break; // Agência
            case 3: inputEl.mask('00.000-0'); break; // Conta
          } app.sheet.open(sheetEl).once('opened', () => {
            inputEl.focus();
          }).once('closed', () => {
            inputEl.unmask();
          });
        });
        break;
      }
    }
  }
  
  submitForm(e) {
    e.preventDefault();
    let { user_account } = app.data;
    const self = this, formEl = $('.sheet-modal.modal-in').find('form');
    app.methods.validInputs(formEl, (formData) => {
      app.methods.request(self, 'put', '/conta-bancaria', formData, (res) => {
        app.sheet.close('.sheet-modal.modal-in:not(.calendar)');
        let localSession = app.methods.localSessionAPI(), { conta_bancaria } = res;
        localSession.updateUserAccountData({ conta_bancaria });
        self.maskComponents();
      }, 'preloader');
    });
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
