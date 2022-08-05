import { ComponentPublicInstance } from 'vue';

interface beforeRouterOpts {
	path: string; //当前页面路径，不含前缀 /
	opts?: any; //页面参数
	context: ComponentPublicInstance | null;
}

export const useTmRouterBefore = (arg: beforeRouterOpts): void => {};

export const useTmRouterAfter = (arg: beforeRouterOpts): void => {};
