import { Transformer } from './types';

function isIterate(v) {
    return (
        v !== null && typeof v === 'object' && v[Symbol.iterator] === 'function'
    );
}

export class TStream {
    private v: any;
    constructor(value) {
        this.v = value;
    }
    get value() {
        return this.v;
    }
    set(value) {
        this.v = value;
    }
    use(transformer: Transformer<any, any>, options?: { property: string }) {
        if (options) {
            this.v[options.property] = transformer(this.v[options.property]);
            return this;
        }
        this.v = transformer(this.v);
        return this;
    }
    map(transformer: Transformer<any, any>, options?: { property: string }) {
        if (options) {
            if (!isIterate(this.v[options.property])) {
                const newProp = [];
                for (let e of this.v[options.property]) {
                    newProp.push(transformer(e));
                }
                this.v[options.property] = newProp;
                return this;
            } else {
                throw new TypeError(
                    `the property ${options.property} must be iteratable`,
                );
            }
        }
        if (isIterate(this.v)) {
            for (let e of this.v[options.property]) {
                e = transformer(e);
            }
            return this;
        } else {
            throw new TypeError(`the meta data is not iteratable`);
        }
    }
}
