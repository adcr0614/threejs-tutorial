// [定数] webpack の出力オプションを指定します
// 'production' か 'development' を指定
const MODE = 'production';

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
// const ImageminPlugin = require('imagemin-webpack-plugin').default;
// const ImageminMozjpeg = require('imagemin-mozjpeg');
const path = require('path');

module.exports = {
	// モード値を production に設定すると最適化された状態で、
	// development に設定するとソースマップ有効でJSファイルが出力される
	mode: MODE,
	entry: {
		index: './src/index.js',
	},
	watchOptions: {
		ignored: /node_modules/,
	},
	// ローカル開発用環境を立ち上げる
	// 実行時にブラウザが自動的に localhost を開く
	devServer: {
		static: 'dist',
		open: true,
		// https: true,
		port: 8000,
		hot: true,
		client: {
			overlay: {
				errors: true,
				warnings: false,
			},
		},
	},
	output: {
		publicPath: '/',
		filename: 'js/[name].min.js',
		path: path.join(__dirname, 'dist'),
		// assetModuleFilename: 'img/[name][ext]',
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},

	cache: {
		type: 'filesystem',
		buildDependencies: {
			config: [__filename],
		},
	},

	plugins: [
		// new webpack.HotModuleReplacementPlugin,
		// CSSファイルを外だしにするプラグイン
		new MiniCssExtractPlugin({
			// ファイル名を設定します
			filename: 'css/style.[name].css',
		}),
		// new CopyPlugin({
		// 	patterns: [{ from: 'src/img', to: 'img' }],
		// }),
		// new ImageminPlugin({
		// 	test: /\.(jpe?g|png|gif|svg)$/i,
		// 	pngquant: {
		// 		quality: '65-80',
		// 	},
		// 	gifsicle: {
		// 		interlaced: false,
		// 		optimizationLevel: 1,
		// 		colors: 256,
		// 	},
		// 	svgo: {},
		// 	plugins: [
		// 		ImageminMozjpeg({
		// 			quality: 85,
		// 			progressive: true,
		// 		}),
		// 	],
		// }),
	],

	module: {
		rules: [
			// Sassファイルの読み込みとコンパイル
			{
				test: /\.(scss|css)/, // 対象となるファイルの拡張子
				// ローダー名
				use: [
					// CSSファイルを書き出すオプションを有効にする
					{
						loader: MiniCssExtractPlugin.loader,
					},
					// CSSをバンドルするための機能
					{
						loader: 'css-loader',
						options: {
							// オプションでCSS内のurl()メソッドを取り込む
							url: false,
							// ソースマップの利用有無
							sourceMap: enabledSourceMap,

							// 0 => no loaders (default);
							// 1 => postcss-loader;
							// 2 => postcss-loader, sass-loader
							importLoaders: 2,
						},
					},
					// Sassをバンドルするための機能
					{
						loader: 'sass-loader',
						options: {
							// ソースマップの利用有無
							sourceMap: enabledSourceMap,
						},
					},
				],
			},
			// {
			// 	// 対象となるファイルの拡張子
			// 	test: /\.(gif|png|jpe?g|eot|wof|woff|ttf|svg)$/,
			// 	// 閾値以上だったら埋め込まずファイルとして分離する
			// 	type: 'asset',
			// 	parser: {
			// 		dataUrlCondition: {
			// 			// 100KB以上だったら埋め込まずファイルとして分離する
			// 			maxSize: 100 * 1024,
			// 		},
			// 	},
			// },
			{
				// 拡張子 .js の場合
				test: /\.js$/,
				use: [
					{
						// Babel を利用する
						loader: 'babel-loader',
						// Babel のオプションを指定する
						options: {
							presets: [
								// プリセットを指定することで、ES2020 を ES5 に変換
								'@babel/preset-env',
							],
						},
					},
				],
			},
		],
	},

	// ES5(IE11等)向けの指定（webpack 5以上で必要）
	// target: ['web', 'es5'],
	target: 'web',
};
