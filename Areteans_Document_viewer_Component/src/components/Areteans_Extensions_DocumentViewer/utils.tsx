import { type MouseEvent } from 'react';
import {
  getKindFromMimeType,
  DateTimeDisplay,
  MetaList,
  FileVisual,
  Icon,
  Button
} from '@pega/cosmos-react-core';

export const getArrayFromString = (listString: string) => {
  if (listString) {
    const temp = listString.split(',') || [];
    let result: any[] = [];
    if (temp.length > 0) {
      result = temp.map(item => {
        if (item.trim().startsWith('http')) {
          const obj = { uri: item.trim() };
          return obj;
        } else {
          const obj = { uri: `require(${item.trim()})` };
          return obj;
        }
      });
    }
    return result;
  }
  return [];
};

export const binaryToArrayBuffer = (binaryString: string) => {
  const bytes = new Uint8Array(binaryString.length);
  return bytes.map((byte, i) => binaryString.charCodeAt(i));
};

export const base64ToArrayBuffer = (base64: string) => {
  const binaryString = window.atob(base64);
  return binaryToArrayBuffer(binaryString);
};

export const isContentBinary = (headers: any) => {
  return headers && headers['content-transfer-encoding'] === 'binary';
};

export const isContentBase64 = (headers: any) => {
  return headers && headers['content-transfer-encoding'] === 'base64';
};

export const downloadBlob = (arrayBuf: any, name: string, mimeType: string) => {
  const blob = new Blob([arrayBuf], { type: mimeType });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  );
  document.body.removeChild(link);
};

const fileDownload = (data: string, attachment: any, headers: any) => {
  const name = attachment.extension
    ? `${attachment.name}.${attachment.extension}`
    : attachment.fileName;
  downloadBlob(
    isContentBase64(headers) ? base64ToArrayBuffer(data) : data,
    name,
    attachment.mimeType
  );
};
export const canPreviewFile = (type: string) => {
  return type === 'image' || type === 'pdf';
};

export const downloadFile = (
  attachment: any,
  getPConnect: any,
  setImages: any,
  bForceDownload: boolean
) => {
  const kind = getKindFromMimeType(attachment.mimeType);
  (window as any).PCore.getAttachmentUtils()
    .downloadAttachment(attachment.ID, getPConnect().getContextName(), attachment.responseType)
    .then((content: any) => {
      if (canPreviewFile(kind) && !bForceDownload) {
        let arrayBuf: Uint8Array | BlobPart;
        if (isContentBinary(content.headers)) arrayBuf = content.data;
        else arrayBuf = base64ToArrayBuffer(content.data);
        const blob = new Blob([arrayBuf], { type: attachment.mimeType });
        const fileURL = URL.createObjectURL(blob);
        if (setImages) {
          const name = attachment.extension
            ? `${attachment.name}.${attachment.extension}`
            : attachment.fileName;
          const metadata: Array<any> = [];
          metadata.push(attachment.createdByName);
          metadata.push(<DateTimeDisplay value={new Date(attachment.createTime)} variant='date' />);
          setImages([
            {
              id: attachment.ID,
              name,
              description: attachment.categoryName,
              mimeType: attachment.mimeType,
              blob,
              src: fileURL,
              metadata
            }
          ]);
        } else {
          window.open(fileURL, '_blank');
        }
      } else if (attachment.type === 'URL') {
        let { data } = content;
        if (!/^(http|https):\/\//.test(data)) {
          data = `//${data}`;
        }
        window.open(content.data, '_blank');
      } else {
        fileDownload(content.data, attachment, content.headers);
      }
    });
};

// const getblobFile = async (attachment: any, getPConnect: any) => {
//   const kind = getKindFromMimeType(attachment.mimeType);
//   (window as any).PCore.getAttachmentUtils()
//     .downloadAttachment(attachment.ID, getPConnect().getContextName(), attachment.responseType)
//     .then((content: any) => {
//       if (canPreviewFile(kind)) {
//         let arrayBuf: Uint8Array | BlobPart;
//         if (isContentBinary(content.headers)) arrayBuf = content.data;
//         else arrayBuf = base64ToArrayBuffer(content.data);
//         const blob = new Blob([arrayBuf], { type: attachment.mimeType });
//         const fileURL = URL.createObjectURL(blob);
//         return fileURL;
//       }
//     });
// };
type AddAttachmentProps = {
  currentCategory: string;
  attachment: any;
  listOfAttachments: any;
  getPConnect: any;
  setImages?: any;
  useLightBox?: boolean;
  setElemRef: any;
};

export const addAttachment = async (props: AddAttachmentProps) => {
  const {
    currentCategory,
    attachment,
    listOfAttachments,
    getPConnect,
    setImages,
    useLightBox,
    setElemRef
  } = props;
  const dateTime = <DateTimeDisplay value={new Date(attachment.createTime)} variant='relative' />;
  const secondaryItems = [
    currentCategory === 'pxDocument' ? 'Document' : currentCategory,
    dateTime,
    attachment.createdByName ?? attachment.createdBy
  ];

  const kind = getKindFromMimeType(attachment.mimeType ?? '');
  const visual = <FileVisual type={kind} />;
  const bCanUseLightBox = useLightBox && kind === 'image';
  // const blobfile = await getblobFile(
  //   attachment,
  //   getPConnect  );
  listOfAttachments.push({
    id: attachment.ID,
    visual,
    primary: (
      <Button
        aria-label={`Download ${attachment.name}`}
        variant='link'
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setElemRef(e.currentTarget);
          downloadFile(attachment, getPConnect, bCanUseLightBox ? setImages : undefined, false);
        }}
      >
        {attachment.name}{' '}
        {(attachment.type === 'URL' || (canPreviewFile(kind) && !bCanUseLightBox)) && (
          <Icon name='open' />
        )}
      </Button>
    ),
    secondary: <MetaList items={secondaryItems} />
  });
};
