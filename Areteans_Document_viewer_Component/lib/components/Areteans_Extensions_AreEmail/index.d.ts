/// <reference types="react" />
import type { PConnFieldProps } from './PConnProps';
interface AreteansExtensionsAreEmailProps extends PConnFieldProps {
    helperText: string;
    isTableFormatter?: boolean;
    hasSuggestions?: boolean;
    variant?: any;
    formatter: string;
}
export declare const formatExists: (formatterVal: string) => boolean;
export declare const textFormatter: (formatter: string, value: any) => any;
declare const _default: (props: AreteansExtensionsAreEmailProps) => JSX.Element;
export default _default;
//# sourceMappingURL=index.d.ts.map