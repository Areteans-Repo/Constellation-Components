/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import AreteansExtensionsDocumentViewer from './index';

import historyData from './mock';

const meta: Meta<typeof AreteansExtensionsDocumentViewer> = {
  title: 'AreteansExtensionsDocumentViewer',
  component: AreteansExtensionsDocumentViewer,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof AreteansExtensionsDocumentViewer>;

if (!window.PCore) {
  window.PCore = {};
}

window.PCore.getConstants = () => {
  return {
    CASE_INFO: {
      CASE_INFO_ID: 'caseInfo.ID'
    }
  };
};

window.PCore.getLocaleUtils = () => {
  return {
    getLocaleValue: value => {
      return value;
    }
  };
};

window.PCore.getDataApiUtils = () => {
  return {
    getData: () => {
      return new Promise(resolve => {
        resolve(historyData);
      });
    }
  };
};

/* Simulate download of attachment - The files need to be in the static  storybook folder */
async function getFile(url: string) {
  const response = await fetch(url);
  const details = await response.arrayBuffer();
  return Promise.resolve({ data: details, headers: { 'content-transfer-encoding': 'binary' } });
}

(window as any).PCore.getMessagingServiceManager = () => {
  return {
    subscribe: () => {
      /* nothing */
    },
    unsubscribe: () => {
      /* nothing */
    }
  };
};
(window as any).PCore.getAttachmentUtils = () => {
  return {
    downloadAttachment: (ID: string) => {
      if (ID === 'LINK-ATTACHMENT DEMOURL') {
        return Promise.resolve({ data: 'https://www.pega.com' });
      } else if (ID === 'LINK-ATTACHMENT DEMOPNG') {
        return getFile('./Overview.png');
      } else if (ID === 'LINK-ATTACHMENT DEMODOCX') {
        return getFile('./SampleWord.docx');
      } else if (ID === 'LINK-ATTACHMENT DEMOPDF') {
        return getFile('./__LTA Reimbursement__.pdf');
      } else {
        return Promise.resolve({ data: 'https://www.pega.com' });
      }
    },
    getCaseAttachments: () => {
      return Promise.resolve([
        {
          createdByName: 'John Smith',
          createdBy: 'jsmith',
          createTime: '2024-01-28T14:54:50.323Z',
          name: 'pega.com',
          links: {
            download: {
              rel: 'self',
              href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T145450.323 GMT',
              title: 'Retrieve the link',
              type: 'GET'
            }
          },
          ID: 'LINK-ATTACHMENT DEMOURL',
          mimeType: 'application/octet-stream',
          category: 'URL',
          type: 'URL',
          categoryName: 'URL'
        },
        {
          createdByName: 'Marc Doe',
          extension: 'png',
          fileName: 'DemoFile.png',
          mimeType: 'image/png',
          type: 'FILE',
          categoryName: 'Evidence',
          createdBy: 'marsr',
          createTime: '2024-01-28T13:18:43.205Z',
          name: 'DemoFile',
          links: {
            download: {
              rel: 'self',
              href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.205 GMT',
              title: 'Download the attachment',
              type: 'GET'
            }
          },
          ID: 'LINK-ATTACHMENT DEMOPNG',
          category: 'Evidence'
        },
        {
          createdByName: 'Joe SMith',
          extension: 'docx',
          fileName: 'SampleWord.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          type: 'FILE',
          categoryName: 'File',
          createdBy: 'joe',
          createTime: '2024-01-28T13:18:43.193Z',
          name: 'SampleWord',
          links: {
            download: {
              rel: 'self',
              href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.193 GMT',
              title: 'Download the attachment',
              type: 'GET'
            }
          },
          ID: 'LINK-ATTACHMENT DEMODOCX',
          category: 'File'
        },
        {
          createdByName: 'Marc Doe',
          extension: 'pdf',
          fileName: 'demoPDF.pdf',
          mimeType: 'application/pdf',
          type: 'FILE',
          categoryName: 'File',
          createdBy: 'marsr',
          createTime: '2024-01-28T13:18:43.193Z',
          name: 'demoPDF',
          links: {
            download: {
              rel: 'self',
              href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.193 GMT',
              title: 'Download the attachment',
              type: 'GET'
            }
          },
          ID: 'LINK-ATTACHMENT DEMOPDF',
          category: 'File'
        },
        {
          createdByName: 'Marc Doe',
          extension: 'png',
          fileName: 'Screenshot 2024-01-25.png',
          mimeType: 'image/png',
          type: 'FILE',
          categoryName: 'File',
          createdBy: 'marsr',
          createTime: '2024-01-28T13:18:43.178Z',
          name: 'Screenshot 2024-01-25 PM',
          links: {
            download: {
              rel: 'self',
              href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.178 GMT',
              title: 'Download the attachment',
              type: 'GET'
            }
          },
          ID: 'LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.178 GMT',
          category: 'File'
        },
        {
          createdByName: 'Sue Lee',
          extension: 'png',
          fileName: 'Shipping Label.png',
          mimeType: 'image/png',
          type: 'FILE',
          categoryName: 'Shipping Label',
          createdBy: 'marsr',
          createTime: '2024-01-28T13:18:43.153Z',
          name: 'Shipping Label',
          links: {
            download: {
              rel: 'self',
              href: '/attachments/LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.153 GMT',
              title: 'Download the attachment',
              type: 'GET'
            }
          },
          ID: 'LINK-ATTACHMENT OK5NFJ-COMPUTER-WORK F-11012!20240128T131843.153 GMT',
          category: 'Shipping Label'
        }
      ]);
    }
  };
};

(window as any).PCore.getSemanticUrlUtils = () => {
  return {
    getResolvedSemanticURL: () => {
      return '/case/case-1';
    },
    getActions: () => {
      return {
        ACTION_OPENWORKBYHANDLE: 'openWorkByHandle'
      };
    }
  };
};

export const BaseAreteansExtensionsDocumentViewer: Story = args => {
  const props = {
    getPConnect: () => {
      return {
        getValue: value => {
          return value;
        },
        getContextName: () => {
          return 'app/primary_1';
        },
        getLocalizedValue: value => {
          return value;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {
              /* nothing */
            },
            triggerFieldChange: () => {
              /* nothing */
            }
          };
        },
        ignoreSuggestion: () => {
          /* nothing */
        },
        acceptSuggestion: () => {
          /* nothing */
        },
        setInheritedProps: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        }
      };
    }
  };

  return (
    <>
      <AreteansExtensionsDocumentViewer {...props} {...args} />
    </>
  );
};

BaseAreteansExtensionsDocumentViewer.args = {
  header: 'Document List',
  width: '500px',
  height: 'auto',
  useAttachmentEndpoint: true,
  categories: '',
  docLinkList:
    'https://api.slingacademy.com/v1/sample-data/files/just-text.pdf,https://api.slingacademy.com/v1/sample-data/files/text-and-images.pdf,https://api.slingacademy.com/v1/sample-data/files/text-and-table.pdf'
};
