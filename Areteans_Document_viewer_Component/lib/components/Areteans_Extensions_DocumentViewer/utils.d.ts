export declare const getArrayFromString: (listString: string) => any[];
export declare const binaryToArrayBuffer: (binaryString: string) => Uint8Array;
export declare const base64ToArrayBuffer: (base64: string) => Uint8Array;
export declare const isContentBinary: (headers: any) => any;
export declare const isContentBase64: (headers: any) => any;
export declare const downloadBlob: (arrayBuf: any, name: string, mimeType: string) => void;
export declare const canPreviewFile: (type: string) => boolean;
export declare const downloadFile: (attachment: any, getPConnect: any, setImages: any, bForceDownload: boolean) => void;
type AddAttachmentProps = {
    currentCategory: string;
    attachment: any;
    listOfAttachments: any;
    getPConnect: any;
    setImages?: any;
    useLightBox?: boolean;
    setElemRef: any;
};
export declare const addAttachment: (props: AddAttachmentProps) => Promise<void>;
export {};
//# sourceMappingURL=utils.d.ts.map