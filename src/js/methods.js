export default {
	test() {
    let viewMain = $('.view-main')[0];
    console.log(viewMain);
    console.log(app.view.main);
	},
	goInitialPage() {
		let { router } = app.view.main; router.navigate('/');
		setTimeout(() => router.clearPreviousHistory(), 1000);
	},
	getCurrentViewHistory: () => app.view.current.history,
  progressbarStart: () => app.data.progressbar.visible = true,
  progressbarStop: () => app.data.progressbar.visible = false,
	preloaderStart: () => app.dialog.preloader('Processando...'),
	preloaderStop: () => app.dialog.close(),
  loadingStart: (self) => self.setState({ loading: true }),
  loadingStop: (self) => self.setState({ loading: false }),
	backPageLevel(level) {
		let view = app.views.current;
		view.router.back(view.history[level], {force:true});
	},
	localStorageAPI() {
		return {
			setData(key, data) {
				if (key && key.constructor == String && data) {
					const dataType = data.constructor;
					if (dataType == Object || dataType == Array) data = JSON.stringify(data);
					window.localStorage.setItem(key, data);
				}
			},
			getData(key) {
				if (key && key.constructor != String) return null;
				let data = window.localStorage.getItem(key);
				try { data = JSON.parse(data); } catch(err) {}
				return data;
			},
			removeData(key) {
				if (key && key.constructor == String)
				window.localStorage.removeItem(key);
			}
		};
	},
	localSessionAPI() {
		const localStorange = app.methods.localStorageAPI();
		return {
			loadData() {
				app.data.session_token = localStorange.getData('session_token');
				app.data.user_account = (localStorange.getData('user_account') || {});
			},
			open(data = {}) {
				const { session_token, user_account } = data;
				if (!session_token || !user_account) return null;
				if (session_token.constructor == String && user_account.constructor == Object) {
					localStorange.setData('session_token', session_token);
					localStorange.setData('user_account', user_account);
					this.loadData();
				}
			},
			close() {
				localStorange.removeData('session_token');
				localStorange.removeData('user_account');
				this.loadData();
				app.methods.goInitialPage();
			},
			updateSessionToken(session_token) {
				let { user_account } = app.data;
				this.open({ session_token, user_account });
			},
			updateUserAccountData(newData) {
				let self = this, { user_account } = app.data;
				if (newData && newData.constructor == Object) { // TEMPORARIO
					Object.assign(user_account, newData);
					localStorange.setData('user_account', user_account);
					this.loadData();
				} else app.dialog.alert('Sua conta foi deslogada por algum motivo desconhecido. Para mais detalhes entre em contato com o suporte.', 'Conta deslogada', () => {
					self.close();
				});
			},
			checkSession(data = {}) {
				this.loadData(); const { session_token, user_account } = app.data;
				if (session_token) data.opened({ session_token, user_account });
				else if (data.closed) data.closed();
			},
		};
	},
	logoutAccount() {
		const localSession = app.methods.localSessionAPI();
		app.dialog.create({
			title: 'Deseja mesmo sair da conta?',
			buttons: [
				{
					text: 'Sim, sair',
					onClick() {
						localSession.close();
					}
				},
				{ text: 'Cancelar' }
			]
		}).open();
	},
	validInputs(formEl, callback) {
		let buttonEnabled = jQuery(formEl).find('[type="submit"]').not('.disabled')[0];
		let validInputs = app.input.validateInputs(formEl);
		let formData = app.form.convertToData(formEl);
		if (validInputs && buttonEnabled) callback(formData);
	},
	checkConnection(data) {
		const conn = (window.cordova ? (navigator.connection.type != 'none') : navigator.onLine);
		if (conn) data.connected(); else if (data.disconnected) data.disconnected();
	},
	request(self, method, url, data, success, param, error, complete, options = {}) {
		const checkParam = (action) => (param == 'preloader' ? app.methods[param + action]() : null);
		document.activeElement.blur();
		app.methods.checkConnection({
			connected() {
				checkParam('Start');
				app.request({
					headers: { 'Authorization': 'Bearer ' + app.data.session_token },
					contentType: 'application/json',
					url: app.data.api.url + url,
					dataType: 'json',
					method,
					data,
					success(res) {
						let { text, title } = (res.message || {});
						if (res.type == 'success') success(res);
						else app.dialog.alert(text, title);
					},
					error(err) {
						console.log(err);
						let localSession = app.methods.localSessionAPI();
						if (!error) error = () => {};
						if (options.requestErrorAlert == false) error(err); else
						if (err.statusText == 'Unauthorized') {
							if ($('.panel.panel-in').length) app.panel.close('.panel.panel-in');
							if ($('.sheet-modal.modal-in').length) app.sheet.close('.sheet-modal.modal-in');
							if ($('.page-current .searchbar-enabled').length) app.searchbar.disable('.page-current .searchbar-enabled');
							app.dialog.alert('Sua conta foi logada de outro aparelho. Caso você não tenha sido o autor da nova sessão aberta, faça login em sua conta o mais rápido possível e mude sua senha. Logo após, entre em contato conosco relatando o ocorrido.', 'Sua sessão foi encerrada!', () => {
								localSession.close();
							});
							return null;
						} else app.dialog.alert('Favor, tente mais tarde ou entre em contato com o suporte.', 'Falha na aplicação!', () => error(err));
					},
					complete() {
						checkParam('Stop');
						if (complete) complete();
					}
				});
			},
			disconnected() {
				if (options.disconnectedAlert == false) return null;
				app.dialog.alert('Favor, verifique sua conexão com a internet WiFi ou dados móveis e tente novamente.', 'Sem conexão com a internet');
			}
		});
	},
	actionPanels(action) {
		setTimeout(() => {
			app.components.panelLeft[action]();
			app.components.panelRight[action]();
		}, 1000);
	},
	showPanels: () => app.methods.actionPanels('show'),
	hidePanels: () => app.methods.actionPanels('hide'),
  cadastroConcluido(tipo) {
    switch (tipo) {
      case 'vendedor': return app.data.user_account.dados_complementares;
      case 'comprador': return app.data.user_account.dados_pessoais;
    }
  },
	customizeObject(object) {
		const self = this;
		return {
			formatDate(data) {
				data.keys.forEach(key => {
					if (object[key]) object[key] = moment(object[key]).format('DD/MM/YYYY');
				});
				return self;
			}
		};
	},
	compareInputs(e, data) {
    let formEl = $(e.target).closest('form');
		let { oldData, targetAction, action } = data;
    let formData = app.form.convertToData(formEl);
    let disabledButton = true;
    Object.keys(formData).forEach(key => {
      if (oldData[key] != formData[key]) disabledButton = false;
    });
		switch (action) {
			case 'disabled': formEl.find(targetAction)[(disabledButton ? 'add' : 'remove') + 'Class']('disabled'); break;
		}
	},
	ready: (callback) => setTimeout(callback, 100),
	fileToBase64: (file) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	}),
	geolocation() {
		return {
			getMyCurrentPosition(callback) {
				navigator.geolocation.getCurrentPosition(position => {
					callback({
						lat: Number(position.coords.latitude.toFixed(7)),
						lng: Number(position.coords.longitude.toFixed(7))
					});
				}, (err) => console.log(err), {
					enableHighAccuracy: true
				});
			},
		};
	},
};

