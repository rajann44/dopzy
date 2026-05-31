import { Button } from './Button';

interface FloatingStepActionsProps {
  leftLabel: string;
  rightLabel: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  leftVariant?: 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger';
  rightVariant?: 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger';
  leftType?: 'button' | 'submit';
  rightType?: 'button' | 'submit';
  rightFormId?: string;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
  rightLoading?: boolean;
}

export function FloatingStepActions({
  leftLabel,
  rightLabel,
  onLeftClick,
  onRightClick,
  leftVariant = 'outlined',
  rightVariant = 'primary',
  leftType = 'button',
  rightType = 'button',
  rightFormId,
  leftDisabled,
  rightDisabled,
  rightLoading,
}: FloatingStepActionsProps) {
  return (
    <div className="floating-step-actions" role="group" aria-label="Task creation navigation actions">
      <Button type={leftType} variant={leftVariant} onClick={onLeftClick} disabled={leftDisabled}>
        {leftLabel}
      </Button>
      <Button
        type={rightType}
        variant={rightVariant}
        onClick={onRightClick}
        form={rightFormId}
        isLoading={rightLoading}
        disabled={rightDisabled}
      >
        {rightLabel}
      </Button>
    </div>
  );
}
