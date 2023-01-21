/**
 * BarbaWrapper v1.0.2
 * 5ive専用のBarbaラッパークラス
 *
 * https://5ive.jp/
 *
 * Date: 2021-3-11
 */

import Base from './Base';
import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import { gsap, Power1, Power2, Power3, Power4, Cubic, Circ, Expo, Sine, Elastic, Back, Bounce } from 'gsap/all';

export class BarbaWrapper extends Base {
	constructor(name) {
		super(name); // スーパークラスのコンストラクターを呼び出し、name パラメータを渡す
	}

	start() {
		//-----[初回のHTTP読み込み時にbodyにnamespace属性を付与]
		const body = document.querySelector('body');
		const main = document.getElementsByTagName('main');
		body.dataset.ns = main[0].getAttribute('data-barba-namespace');

		//-----[Barbaの初期化]
		barba.use(barbaPrefetch);
		barba.init({
			debug: false,
			cacheIgnore: ['/contact/'],
			preventRunning: true, //強制リロード防止
			transitions: [
				{
					name: 'default-transition',
					sync: false, //trueにするとクロスフェードになる
					once(data) {
						//-----[bodyにnamespace属性を付与]
						const body = document.querySelector('body');
						body.dataset.ns = data.next.namespace;
					},
					leave(data) {
						return gsap.to(data.current.container, {
							opacity: 0,
							ease: Power4.easeOut,
							duration: 0.5,
						});
					},
					beforeEnter(data) {
						//-----[スクロール位置を上部に強制移動]
						data.current.container.style = 'display:none;';
						const scrollElem = document.scrollingElement || document.documentElement;
						scrollElem.scrollTop = 0;

						//-----[metaタグの書き換え]
						const target = data.next;
						const head = document.head;
						const targetHead = target.html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
						const newPageHead = document.createElement('head');
						newPageHead.innerHTML = targetHead;
						const removeHeadTags = ["meta[name='keywords']", "meta[name='description']", "meta[property^='fb']", "meta[property^='og']", "meta[name^='twitter']", "meta[name='robots']", 'meta[itemprop]', 'link[itemprop]', "link[rel='prev']", "link[rel='next']", "link[rel='canonical']"].join(',');
						const headTags = [...head.querySelectorAll(removeHeadTags)];
						headTags.forEach((item) => {
							head.removeChild(item);
						});
						const newHeadTags = [...newPageHead.querySelectorAll(removeHeadTags)];
						newHeadTags.forEach((item) => {
							head.appendChild(item);
						});

						//-----[bodyにnamespace属性を付与]
						const body = document.querySelector('body');
						body.dataset.ns = data.next.namespace;
					},
					enter(data) {
						return gsap.from(
							data.next.container,
							{
								opacity: 0,
							},
							{
								opacity: 1,
								ease: Power4.easeOut,
								duration: 0.5,
							}
						);
					},
					afterEnter(data) {},
				},
			],
		});

		//-----[同一ページの場合はページ遷移させない]
		const eventDelete = (e) => {
			if (e.currentTarget.href === window.location.href) {
				e.preventDefault();
				e.stopPropagation();
				return;
			}
		};

		const links = [...document.querySelectorAll('a[href]')];
		links.forEach((link) => {
			link.addEventListener(
				'click',
				(e) => {
					eventDelete(e);
				},
				false
			);
		});
	}

	get barba() {
		return barba;
	}

	/**
	 * @description JSでURL遷移
	 * @param {*} url　遷移先のURL
	 */
	go(url) {
		barba.go(url);
	}
}
