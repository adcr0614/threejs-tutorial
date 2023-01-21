/**
 * Utils v1.0.2
 * 5ive専用の便利クラス
 *
 * https://5ive.jp/
 *
 * Date: 2022-6-22
 */

import $ from 'jquery';
import { gsap, Power1, Power2, Power3, Power4, Cubic, Circ, Expo, Sine, Elastic, Back, Bounce, Quart } from 'gsap/all';

export class Utils {
	constructor() {
		//-----[グローバル変数]
		this.member = 'メンバー変数';
		this.stageW = 0;
		this.stageH = 0;
	}

	/**
	 * @description シグネチャの追加
	 * @static
	 * @param {boolean} [sign=true]
	 */
	static setSign(sign = true) {
		if (sign === true) {
			if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
				const args = ['\n %c Developed by 5ive Inc. -> https://5ive.jp/ \n\n', 'background: #0000FF; padding:5px 0;color: #ffffff;'];
				window.console.log.apply(console, args);
			} else if (window.console) {
				window.console.log('Developed by 5ive Inc. -> https://5ive.jp/');
			}
		}
	}

	/**
	 * @description パララックス
	 * @static
	 * @param {*} [container=null]
	 * @param {number} [distance=100]
	 * @param {number} [scrub=2]
	 */
	static setParallax(container = null, distance = 100, scrub = 1.2) {
		const targets = document.querySelectorAll(container);
		targets.forEach((target) => {
			gsap.fromTo(
				target.querySelector('.parallax'),
				{
					y: 0,
				},
				{
					y: -distance,
					ease: 'none',
					scrollTrigger: {
						trigger: target,
						start: 'top bottom',
						end: 'bottom top',
						scrub: scrub,
						// markers: true
					},
				}
			);
		});
	}

	/**
	 * @description スクロールイン時にフェードインで表示
	 * @static
	 * @param {*} [container=null]
	 * @param {number} [threshold=0.2]
	 * @param {number} [distance=100]
	 */
	static setScrollInFade(container = null, top = 0, threshold = 0.2, distance = 100) {
		if ($('body').hasClass('sp')) {
			Utils.stageW = window.innerWidth;
			Utils.stageH = window.innerHeight;
		} else {
			Utils.stageW = $(window).width();
			Utils.stageH = $(window).height();
		}

		container.each(function (index, el) {
			let elm = $(el);
			let elmY = elm.offset().top;
			let elmH = elm.height();
			let delayHeight = -Utils.stageH * threshold;

			if ($('body').hasClass('sp')) {
				distance = distance * 0.5;
			}

			if (top >= elmY - Utils.stageH - delayHeight && top <= elmY + elmH - delayHeight) {
				if (elm.css('opacity') === '0') {
					gsap.fromTo(
						elm,
						{
							opacity: 0,
							y: distance,
						},
						{
							opacity: 1,
							y: 0,
							ease: Cubic.easeOut,
							duration: 0.45,
						}
					);
				}
			}
		});
	}

	/**
	 * @description アコーディオン
	 * @static
	 * @param {*} [elm=null]
	 * @param {number} [time=300]
	 */
	static setAccordion(elm = null, time = 0.3) {
		elm = $(elm + ' dt');
		elm.on('click', function () {
			$(this)
				.next()
				.slideToggle(time * 1000);
			$(this).toggleClass('open');
		});
	}

	/**
	 * @description 要素を全画面にフィット
	 * @static
	 * @param {number} [stageW=0]
	 * @param {number} [stageH=0]
	 * @param {number} [targetW=0]
	 * @param {number} [targetH=0]
	 */
	static setFullScreen(elm = null, stageW = 0, stageH = 0, targetW = 1600, targetH = 1200) {
		let ratio = getRatio(stageW, stageH, targetW, targetH);
		let elmX = -parseInt((targetW * ratio) / 2);
		let elmY = -parseInt((targetH * ratio) / 2);
		elm.css({
			width: targetW * ratio,
			height: targetH * ratio,
			transform: 'translate3d(' + elmX + 'px, ' + elmY + 'px, 0px)',
		});
	}

	/**
	 * @description 縦横比を取得
	 * @static
	 * @param {number} [stageW=0]
	 * @param {number} [stageH=0]
	 * @param {number} [originalW=0]
	 * @param {number} [originalH=0]
	 * @returns {*}
	 */
	static getRatio(stageW = 0, stageH = 0, originalW = 0, originalH = 0) {
		if (stageH / stageW < originalH / originalW) return stageW / originalW;
		else return stageH / originalH;
	}

	/**
	 * @description 配列のシャッフル
	 * @static
	 * @param {*} [ary=Array()]
	 * @returns {*}
	 */
	static getShuffle(ary = Array()) {
		let n = array.length,
			t,
			i;
		while (n) {
			i = Math.floor(Math.random() * n--);
			t = array[n];
			array[n] = array[i];
			array[i] = t;
		}
		return array;
	}

	/**
	 * @description URL文字列からパラメータを取得
	 * @static
	 * @param {string} [key='']
	 * @param {string} [url='']
	 * @returns {*}
	 */
	static getParam(key = '', url = '') {
		if (!url) url = window.location.href;
		key = key.replace(/[\[\]]/g, '\\$&');
		let regex = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	/**
	 * @description 連想配列をキーで並び替え
	 * @static
	 * @param {*} [ary=Array()]
	 * @param {string} [key='']
	 * @param {string} [order='asc']
	 */
	static objArraySort(ary = Array(), key = '', order = 'asc') {
		let reverse = 1;
		if (order && order.toLowerCase() == 'desc') reverse = -1;
		ary.sort(function (a, b) {
			if (a[key] < b[key]) return -1 * reverse;
			else if (a[key] == b[key]) return 0;
			else return 1 * reverse;
		});
	}

	/**
	 * @description 連想配列を複数キーで並び替え
	 * @static
	 * @param {*} [ary=Array()]
	 * @param {string} [key1='']
	 * @param {string} [order1='asc']
	 * @param {string} [key2='']
	 * @param {string} [order2='asc']
	 */
	static objArraySort2(ary = Array(), key1 = '', order1 = 'asc', key2 = '', order2 = 'asc') {
		let reverse1 = 1;
		let reverse2 = 1;
		if (order1 && order1.toLowerCase() == 'desc') reverse1 = -1;
		if (order2 && order2.toLowerCase() == 'desc') reverse2 = -1;

		ary.sort(function (a, b) {
			// Compare 1st key
			if (a[key1] < b[key1]) return -1 * reverse1;
			else if (a[key1] > b[key1]) return 1 * reverse1;
			else {
				// Compare 2nd key
				if (a[key2] < b[key2]) return -1 * reverse2;
				else if (a[key2] > b[key2]) return 1 * reverse2;
				else return 0;
			}
		});
	}
}
