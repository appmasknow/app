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
              autofocus required={campo.required}
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
      name: 'dados-complementares-input',
      title: 'Dados complementares',
      campo: {},
    };
  }
  
  //componentDidMount() {}
  
  onPageInit() {
    let campos = [
      { index: 1, type: 'text', label: 'CNPJ', name: 'cnpj', placeholder: 'Opcional', inputmode: 'numeric', info: true, required: false },
      { index: 2, type: 'text', label: 'Endereço', name: 'endereco', placeholder: 'Seu endereço', icon: 'account', required: true },
      { index: 3, type: 'text', label: 'Cidade', name: 'cidade', placeholder: 'Sua cidade', icon: 'account', required: true },
      { index: 4, type: 'text', label: 'Estado', name: 'estado', placeholder: 'Seu estádo', icon: 'account', required: true },
      { index: 5, type: 'text', label: 'CEP', name: 'cep', placeholder: 'Seu CEP', icon: 'map-legend', required: true },
    ];
    const index = Number(this.props.index);
    let formEl = jQuery(this.$f7router.currentPageEl).find('form');
    let campo = campos.find(i => i.index == index);
    this.setState({ campo }, () => {
      formEl.find('[name="cnpj"]').mask('00.000.000/0000-00'); // CNPJ
      formEl.find('[name="cep"]').mask('00000-000'); // CEP
    });
  }
  
  submitForm(e) {
    e.preventDefault();
    const index = Number(this.props.index);
    const self = this, formEl = jQuery(self.$f7router.currentPageEl).find('form');
    app.methods.validInputs(formEl, (formDataInput) => {
      let { index, formData } = this.props; Object.assign(formData, formDataInput);
      let props = { formData }; index++;
      if (index <= 5) self.$f7router.navigate(`/dados-complementares/input/${index}`, { props }); else
      app.methods.request(self, 'put', '/minha-conta/dados-complementares', formData, (res) => {
        let localSession = app.methods.localSessionAPI(), { user_account, session_token } = res;
        localSession.updateUserAccountData(user_account);
        localSession.updateSessionToken(session_token);
        app.components.panelLeft.forceUpdate();
        if (res.user_account) app.dialog.alert('Seu cadastro foi concluído com sucesso!', 'Parabéns!', () => {
          app.methods.backPageLevel(2);
        });
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
