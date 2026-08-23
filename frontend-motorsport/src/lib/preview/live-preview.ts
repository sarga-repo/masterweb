export type PreviewRevision = {
  documentId: string;
  updatedAt: string | null;
  publishedAt: string | null;
  status: "draft" | "published";
};

export function previewRevisionFingerprint(revision: PreviewRevision) {
  return [
    revision.documentId,
    revision.updatedAt ?? "",
    revision.publishedAt ?? "",
    revision.status,
  ].join(":");
}
