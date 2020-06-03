import { Popup, View, Page, Navbar, NavRight, Link, Block } from 'framework7-react';
import React from 'react';

export default () => (
  <Popup id="my-popup">
    <View>
      <Page>
        <Navbar title="Popup">
          <NavRight>
            <Link popupClose>Close</Link>
          </NavRight>
        </Navbar>
        <Block>
          <p>Popup content goes here.</p>
        </Block>
      </Page>
    </View>
  </Popup>
);
