import '@mdi/font/css/materialdesignicons.min.css';
import jQuery from 'jquery';
import 'jquery-mask-plugin';
import numeral from 'numeral';
import 'numeral/locales';
import moment from 'moment';

export default (f7) => {
  window.app = f7;
  app.components = {};
  window.$ = app.$;
  window.jQuery = jQuery;
  window.numeral = numeral;
  numeral.locale('pt-BR');
  window.moment = moment;
  moment.locale('pt-BR');
  JSON.clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
  };
  String.prototype.toCapitalize = function() {
    return this.split(' ').map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join(' ');
  };
  //let $old_fn = {}; Object.entries(jQuery.fn).forEach(([key, value]) => $old_fn[key] = value);
  jQuery.fn.extend({
    maskPhone() {
      let SPMaskBehavior = function(val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
      },
      spOptions = {
        onKeyPress: function(val, e, field, options) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
      };
      this.each((index, el) => {
        jQuery(el).mask(SPMaskBehavior, spOptions);
      });
    }
  });
  //jQuery.expr[":"].contains = jQuery.expr.createPseudo((arg) => {
  //  return (elem) => jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
  //});
  //app.request.setup({ contentType: 'application/json' });
};

