export interface DataItem {
	id?: number;
}

export interface BaseFormContext<
	TForm = unknown,
> {
	loading: boolean;
	providerId: number;
	pagination: {
		page: number;
		pageSize: number;
		total: number;
	};
	modal: {
		edit: boolean;
		create: boolean;
	};
	form: Partial<TForm>;
	data: TForm[];
	idToDelete: number;
}

export type BaseFormScope<
	TContext extends BaseFormContext = BaseFormContext,
	TEvent = unknown,
> = {
	context: TContext;
	event: TEvent;
};

export type Context = BaseFormContext<unknown>;

export type Scope = BaseFormScope<Context, unknown>;
