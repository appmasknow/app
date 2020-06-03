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
              onInput={(e) => {this.formatInput(e)}}
            > {campo.info && (
                <Link slot="inner-end" className="info" onClick={() => this.info(campo.name)}>
                  <Icon className="mdi mdi-information fs-18" />
                </Link>
              )}
            </ListInput>
          </List>
          <Block>
            <Button type="submit" fill large className="w-100" text={campo.index == 3 ? 'Concluir' : 'Próximo'} />
          </Block>
        </form>
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'dados-pessoais-input',
      title: 'Dados pessoais',
      campo: {},
    };
  }
  
  //componentDidMount() {}
  
  onPageInit() {
    let campos = [
      { index: 1, type: 'text', label: 'Data de nascimento', name: 'data_nascimento', placeholder: '00/00/0000' },
      { index: 2, type: 'text', label: 'Telefone celular', name: 'telefone_celular', placeholder: 'Seu telefone celular', inputmode: 'numeric' },
      { index: 3, type: 'text', label: 'CPF', name: 'cpf', placeholder: 'Seu CPF', inputmode: 'numeric', info: true },
    ];
    const self = this, index = Number(this.props.index);
    let formEl = jQuery(self.$f7router.currentPageEl).find('form');
    campos.forEach(campo => {
      if (campo.index == index) self.setState({ campo }, () => {
        switch (index) {
          case 1:
            let inputEl = formEl.find('[name="data_nascimento"]');
            let calendar = app.calendar.create({ inputEl });
            calendar.open();
            break;
          case 2: formEl.find('[name="telefone_celular"]').maskPhone(); break;
          case 3: formEl.find('[name="cpf"]').mask('000.000.000-00'); break;
        }
      });
    });
  }
  
  submitForm(e) {
    e.preventDefault();
    const index = Number(this.props.index);
    const self = this, formEl = jQuery(self.$f7router.currentPageEl).find('form');
    app.methods.validInputs(formEl, (formData) => {
      Object.assign(formData, this.props.formData);
      let props = { formData };
      switch (index) {
        case 1: if (formEl.find('input').val() != '') self.$f7router.navigate('/dados-pessoais/input/2', { props }); else
          app.dialog.alert('Favor, selecione sua data de nascimento para prosseguir.', 'Campo obrigatório');
          break;
        case 2: self.$f7router.navigate('/dados-pessoais/input/3', { props }); break;
        case 3:
          app.methods.request(self, 'put', '/minha-conta/dados-pessoais', formData, (res) => {
            let localSession = app.methods.localSessionAPI(), { user_account, session_token } = res;
            localSession.updateUserAccountData(user_account);
            localSession.updateSessionToken(session_token);
            app.components.panelLeft.forceUpdate();
            if (res.user_account) app.dialog.alert('Seu cadastro foi concluído com sucesso!', 'Parabéns!', () => {
              app.methods.backPageLevel(2);
            });
          }, 'preloader');
          break;
      }
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
  }
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
