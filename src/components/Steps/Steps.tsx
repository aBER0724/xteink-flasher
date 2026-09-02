import React from 'react';
import { Alert, Progress } from '@chakra-ui/react';
import { StepData } from '@/types/Step';
import { useTranslation } from '@/i18n';

function StepMarker({
  index,
  status,
}: {
  status: StepData['status'];
  index: number;
}) {
  if (status === 'running') {
    return (
      <span className="operation-step__marker operation-step__marker--running">
        <span className="operation-step__number">{index + 1}</span>
        <span className="operation-step__spinner" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span
      className={`operation-step__marker operation-step__marker--${status}`}
      aria-hidden="true"
    >
      {status === 'success' ? '✓' : index + 1}
    </span>
  );
}

export default function Steps({ steps }: { steps: StepData[] }) {
  const { tStep } = useTranslation();

  return (
    <ol className="operation-steps">
      {steps.map((step, index) => {
        const displayName = tStep(step.name);
        const isLast = index === steps.length - 1;

        return (
          <li
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={`operation-step operation-step--${step.status}`}
            aria-current={step.status === 'running' ? 'step' : undefined}
          >
            <div className="operation-step__rail" aria-hidden="true">
              <StepMarker status={step.status} index={index} />
              {!isLast ? <span className="operation-step__line" /> : null}
            </div>
            <div className="operation-step__body">
              <p className="operation-step__title">{displayName}</p>
              {step.progress ? (
                <Progress.Root
                  className="operation-step-progress"
                  size="sm"
                  variant="subtle"
                  value={(step.progress.current / step.progress.total) * 100}
                >
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                  <Progress.ValueText>
                    {Math.round(
                      (step.progress.current / step.progress.total) * 100,
                    )}
                    % ({step.progress.current.toLocaleString()} /{' '}
                    {step.progress.total.toLocaleString()})
                  </Progress.ValueText>
                </Progress.Root>
              ) : null}
              {step.status === 'failed' && step.error ? (
                <Alert.Root status="error" className="operation-step__error">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>{step.error.name}</Alert.Title>
                    <Alert.Description>{step.error.message}</Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
