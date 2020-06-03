import { Block, Chip } from 'framework7-react';
import React from 'react';

import ReactHtmlParser from 'react-html-parser';

import Lottie from 'react-lottie';
import ad1 from './../static/status-compra-chat-1.json';
import ad2 from './../static/status-compra-chat-2.json';
import ad3 from './../static/status-compra-chat-3.json';

function status(compra) {
  let text = null, animationData = null, statusNumber = null, { vendedor, comprador } = compra;
  let souVendedor = (app.data.user_account._id == compra.vendedor._id);
  if (compra.data_recusacao_vendedor) { text = (souVendedor ? 'Venda recusada por mim!' : 'Desculpe, o vendedor recusou sua compra!');
    animationData = ad2; statusNumber = 1;
  } else if (compra.data_cancelamento) { text = (souVendedor ? 'Venda' : 'Compra') + ' cancelada ' + (souVendedor && compra.cancelado_por == 'vendedor' || !souVendedor && compra.cancelado_por == 'comprador' ? 'por mim!' : `pelo ${compra.cancelado_por}!`);
    animationData = ad2; statusNumber = 2;
  } else if (compra.data_confirmacao_vendedor) { text = (souVendedor ? `Fique a vontade para trocar mensagens com ${comprador.nome}` : `Sua compra foi confirmada! Fique a vontade para trocar mensagens com o ${vendedor.nome}`);
    animationData = ad3; statusNumber = 3;
  } else { text = 'Aguarde o vendedor confirmar sua compra!'; animationData = ad1; statusNumber = 4; }
  return { text, animationData, statusNumber };
}

export default (props) => {
  let { text, animationData, statusNumber } = status(props.compra);
  return (
    <Block className="center fd-collumn" style={{ height: '100vh' }}>
      <div className={statusNumber == 4 ? '-ml-50' : statusNumber == 3 ? 'w-200px h-200px' : 'w-150px h-150px'}>
        <Lottie options={{ loop: true, autoplay: true, animationData }} />
      </div>
      <div style={{
        position: 'absolute', bottom: '0px', textAlign: 'center', width: 'calc(100% - 60px)',
        backgroundColor: '#E0E0E0', padding: '10px', borderRadius: '10px',
      }}>{ReactHtmlParser(text)}</div>
    </Block>
  );
}

