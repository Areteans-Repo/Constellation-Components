import { useState, useEffect, useRef } from 'react';
import {
  Input,
  EmailDisplay,
  FieldValueList,
  Text,
  URLDisplay,
  PhoneDisplay,
  withConfiguration
} from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';

// includes in bundle
import { suggestionsHandler } from './suggestions-handler';
import handleEvent from './event-utils';

import StyledAreteansExtensionsAreEmailWrapper from './styles';

// interface for props
interface AreteansExtensionsAreEmailProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  helperText: string;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter: string;
}

// interface for StateProps object
interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

export const formatExists = (formatterVal: string) => {
  const formatterValues = [
    'TextInput',
    'WorkStatus',
    'RichText',
    'Email',
    'Phone',
    'URL',
    'Operator'
  ];
  let isformatter = false;
  if (formatterValues.includes(formatterVal)) {
    isformatter = true;
  }
  return isformatter;
};

export const textFormatter = (formatter: string, value: any) => {
  let displayComponent: any = null;
  switch (formatter) {
    case 'TextInput': {
      displayComponent = value;
      break;
    }
    case 'Email': {
      displayComponent = <EmailDisplay value={value} displayText={value} variant='link' />;
      break;
    }
    case 'Phone': {
      displayComponent = <PhoneDisplay value={value} variant='link' />;
      break;
    }
    case 'URL': {
      displayComponent = (
        <URLDisplay target='_blank' value={value} displayText={value} variant='link' />
      );
      break;
    }
    // no default
  }
  return displayComponent;
};

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function AreteansExtensionsAreEmail(props: AreteansExtensionsAreEmailProps) {
  const {
    getPConnect,
    value,
    placeholder,
    validatemessage,
    label,
    hideLabel = false,
    helperText,
    testId,
    displayMode,
    additionalProps = {},
    variant = 'inline',
    isTableFormatter = false,
    hasSuggestions = false
  } = props;
  const { formatter } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;

  const hasValueChange = useRef(false);

  let { readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );
  const [inputValue, setInputValue] = useState(value);
  useEffect(() => setInputValue(value), [value]);

  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);

  useEffect(() => {
    if (validatemessage !== '') {
      // setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions, status]);

  let displayComp: any = null;
  if (displayMode) {
    displayComp = <EmailDisplay value={value} displayText={inputValue} variant='link' />;
  }

  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    if (isTableFormatter && formatExists(formatter)) {
      displayComp = textFormatter(formatter, value);
    }
    return displayMode === 'DISPLAY_ONLY' ? (
      <StyledAreteansExtensionsAreEmailWrapper>
        {displayComp}
      </StyledAreteansExtensionsAreEmailWrapper>
    ) : (
      <StyledAreteansExtensionsAreEmailWrapper>
        <FieldValueList
          variant={hideLabel ? 'stacked' : variant}
          data-testid={testId}
          fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
        />
      </StyledAreteansExtensionsAreEmailWrapper>
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return (
      <StyledAreteansExtensionsAreEmailWrapper>
        <FieldValueList
          variant='stacked'
          data-testid={testId}
          fields={[
            {
              id: '2',
              name: hideLabel ? '' : label,
              value: (
                <Text variant='h1' as='span'>
                  {displayComp}
                </Text>
              )
            }
          ]}
        />
      </StyledAreteansExtensionsAreEmailWrapper>
    );
  }

  const onResolveSuggestionHandler = (accepted: boolean) => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  function isValidEmail(email: string) {
    console.log('inside isvalid email');
    return /\S+@(areteans|credera)\.com$/i.test(email);
  }

  return (
    <StyledAreteansExtensionsAreEmailWrapper>
      <Input
        {...additionalProps}
        type='email'
        label={label}
        labelHidden={hideLabel}
        info={validatemessage || helperText}
        value={inputValue}
        status={status}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        data-testid={testId}
        onChange={(event: any) => {
          if (hasSuggestions) {
            setStatus(undefined);
          }
          if (!isValidEmail(event.target.value)) {
            console.log('not valid email');
            setStatus('error');
          } else {
            setStatus('success');
            console.log('valid email');

            // setStatus(undefined);
          }
          setInputValue(event.target.value);
          if (value !== event.target.value) {
            console.log('inside if (value !== event.target.value)');
            // @ts-ignore
            handleEvent(actions, 'change', propName, event.target.value);
            hasValueChange.current = true;
          }
        }}
        onBlur={(event: any) => {
          if (!value || hasValueChange.current) {
            // @ts-ignore
            handleEvent(actions, 'blur', propName, event.target.value);
            if (hasSuggestions) {
              pConn.ignoreSuggestion('');
            }
            hasValueChange.current = false;
          }
        }}
        // @ts-ignore
        onFocus={actions.onFocus}
        onResolveSuggestion={onResolveSuggestionHandler}
      />
    </StyledAreteansExtensionsAreEmailWrapper>
  );
}

export default withConfiguration(AreteansExtensionsAreEmail);
