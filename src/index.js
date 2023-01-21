'use strict';

//-----[JSの読み込み]
import $ from 'jquery';
import { gsap, Power1, Power2, Power3, Power4, Cubic, Circ, Expo, Sine, Elastic, Back, Bounce, Quart } from 'gsap/all';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper, { Navigation, Pagination, Mousewheel, Autoplay } from 'swiper';
import Cookies from 'js-cookie';
import { Device } from './js/Device';
import { Utils } from './js/Utils';
import { BarbaWrapper } from './js/BarbaWrapper';

import 'swiper/css/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './css/style.scss';

//-----[初期設定]
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
Swiper.use([Navigation, Pagination, Mousewheel, Autoplay]);
Utils.setSign(true);

//-----[グローバル変数]
const _gtagID = '*****';
let _stageW = 0;
let _stageH = 0;
let _bw = null;
let _ns = null;

/**
 * DOMの読み込み完了
 */
$(function () {
	onResize();

	//-----[デバイス調査]
	const d = new Device();
	d.checkAll();

	//-----[Barba.jsの初期化]
	_bw = new BarbaWrapper();
	_bw.start();

	//-----[Barbaのページ遷移イベント]
	_bw.barba.hooks.once((e) => {
		// console.log('フック once', e);
		_ns = e.next.namespace;
		initPage();
	});

	_bw.barba.hooks.beforeLeave((e) => {
		// console.log('フック beforeLeave', e);
	});

	_bw.barba.hooks.leave((e) => {
		// console.log('フック leave', e);
	});

	_bw.barba.hooks.beforeEnter((e) => {
		// console.log('フック beforeEnter', e);
		_ns = e.next.namespace;
		initPage();
		showMenu(false);
	});

	_bw.barba.hooks.enter((e) => {
		// console.log('フック enter', e);

		//-----[GoogleAnalyticsの計測]
		if (typeof ga === 'function') {
			ga('set', 'page', window.location.pathname);
			ga('send', 'pageview');
		}
		if (typeof gtag === 'function') {
			gtag('config', _gtagID, { page_path: location.pathname });
		}
	});

	_bw.barba.hooks.afterEnter((e) => {
		// console.log('フック afterEnter', e);
	});

	_bw.barba.hooks.after((e) => {
		// console.log('フック after');
	});

	//-----[メニュー]
	$('.menu').on({
		click: function () {
			if ($('.gnav_container').css('display') === 'none') {
				showMenu(true);
			} else {
				showMenu(false);
			}
		},
	});
});

/**
 * 全データの読み込み完了
 */
window.onload = () => {};

/**
 * 各ページの初期化
 */
function initPage() {
	console.log('initPage=', _ns);
	onScroll();
	onResize();
	activateNavi();

	//-----[スムーズスクロール]
	$('.smooth_scroll').on({
		click: function () {
			var href = $(this).attr('href');
			var target = $(href === '#' || href === '' ? 'html' : href);
			gsap.to(window, { scrollTo: { y: target, offsetY: 0 }, duration: 1.85, ease: Cubic.easeInOut });
			return false;
		},
	});

	//-----[アコーディオン]
	if ($('.accordion_list').length) {
		Utils.setAccordion('.accordion_list', 0.2);
	}

	//-----[パララックス]
	if ($('.parallax_container').length) {
		Utils.setParallax('.parallax_container', 100, 1.2);
	}

	//-----[各ページの初期化]
	if (_ns === 'top_page') {
		const swiper = new Swiper('.swiper', {
			loop: true,
			speed: 400,
			spaceBetween: 10,
			autoplay: {
				delay: 3000,
			},
			pagination: {
				el: '.swiper-pagination',
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		});
	} else if (_ns === 'about_page') {
		console.log('this is about page!');
	}
}

/**
 * メニューの表示
 */
function showMenu(flg) {
	if (flg === true) {
		$('.menu').addClass('open');
		gsap.fromTo(
			'.gnav_container',
			{
				opacity: 0,
				display: 'block',
			},
			{
				opacity: 1,
				ease: Cubic.easeOut,
				duration: 0.32,
			}
		);
	} else {
		$('.menu').removeClass('open');
		gsap.to('.gnav_container', {
			opacity: 0,
			ease: Cubic.easeInOut,
			duration: 0.32,
			onComplete: function () {
				$('.gnav_container').css({ display: 'none' });
			},
		});
	}
}

/**
 * ナビのアクティブ化
 */
function activateNavi() {
	if (_ns === 'about_page') {
		$('#menu-item-xxx > a').addClass('active');
	} else {
		$('#menu-item-xxx > a').removeClass('active');
	}
}

/**
 * スクロール
 */
$(window).on('scroll', function () {
	onScroll();
});

function onScroll() {
	var top = $(window).scrollTop();

	//-----[フェードイン処理]
	if ($('.fade_container').length) {
		Utils.setScrollInFade($('.fade_container'), top, 0.22, 100);
	}
}

/**
 * リサイズ
 */
$(window).on('resize', function () {
	onResize();
});
function onResize() {
	if ($('body').hasClass('sp')) {
		_stageW = window.innerWidth;
		_stageH = window.innerHeight;
		// _stageW = screen.width;
		// _stageH = screen.height;
	} else {
		_stageW = $(window).width();
		_stageH = $(window).height();
	}

	//-----[全画面フィット]
	if ($('.fullscreen').length) {
		Utils.setFullScreen($('.fullscreen iframe'), _stageW, _stageH, 850, 395);
	}
}
