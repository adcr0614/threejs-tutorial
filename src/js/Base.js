/**
 * Base v1.0.1
 * 5ive専用の継承元クラス
 *
 * https://5ive.jp/
 *
 * Date: 2020-12-16
 */

export default class Base {
	constructor(name) {
		this.name = name;
	}

	speak() {
		console.log(`${this.name} makes a noise.`);
	}
}
