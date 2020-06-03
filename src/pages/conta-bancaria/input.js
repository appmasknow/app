import { Page, Navbar, Block, List, ListInput, ListItem, Button, Icon, Link } from 'framework7-react';
import preset from 'jss-preset-default';
import React from 'react';
import jss from 'jss';

jss.setup(preset());

export default class extends React.Component {
  
  render() {
    let { campo } = this.state;
    return (
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)} className={stylesScoped.page}>
        <Navbar title={this.state.title} backLink="Back" />
        <form onSubmit={(e) => this.submitForm(e)} noValidate>
          <List noHairlines noHairlinesBetween>
            <ListInput outline floatingLabel
              type={campo.type}
              name={campo.name}
              label={campo.label}
              placeholder={campo.placeholder}
              inputmode={campo.inputmode}
              pattern={campo.pattern}
              required autofocus
            > {campo.type == 'select' && campo.options.map((option, index) => (
                <option key={index} value={option.value}>{option.display}</option>
              ))}
            </ListInput>
          </List>
          <Block>
            <Button type="submit" fill large className="w-100" text={campo.index == 5 ? 'Concluir' : 'Próximo'} />
          </Block>
        </form>
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'conta-bancaria-input',
      title: 'Conta bancária',
      campo: {},
    };
  }
  
  //componentDidMount() {}
  
  onPageInit() {
    let campos = [
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
    ];
    const self = this, index = Number(this.props.index);
    let formEl = jQuery(this.$f7router.currentPageEl).find('form');
    campos.forEach(campo => {
      if (campo.index == index) self.setState({ campo }, () => {
        switch (index) {
          case 1: formEl.find('[name]').mask('0000-0'); break;
          case 2: formEl.find('[name]').mask('000'); break;
          case 3: formEl.find('[name]').mask('00.000-0'); break;
        }
      });
    });
  }
  
  submitForm(e) {
    e.preventDefault();
    let { user_account } = app.data;
    const self = this, formEl = jQuery(self.$f7router.currentPageEl).find('form');
    app.methods.validInputs(formEl, (formDataInput) => {
      let { formData, index } = self.props; Object.assign(formData, formDataInput);
      let props = { formData }; index++;
      if (index < 6) self.$f7router.navigate('/conta-bancaria/input/' + index, { props }); else
      app.methods.request(self, 'post', '/conta-bancaria', formData, (res) => {
        let localSession = app.methods.localSessionAPI(), { conta_bancaria } = res;
        localSession.updateUserAccountData({ conta_bancaria });
        if (res.conta_bancaria) app.dialog.alert('Sua conta bancária foi cadastrada com sucesso!', 'Parabéns!', () => {
          app.methods.backPageLevel(1);
        });
      }, 'preloader');
    });
  }
  
}

const styles = {
  page: {
    //code
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
