import { Page, Navbar, Messagebar, Link, MessagebarAttachments, MessagebarAttachment, MessagebarSheet, MessagebarSheetImage, Messages,
MessagesTitle, Message, Icon, NavRight, Popover, List, ListItem, NavLeft, NavTitle, Block, Chip
} from 'framework7-react';
import preset from 'jss-preset-default';
import FadeIn from 'react-fade-in';
import React from 'react';
import jss from 'jss';

import io from 'socket.io-client';

import StatusCompraChat from '../components/StatusCompraChat';

jss.setup(preset());

export default class extends React.Component {
  
  //<MessagesTitle><b>Segunda, Fev 9,</b> 12:58</MessagesTitle>
  //<ListItem link="#" popoverClose title="Denunciar comprador" />
  
  render() {
    return (
      <Page name={this.state.name} onPageInit={this.onPageInit.bind(this)}>
        
        <Navbar>
          <NavLeft>
            <Link className="back pr-0">
              <Icon className="mdi mdi-arrow-left mr-10"></Icon>
              <FadeIn>
                <div className="foto-capa lazy lazy-fade-in" style={{
                  backgroundImage: 'url(' + this.photoProfile()  + ')',
                  width: '40px', height: '40px'
                }}></div>
              </FadeIn>
            </Link>
          </NavLeft>
          <NavTitle sliding>{this.title()}</NavTitle>
          {this.props.compra.data_recusacao_vendedor || this.props.compra.data_cancelamento ? null : (
            <NavRight>
              <Link popoverOpen=".popover">
                <Icon className="mdi mdi-dots-vertical" />
              </Link>
            </NavRight>
          )}
        </Navbar>
        
        <Messagebar
          className={!this.props.compra.data_confirmacao_vendedor || this.props.compra.data_cancelamento ? 'disabled' : ''}
          placeholder="Mensagem"
          ref={(el) => {this.messagebarComponent = el}}
        > <Link slot="inner-end" onClick={this.sendMessage.bind(this)}>
            <Icon className="mdi mdi-dark mdi-send"></Icon>
          </Link>
        </Messagebar>
        
        <Messages ref={(el) => {this.messagesComponent = el}}>
          
          <StatusCompraChat compra={this.props.compra} />
          
          {this.state.messagesData.map((message, index) => (
            <Message
              key={index}
              type={message.type}
              image={message.image}
              name={message.name}
              avatar={message.avatar}
              first={this.isFirstMessage(message, index)}
              last={this.isLastMessage(message, index)}
              tail={this.isTailMessage(message, index)}
            > {message.text && (
                <span slot="text" dangerouslySetInnerHTML={{__html: message.text}} />
              )}
            </Message>
          ))}
          {this.state.typingMessage && (
            <Message
              type="received"
              typing={true}
              first={true}
              last={true}
              tail={true}
              header={`${this.state.typingMessage.name} está digitando`}
              avatar={this.state.typingMessage.avatar}
            ></Message>
          )}
        </Messages>
        
        <Popover>
          {app.data.user_account._id == this.props.compra.vendedor._id ? ( // vendedor
            <List noChevron>
              <ListItem onClick={() => this.cancelar('venda')} link="#" popoverClose title="Cancelar venda" className="text-color-red" />
            </List>
          ) : app.data.user_account._id == this.props.compra.comprador._id ? ( // comprador
            <List noChevron>
              <ListItem onClick={() => this.cancelar('compra')} link="#" popoverClose title="Cancelar compra" className="text-color-red" />
            </List>
          ) : null}
        </Popover>
        
      </Page>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      name: 'chat',
      typingMessage: null,
      responseInProgress: false,
      messagesData: [],
      people: [],
    }
  }
  
  tipoUsuario() { // tipo do usuário logado no app
    let { user_account } = app.data, { vendedor } = this.props.compra;
    return (user_account._id == vendedor._id ? 'vendedor' : 'comprador');
  }
  
  tipoOutroUsuario() { // o outro usuário da conversa no chat
    return (this.tipoUsuario() == 'vendedor' ? 'comprador' : 'vendedor');
  }
  
  title() {
    return this.props.compra[ this.tipoOutroUsuario() ].nome;
  }
  
  photoProfile() {
    return (this.props.compra[ this.tipoOutroUsuario() ].foto_perfil || app.data.photo_profile);
  }
  
  onPageInit() {
    
    console.log(this.props.compra);
    
    this.initializeWebSocket();
    const self = this;
    self.$f7ready(() => {
      self.messagebar = self.messagebarComponent.f7Messagebar;
      self.messages = self.messagesComponent.f7Messages;
    });
  }
  
  initializeWebSocket() {
    const self = this;
    let { compraID } = this.props;
    const socket = io(app.data.api.url, {
      transportOptions: {
        polling: {
          extraHeaders: {
            'Authorization': 'Bearer ' + app.data.session_token
          }
        }
      },
      query: { compraID }
    });
    self.setState({ socket });
    socket.on('previousMessages', messages => {
      for (let message of messages) {
        self.renderMessage(message);
      }
    });
    socket.on('receivedMessage', message => {
      self.renderMessage({
        ...message,
        type: 'received',
        name: 'Daelton Dias'
      });
    });
  }
  
  renderMessage(message) {
    this.state.messagesData.push(message);
    this.forceUpdate();
  }
  
  sendMessage() {
    const self = this, { socket } = self.state;
    const text = self.messagebar.getValue().replace(/\n/g, '<br>').trim();
    if (text.length === 0) return;
    self.state.messagesData.push({ text });
    self.messagebar.clear();
    self.messagebar.focus();
    self.forceUpdate();
    socket.emit('sendMessage', { text });
  }
  
  isFirstMessage(message, index) {
    const self = this;
    const previousMessage = self.state.messagesData[index - 1];
    if (message.isTitle) return false;
    if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
    return false;
  }
  
  isLastMessage(message, index) {
    const self = this;
    const nextMessage = self.state.messagesData[index + 1];
    if (message.isTitle) return false;
    if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
    return false;
  }
  
  isTailMessage(message, index) {
    const self = this;
    const nextMessage = self.state.messagesData[index + 1];
    if (message.isTitle) return false;
    if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
    return false;
  }
  
  cancelar(param) {
    const self = this, compraID = this.props.compra._id;
    app.dialog.create({
      title: `Deseja mesmo cancelar essa ${param}?`,
      buttons: [
        {
          text: 'Sim, cancelar', color: 'red',
          onClick: () => app.methods.request(self, 'put', `/compras/${compraID}/cancelar`, null, () => {
            if (self.tipoUsuario() == 'vendedor') app.methods.backPageLevel(1); else app.methods.backPageLevel(0);
          }, 'preloader'),
        },
        { text: 'Não' }
      ]
    }).open();
  }
  
};

const styles = {
  //code
};

const stylesScoped = jss.createStyleSheet(styles).attach().classes;
