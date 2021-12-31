import { OP_STATUS } from 'src/db/types';
import { OptionResult } from 'src/types';

export function OPResultTransformer(_opr: OptionResult) {
    const opr =  _opr;
    if (!opr.isFail) {
        return {
            status: opr.reason ? OP_STATUS.WARNING : OP_STATUS.SUCCESS,
            message: opr.reason,
        };
    }
    return {
        status: OP_STATUS.FAIL,
        message: opr.reason,
    };
}
