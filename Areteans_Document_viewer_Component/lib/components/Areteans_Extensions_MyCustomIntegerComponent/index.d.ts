/// <reference types="react" />
import type { PConnFieldProps } from './PConnProps';
interface AreteansExtensionsMyCustomIntegerComponentProps extends PConnFieldProps {
    displayAs?: string;
    defaultValue: number;
    isTableFormatter?: boolean;
    hasSuggestions?: boolean;
    variant?: any;
    formatter: string;
    decimalPrecision: string;
    allowDecimals: boolean;
    currencyISOCode: string;
    alwaysShowISOCode: boolean;
    additionalProps: any;
    showGroupSeparators: boolean;
    currencyDisplay: 'symbol' | 'code' | 'name' | undefined;
    negative: 'minus-sign' | 'parentheses' | undefined;
    notation: 'standard' | 'compact' | undefined;
    currencyDecimalPrecision: string;
    showInput: boolean;
    min: number;
    max: number;
    step: number;
    showTicks: boolean;
}
declare const _default: (props: AreteansExtensionsMyCustomIntegerComponentProps) => JSX.Element;
export default _default;
//# sourceMappingURL=index.d.ts.map