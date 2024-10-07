export const TAGS = {
  REVIEW: "review",
  MEETING: "meeting",
  TASK: "task",
};

export function getTag(task: string): string {
  const meetingTags = [
    "discuss",
    "meeting",
    "1:1",
    "sprint planning",
    "sprint retrospective",
    "weekly",
    "feature deep dive",
    "task prioritization",
    "task estimation",
    "golf",
    "design review",
    "roadmap planning",
    "Proteus ",
    "Epic Update",
    "Brownbag",
    "optimus",
    "neptune",
    "sync",
    "talks",
    "gl talk",
  ];
  task = task.toLowerCase();
  if (task.startsWith("review")) {
    return TAGS.REVIEW;
  }
  const isMeeting = meetingTags.some((tag) => task.includes(tag));
  if (isMeeting) {
    return TAGS.MEETING;
  }
  if (
    task.startsWith("#") ||
    task.startsWith("implement") ||
    task.startsWith("prepare QA") ||
    task.startsWith("breakdown task") ||
    task.startsWith("investigate")
  ) {
    return TAGS.TASK;
  }
  return "";
}
