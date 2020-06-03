import { Panel, View, Page, Navbar, Block } from 'framework7-react';
import React from 'react';

export default class extends React.Component {
  
  render() {
    return this.state.visible && (
      <Panel right reveal themeDark>
        <View>
          <Page>
            <Navbar title="Ajustes"/>
            <Block>Aqui você pode ajustar os filtros das buscas das mascaras ou vendedores por região, localização, dentre outras opções.</Block>
          </Page>
        </View>
      </Panel>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  
  componentDidMount() {
    this.$f7ready(() => {
      app.components.panelRight = this;
    });
  }
  
  show() {
    this.setState({visible: true});
  }
  
  hide() {
    this.setState({visible: false});
  }
  
}