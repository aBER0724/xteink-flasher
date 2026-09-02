'use client';

import React, {
  ChangeEvent,
  Ref,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { LuFileUp, LuX } from 'react-icons/lu';
import { useTranslation } from '@/i18n';

export interface FileUploadHandle {
  getFile: () => File | undefined;
}

export default function FileUpload({
  ref,
  disabled,
}: {
  ref: Ref<FileUploadHandle>;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();

  useImperativeHandle(ref, () => ({
    getFile: () => file,
  }));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0]);
  };

  const clearFile = () => {
    setFile(undefined);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`file-picker${file ? ' file-picker--selected' : ''}`}>
      <input
        ref={inputRef}
        type="file"
        disabled={disabled}
        aria-label={t('common.chooseFile')}
        onChange={handleChange}
      />
      <span className="file-picker__button" aria-hidden="true">
        <LuFileUp />
        {t('common.chooseFile')}
      </span>
      <span className="file-picker__name">
        {file?.name ?? t('common.noFileChosen')}
      </span>
      {file ? (
        <button
          className="file-picker__clear"
          type="button"
          disabled={disabled}
          aria-label={t('common.clearFile')}
          onClick={clearFile}
        >
          <LuX aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
