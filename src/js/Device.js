/**
 * Device v1.0.1
 * 5ive専用の端末判定クラス
 *
 * https://5ive.jp/
 *
 * Date: 2020-12-16
 */

import $ from 'jquery';

export class Device {
	constructor() {
		//-----[グローバル変数]
		this.ua = navigator.userAgent;
		this.document = window.document;
	}

	/**
	 * デバイス調査
	 */
	checkAll() {
		this.checkOS();
		this.checkDevice();
		this.checkBrowser();

		window.addEventListener('resize', this.onResize);
		this.onResize();
	}

	/**
	 * ブレイクポイント判定
	 */
	onResize() {
		const body = $('body');
		if (window.matchMedia('screen and (min-width:1025px)').matches) {
			if (!body.hasClass('pc') || (body.hasClass('tablet') && body.hasClass('pc'))) {
				body.removeClass('sp tablet pc').addClass('pc');
				document.querySelector("meta[name='viewport']").setAttribute('content', 'width=1100');
			}
		} else if (window.matchMedia('screen and (min-width: 768px) and (max-width: 1024px)').matches) {
			if (!body.hasClass('tablet')) {
				body.removeClass('sp tablet pc').addClass('tablet pc');
				document.querySelector("meta[name='viewport']").setAttribute('content', 'width=1100');
			}
		} else if (window.matchMedia('screen and (max-width: 767px)').matches) {
			if (!body.hasClass('sp')) {
				body.removeClass('sp tablet pc').addClass('sp');
				document.querySelector("meta[name='viewport']").setAttribute('content', 'width=device-width, initial-scale=1');
			}
		}
	}

	/**
	 * iPhoneX判定
	 */
	isIPhoneX() {
		let flag = false;
		const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
		const ratio = window.devicePixelRatio || 1;
		const screen = {
			width: window.screen.width * ratio,
			height: window.screen.height * ratio,
		};
		if (iOS && screen.width == 1125 && screen.height === 2436) {
			flag = true;
		}
		return flag;
	}

	/**
	 * デバイス判定
	 */
	checkDevice() {
		const isIpad = /iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document;
		if (isIpad === true) {
			$('body').addClass('ipad');
		}

		if ((this.ua.indexOf('iPhone') > 0 && this.ua.indexOf('iPad') === -1) || this.ua.indexOf('iPod') > 0 || (this.ua.indexOf('Android') > 0 && this.ua.indexOf('Mobile') > 0)) {
			if (this.ua.indexOf('iPod') !== -1) {
				$('body').addClass('ipod');
			} else if (this.ua.indexOf('iPhone') !== -1) {
				$('body').addClass('iphone');

				if (this.isIPhoneX() === true) {
					$('body').addClass('iphonex');
				}
			}
		}
	}

	/**
	 * OS判定
	 */
	checkOS() {
		if (this.ua.indexOf('Win') !== -1) {
			$('body').addClass('win');
		} else if (this.ua.indexOf('Mac') !== -1) {
			$('body').addClass('mac');

			//-----[OSバージョン]
			const osVersionSplit = this.ua
				.match(/\(.+?\)/)[0]
				.replace('(', '')
				.replace(')', '');
			let osVersion;
			let version;
			if (this.ua.match(/Firefox/)) {
				osVersion = osVersionSplit.split('; ')[1].split(' ');
				version = parseFloat(osVersion[osVersion.length - 1]);
			} else {
				osVersion = osVersionSplit.split(' ');
				version = parseFloat(osVersion[osVersion.length - 1].replace(/_/g, '.'));
			}
			if (version < 10.8) $('body').addClass('not_mountainlion');
		} else if (this.ua.indexOf('Android') !== -1) {
			$('body').addClass('android');
		} else if ((this.ua.indexOf('iPhone') > 0 && this.ua.indexOf('iPad') === -1) || this.ua.indexOf('iPod') > 0) {
			$('body').addClass('ios');
		}
	}

	/**
	 * ブラウザ判定
	 */
	checkBrowser() {
		if (this.ua.match(/Edge/) || this.ua.match(/Edg/)) {
			// $('body').addClass("ie");
			$('body').addClass('edge');
		} else if (this.ua.match(/Chrome/)) {
			$('body').addClass('chrome');
		} else if (this.ua.match(/MSIE/)) {
			$('body').addClass('ie');
			let appVersion = window.navigator.appVersion;
			if (appVersion.indexOf('MSIE 6.') !== -1) {
				$('body').addClass('ie6');
			} else if (appVersion.indexOf('MSIE 7.') !== -1) {
				$('body').addClass('ie7');
			} else if (appVersion.indexOf('MSIE 8.') !== -1) {
				$('body').addClass('ie8');
			} else if (appVersion.indexOf('MSIE 9.') !== -1) {
				$('body').addClass('ie9');
			} else if (appVersion.indexOf('MSIE 10.') !== -1) {
				$('body').addClass('ie10');
			}
		} else if (this.ua.match(/Trident/)) {
			$('body').addClass('ie');
			$('body').addClass('ie11');
		} else if (this.ua.match(/Firefox/)) {
			$('body').addClass('firefox');
		} else if (this.ua.match(/Safari/)) {
			if (this.ua.match(/crios/i)) {
				$('body').addClass('chrome');
			} else {
				$('body').addClass('safari');
			}
		} else if (this.ua.match(/Opera/)) {
			$('body').addClass('opera');
		}
	}
}
