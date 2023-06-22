import dynamic from 'next/dynamic';
import React, { ChangeEvent, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';

const IconButton = dynamic(() => 
  import('monday-ui-react-core')
    .then((mod) => mod.IconButton), {
  ssr: false,
})
const Loader = dynamic(() => 
  import('monday-ui-react-core')
    .then((mod) => mod.Loader), {
  ssr: false,
})
import { Send } from 'monday-ui-react-core/icons';

import {Button} from "monday-ui-react-core";

import classes from './text-input-with-send.module.scss';

import { Modes } from '../../types/layout-modes';
import { isEnterWithControlKey } from '../../helpers/dom-events';

import {showErrorMessage} from '@/helpers/monday-actions'

const ERROR_TIMEOUT = 3000;

const isValidInput = (input: string): boolean => {
  return input.trim().length > 0;
};

type Props = {
  error?: string;
  mode: Modes;
  setMode(mode: Modes): void;

  /**
   * This method is called when the user presses send
   * @param userMessage Contents of the input text box
   */
  onSend(userMessage: string): void;
  initialInputValue?: string;
  loading: boolean;
  success: boolean;
  inputRows?: number;
  placeholder?: string;
  hasButton?: boolean;
  buttonText?: string;
};

const TextInputWithSend = ({
  error,
  mode,
  setMode,
  onSend,
  initialInputValue = '',
  loading,
  success,
  placeholder,
  hasButton,
  buttonText,
}: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>(initialInputValue);
  const [inputElHeight, setInputElHeight] = useState<number>();

  const canSendInput = !loading && isValidInput(inputValue);

  const content = useRef<HTMLTextAreaElement>(null);

  const focusInputContent = useCallback(() => {
    const textAreaElement = content?.current;
    if (!textAreaElement) {
      return;
    }
    textAreaElement.focus();
    textAreaElement.setSelectionRange(textAreaElement.value.length, textAreaElement.value.length);
  }, []);

  // BUG: make input become smaller when user deletes content
  const handleInputChange = useCallback((newValue: string) => {
    setInputElHeight(content.current?.scrollHeight);
    setInputValue(newValue);
  }, []);

  useEffect(() => {
    handleInputChange(inputValue);
    focusInputContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(event.currentTarget.value ?? '');
  };

  const resetInput = useCallback(() => {
    setInputValue('');
    setInputElHeight(undefined);
  }, [setInputValue, setInputElHeight]);

  const handleOnSend = useCallback(() => {
    if (canSendInput) {
      onSend(inputValue);
    }
  }, [canSendInput, inputValue, onSend]);

  const onKeyDown = useCallback(
    (event: SyntheticEvent<HTMLTextAreaElement, KeyboardEvent>) => {
      const shouldSubmit = isEnterWithControlKey(event.nativeEvent);

      if (shouldSubmit) {
        handleOnSend();
      }
    },
    [handleOnSend]
  );

  useEffect(() => {
    if (error && mode === Modes.response) {
      console.error('err:', error);
      showErrorMessage(`Something went wrong: ${error}`, ERROR_TIMEOUT);
      setMode(Modes.request);
    }
  }, [error, mode, setMode]);

  useEffect(() => {
    if (success) {
      resetInput();
    }
  }, [success, resetInput])

  const backgroundColor = !canSendInput ? "#ECEDF5" : "#4A4AFF";

  return (
    <div>
      <div className={classes.inputContainer}>
        <textarea
          className={classes.input}
          rows={1}
          ref={content}
          placeholder={placeholder}
          value={inputValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          style={{ height: inputElHeight ? `60px` : 'auto', fontFamily: "Poppins", marginLeft: "10px", fontSize:"14px" }}
        />
        <div className={classes.loaderContainer}>
        {(mode===Modes.response) ? <Loader size={24}/> : null}
        </div>
      </div>
        {/* <IconButton
          ariaLabel="Send"
          className={classes.sendButton}
          size={'small'}        
          kind={'primary'}
          icon={Send}
          onClick={handleOnSend}
          wrapperClassName={classes.sendButtonWrapper}
          disabled={!canSendInput}
        /> */}

        {hasButton && <Button disabled={!canSendInput} onClick={handleOnSend} style={{marginTop: "12px", width:"100%", background: backgroundColor}}>{buttonText}</Button>}
    </div>
  );
};

export default TextInputWithSend;
