
/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import AreteansExtensionsAreEmail from './index';

import { stateProps, configProps, fieldMetadata } from './mock';

const meta: Meta<typeof AreteansExtensionsAreEmail> = {
  title: 'AreteansExtensionsAreEmail',
  component: AreteansExtensionsAreEmail,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof AreteansExtensionsAreEmail>;

export const BaseAreteansExtensionsAreEmail: Story = args => {

  const props = {
    value: configProps.value,
    hasSuggestions: configProps.hasSuggestions,
    fieldMetadata,
    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {/* nothing */},
            triggerFieldChange: () => {/* nothing */}
          };
        },
        ignoreSuggestion: () => {/* nothing */},
        acceptSuggestion: () => {/* nothing */},
        setInheritedProps: () => {/* nothing */},
        resolveConfigProps: () => {/* nothing */}
      };
    }
  };

  return (
    <>
      <AreteansExtensionsAreEmail {...props} {...args} />
    </>
  );
};

BaseAreteansExtensionsAreEmail.args = {
  label: configProps.label,
  helperText: configProps.helperText,
  placeholder: configProps.placeholder,
  testId: configProps.testId,
  readOnly: configProps.readOnly,
  disabled: configProps.disabled,
  required: configProps.required,
  status: configProps.status,
  hideLabel: configProps.hideLabel,
  displayMode: configProps.displayMode,
  variant: configProps.variant,
  validatemessage: configProps.validatemessage
};
