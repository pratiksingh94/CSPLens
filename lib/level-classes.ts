const BASE_BADGE_CLASSES = "cursor-help select-none motion-safe:transition-transform motion-safe:transition-shadow duration-200 ease-out hover:scale-105 hover:shadow-sm focus-visible:scale-105";


const levelClasses = {
  GOOD: `bg-primary text-primary-foreground hover:bg-primary/80 ${BASE_BADGE_CLASSES}`,
  OK: `bg-ok text-ok-foreground hover:bg-ok/80 hover:text-ok-foreground ${BASE_BADGE_CLASSES}`,
  WARNING: `bg-warning text-warning-foreground hover:bg-warning hover:text-warning-foreground ${BASE_BADGE_CLASSES}`,
  DANGER: `bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:text-destructive-foreground ${BASE_BADGE_CLASSES}`,
  INVALID: `bg-card text-muted-foreground border border-border hover:bg-card/80 hover:text-muted-foreground ${BASE_BADGE_CLASSES}`,
} as const;

export default levelClasses;
