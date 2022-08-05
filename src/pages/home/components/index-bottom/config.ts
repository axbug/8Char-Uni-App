import { GetFileUrl } from '@/tool/utils';

interface friendOpts {
	icon: string;
	title: string;
	type: string;
	url?: string;
}

interface supportListOpts {
	icon: string;
	label: string;
	color: string;
	img: string;
}

export const friendList: friendOpts[][] = [
	[
		{
			icon: GetFileUrl('static/icon/git/github.gif'),
			title: 'GitHub',
			type: 'route',
			url: 'https://github.com/axbug/8Char-H5'
		},
		{
			icon: GetFileUrl('static/icon/git/gitee.gif'),
			title: 'Gitee',
			type: 'route',
			url: 'https://gitee.com/yxbug/8Char-H5'
		},
		{
			icon: GetFileUrl('static/icon/site/logo.svg'),
			title: '作者博客',
			type: 'route',
			url: 'https://blog.yxbug.cn/'
		},
		{
			icon: GetFileUrl('static/icon/other/support.svg'),
			title: '赞助项目',
			type: 'support'
		}
	],
];

export const supportList: supportListOpts[] = [
	{
		icon: 'tmicon-alipay',
		label: '支付宝',
		color:"primary",
		img: GetFileUrl('static/icon/support/alipay.gif')
	},
	{
		icon: 'tmicon-weixinzhifu',
		label: '微信',
		color:"green",
		img: GetFileUrl('static/icon/support/wechat.gif')
	},
	{
		icon: 'tmicon-QQ',
		label: 'QQ',
		color:"primary",
		img: GetFileUrl('static/icon/support/qq.gif')
	},
	{
		icon: 'tmicon-weixin',
		label: '公众号',
		color:"green",
		img: GetFileUrl('static/icon/support/official-account.gif')
	}
];

export const supportContent: string =
	'1个手艺人需要粉丝养活，希望您能成为其中之一，我将持续更新项目以回报您的支持，赞助金将用于服务器维护和公益，赞助请备注大名，未来版本将有赞助榜，感谢您的赞助与支持！';
