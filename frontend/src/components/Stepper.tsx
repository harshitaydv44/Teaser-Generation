import Icon, { type IconName } from "../ui/Icon";

export type StepId = "source" | "options" | "processing" | "teasers";

export interface Step {
  id: StepId;
  label: string;
  icon: IconName;
  
  enabled: boolean;
 
  complete?: boolean;
  
  blockedReason?: string;
  count?: number;
}

interface Props {
  steps: Step[];
  current: StepId;
  onSelect: (id: StepId) => void;
}


export default function Stepper({ steps, current, onSelect }: Props) {
  return (
    <nav className="stepper" aria-label="Generation progress">
      <ol className="stepper-list">
        {steps.map((step, index) => {
          const isCurrent = step.id === current;
          const isDone = step.complete === true;
          const state = isCurrent ? "current" : isDone ? "done" : "todo";

          return (
            <li className={`stepper-item stepper-item-${state}`} key={step.id}>
              <button
                type="button"
                className="stepper-btn"
                disabled={!step.enabled}
                aria-current={isCurrent ? "step" : undefined}
                title={step.enabled ? undefined : step.blockedReason}
                onClick={() => onSelect(step.id)}
              >
                <span className="stepper-marker">
                  {isDone ? (
                    <Icon name="check" size={13} strokeWidth={2.6} />
                  ) : (
                    <Icon name={step.icon} size={14} strokeWidth={2.2} />
                  )}
                </span>
                <span className="stepper-text">
                  <span className="stepper-index o-num">Step {index + 1}</span>
                  <span className="stepper-label">
                    {step.label}
                    {step.count !== undefined && (
                      <span className="stepper-count o-num">{step.count}</span>
                    )}
                  </span>
                </span>
              </button>
              {index < steps.length - 1 && (
                <span className="stepper-line" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
