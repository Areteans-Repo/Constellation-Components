declare const historyData: {
    data: {
        fetchDateTime: string;
        pxObjClass: string;
        resultCount: number;
        data: ({
            pxTimeCreated: string;
            pxObjClass: string;
            pyPerformer: string;
            pxInsName: string;
            pxLongitude: null;
            pzInsKey: string;
            pxHistoryForReference: string;
            pyMessageKey: string;
            pyMemo: null;
            pxLatitude: null;
        } | {
            pxObjClass: string;
            pxTimeCreated: string;
            pyPerformer: string;
            pxInsName: string;
            pzInsKey: string;
            pxLongitude: null;
            pyMessageKey: string;
            pxHistoryForReference: string;
            pxLatitude: null;
            pyMemo: string;
        })[];
        hasMoreResults: boolean;
    };
    status: number;
    statusText: string;
    headers: {
        'content-length': string;
        'content-type': string;
    };
    request: {};
};
export default historyData;
//# sourceMappingURL=mock.d.ts.map