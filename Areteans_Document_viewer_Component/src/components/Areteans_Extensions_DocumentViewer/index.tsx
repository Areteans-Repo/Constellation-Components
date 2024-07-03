import { useCallback, useEffect, useState } from 'react';
import {
  // getKindFromMimeType,
  getMimeTypeFromFile,
  withConfiguration
} from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';

import StyledAreteansExtensionsDocumentViewerWrapper from './styles';
import { base64ToArrayBuffer, getArrayFromString, isContentBinary } from './utils';

// interface for props
interface AreteansExtensionsDocumentViewerProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  header: string;
  height: string;
  width: string;
  useAttachmentEndpoint?: boolean;
  categories?: string;
  docLinkList?: string;
}

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function AreteansExtensionsDocumentViewer(props: AreteansExtensionsDocumentViewerProps) {
  const {
    getPConnect,
    header,
    width,
    height,
    docLinkList = '',
    useAttachmentEndpoint = true,
    categories = ''
  } = props;
  const pConn = getPConnect();
  // const [history, setHistory] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const caseProp: string = PCore.getConstants().CASE_INFO.CASE_INFO_ID;
  const caseID = pConn.getValue(caseProp, '');
  // const context = pConn.getContextName();
  const docListArray = getArrayFromString(docLinkList);
  // const [attachments, setAttachments] = useState<Array<SummaryListItem>>([]);
  // const [files, setFiles] = useState<Array<any>>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [elemRef, setElemRef] = useState<HTMLElement>();

  const [attachmentBlob, setAttachmentBlob] = useState<Array<any>>([]);

  //  document viewer urls
  // const docs = [
  //   { uri: require('./assets/desgin.jpeg') },
  //   { uri: require('./assets/__LTA Reimbursement__.pdf') } // Local File
  // ];

  // const columns = [
  //   { renderer: 'date', label: pConn.getLocalizedValue('Date', '', '') },
  //   { renderer: 'description', label: pConn.getLocalizedValue('Description', '', '') },
  //   { renderer: 'user', label: pConn.getLocalizedValue('Performed by', '', '') }
  // ];

  // useEffect(() => {
  //   // @ts-ignore
  //   const payload = { dataViewParameters: [{ CaseInstanceKey: caseID }] };
  //   PCore.getDataApiUtils()
  //     // @ts-ignore
  //     .getData('D_pyWorkHistory', payload, context)
  //     // @ts-ignore
  //     .then(response => {
  //       console.log(response);
  //       // setIsLoading(false);
  //       // if (response.data.data !== null) {
  //       // setHistory(
  //       //   response.data.data.map((entry: any, index: number) => {
  //       //     return {
  //       //       date: new Date(entry.pxTimeCreated).toLocaleString(),
  //       //       description: <Text style={{ wordBreak: 'break-word' }}>{entry.pyMessageKey}</Text>,
  //       //       user: entry.pyPerformer,
  //       //       id: index
  //       //     };
  //       //   })
  //       // );
  //       // } else {
  //       // setHistory([]);
  //       // }
  //     })
  //     .catch(() => {
  //       // setHistory([]);
  //       // setIsLoading(false);
  //     });
  // }, [caseID, context]);

  const loadAttachments = useCallback(
    (response: Array<any> = []) => {
      const listOfAttachments: Array<any> = [];
      const listOfFiles: Array<any> = [];
      const listOfCategories = categories.split(',');
      const listOfBlobFiles: Array<any> = [];
      response.forEach((attachment: any) => {
        const currentCategory = attachment.category?.trim() || attachment.pyCategory?.trim();
        if (useAttachmentEndpoint) {
          /* Filter the attachment categories */
          if (categories && listOfCategories.length > 0) {
            let isValidCategory = false;
            listOfCategories.forEach((categoryVal: string) => {
              if (currentCategory.toLocaleLowerCase() === categoryVal.trim().toLocaleLowerCase()) {
                isValidCategory = true;
              }
            });
            if (!isValidCategory) return;
          }
        } else {
          attachment = {
            ...attachment,
            category: attachment.pyCategory,
            name: attachment.pyMemo,
            ID: attachment.pzInsKey,
            type: attachment.pyFileCategory,
            fileName: attachment.pyFileName,
            mimeType: attachment.pyTopic,
            categoryName: attachment.pyLabel,
            createTime: attachment.pxCreateDateTime,
            createdByName: attachment.pxCreateOpName
          };
        }
        attachment.mimeType = getMimeTypeFromFile(
          attachment.fileName || attachment.nameWithExt || ''
        );
        if (!attachment.mimeType) {
          if (attachment.category === 'Correspondence') {
            attachment.mimeType = 'text/html';
            attachment.extension = 'html';
          } else {
            attachment.mimeType = 'text/plain';
          }
        }
        listOfFiles.push(attachment);
        // addAttachment({
        //   currentCategory,
        //   attachment,
        //   listOfAttachments,
        //   getPConnect,
        //   setElemRef
        // });

        // here we call api to get results here
        // const kind = getKindFromMimeType(attachment.mimeType);

        (window as any).PCore.getAttachmentUtils()
          .downloadAttachment(
            attachment.ID,
            getPConnect().getContextName(),
            attachment.responseType
          )
          .then((content: any) => {
            // if (canPreviewFile(kind)) {
            let arrayBuf: Uint8Array | BlobPart;
            if (isContentBinary(content.headers)) arrayBuf = content.data;
            else arrayBuf = base64ToArrayBuffer(content.data);
            const blob = new Blob([arrayBuf], { type: attachment.mimeType });
            const fileURL = URL.createObjectURL(blob);
            listOfBlobFiles.push({
              uri: fileURL,
              fileData: arrayBuf,
              fileType: attachment.mimeType
            });
            setAttachmentBlob([...listOfBlobFiles, ...docListArray]);
            // }
          });
      });
      console.log('listoffiles', listOfFiles);
      console.log('listOfAttachments', listOfAttachments);

      // setFiles(listOfFiles);
      // setAttachments(listOfAttachments);
      // setLoading(false);
    },
    [categories, getPConnect, useAttachmentEndpoint] // eslint-disable-line
  );

  const initialLoad = useCallback(() => {
    // const pConn = getPConnect();
    if (useAttachmentEndpoint) {
      const attachmentUtils = (window as any).PCore.getAttachmentUtils();
      // const caseID = pConn.getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
      attachmentUtils
        .getCaseAttachments(caseID, pConn.getContextName())
        .then((resp: any) => {
          loadAttachments(resp);
        })
        .catch(() => {
          // setLoading(false);
        });
    } else {
      const CaseInstanceKey = pConn.getValue(
        (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID
      );
      const payload = {
        dataViewParameters: [{ LinkRefFrom: CaseInstanceKey }]
      };
      (window as any).PCore.getDataApiUtils()
        .getData('', payload, pConn.getContextName())
        .then((response: any) => {
          console.log('attachement getDataapi ', response);
          if (response.data.data !== null) {
            loadAttachments(response.data.data);
          } else {
            // setLoading(false);
          }
        })
        .catch(() => {
          // setLoading(false);
        });
    }
  }, [loadAttachments, useAttachmentEndpoint]); // eslint-disable-line

  /* Subscribe to changes to the assignment case */
  useEffect(() => {
    // const caseID = getPConnect().getValue(
    //   (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID
    // );
    const filter = {
      matcher: 'ATTACHMENTS',
      criteria: {
        ID: caseID
      }
    };
    const attachSubId = (window as any).PCore.getMessagingServiceManager().subscribe(
      filter,
      () => {
        /* If an attachment is added- force a reload of the events */
        initialLoad();
      },
      getPConnect().getContextName()
    );
    return () => {
      (window as any).PCore.getMessagingServiceManager().unsubscribe(attachSubId);
    };
  }, [categories, useAttachmentEndpoint, getPConnect, initialLoad]); // eslint-disable-line

  useEffect(() => {
    initialLoad();
  }, [categories, useAttachmentEndpoint, initialLoad]);

  return (
    <StyledAreteansExtensionsDocumentViewerWrapper>
      {/* <Table
      title={pConn.getLocalizedValue(label, '', '')}
      columns={columns}
      data={history}
      loading={isLoading}
      loadingMessage={pConn.getLocalizedValue('Loading case history', '', '')}
    /> */}
      {/* {loading} */}

      <div style={{ width, height }}>
        <h3 style={{ marginBottom: '20px' }}>{header}</h3>
        <DocViewer documents={docListArray} pluginRenderers={DocViewerRenderers} />

        <DocViewer documents={attachmentBlob} pluginRenderers={DocViewerRenderers} />

        {/* {attachments.map((attachment: any) => (
          <SummaryItem {...attachment} />
        ))} */}
      </div>
    </StyledAreteansExtensionsDocumentViewerWrapper>
  );
}

export default withConfiguration(AreteansExtensionsDocumentViewer);
