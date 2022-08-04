interface friendOpts {
	icon: string;
	title: string;
	url: string;
}

export const friend_list: friendOpts[][] = [
	[
		{
			icon: './static/git/github.gif',
			title: 'GitHub',
			url: 'https://github.com/axbug/8Char-H5'
		},
		{
			icon: './static/git/gitee.gif',
			title: 'Gitee',
			url: 'https://gitee.com/yxbug/8Char-H5'
		},
		{
			icon: './static/git/coding.gif',
			title: 'Coding',
			url: 'https://yxbug-cn.coding.net/public/yixue/8Char-H5/git/files'
		}
	],
	[
		{
			icon: './static/icon/laboratory.gif',
			title: 'Web实验室',
			url: 'https://app.yxbug.cn/'
		},
		{
			icon: './static/icon/logo.svg',
			title: '作者博客',
			url: 'https://blog.yxbug.cn/'
		}
	]
];