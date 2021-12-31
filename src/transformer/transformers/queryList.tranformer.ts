import { Transformer,ListValue, List } from '../types';

export const QueryListTransformer: Transformer<ListValue, List> = function (
    value: ListValue,
) {
    const [data, total] = value;
    return {
        data,
        total,
    };
};
