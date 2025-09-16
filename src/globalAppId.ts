let applicationId: number | undefined;

export function setApplicationId(id: number) {
  applicationId = id;
}

export function getApplicationId() {
  return applicationId;
}
