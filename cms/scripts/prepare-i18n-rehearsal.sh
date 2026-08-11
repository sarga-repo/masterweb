#!/usr/bin/env bash

set -euo pipefail

container="${POSTGRES_CONTAINER:-sarga-postgres-local}"
source_database="${SOURCE_DATABASE_NAME:-sarga_strapi}"
rehearsal_database="${REHEARSAL_DATABASE_NAME:-sarga_strapi_i18n_rehearsal}"
database_user="${DATABASE_USERNAME:-sarga}"
artifact_directory="${I18N_REHEARSAL_ARTIFACT_DIR:-/tmp/sarga-gwr-cms-5}"
container_dump="/tmp/${source_database}-i18n-rehearsal.dump"
host_dump="${artifact_directory}/${source_database}-i18n-rehearsal.dump"
script_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cms_root="$(cd "${script_directory}/.." && pwd)"
uploads_archive="${artifact_directory}/${source_database}-i18n-rehearsal-uploads.tar.gz"
checksum_manifest="${artifact_directory}/${source_database}-i18n-rehearsal.sha256"

if [[ "${source_database}" == "${rehearsal_database}" ]]; then
  echo "Source and rehearsal databases must be different." >&2
  exit 1
fi

mkdir -p "${artifact_directory}"

docker exec "${container}" pg_dump \
  -U "${database_user}" \
  -d "${source_database}" \
  --format=custom \
  --file="${container_dump}"
docker cp "${container}:${container_dump}" "${host_dump}"
docker exec "${container}" dropdb \
  -U "${database_user}" \
  --if-exists \
  --force \
  "${rehearsal_database}"
docker exec "${container}" createdb \
  -U "${database_user}" \
  "${rehearsal_database}"
docker exec "${container}" pg_restore \
  -U "${database_user}" \
  -d "${rehearsal_database}" \
  --clean \
  --if-exists \
  "${container_dump}"
docker exec "${container}" rm -f "${container_dump}"

tar -C "${cms_root}/public" -czf "${uploads_archive}" uploads
(
  cd "${artifact_directory}"
  shasum -a 256 \
    "$(basename "${host_dump}")" \
    "$(basename "${uploads_archive}")" \
    > "$(basename "${checksum_manifest}")"
)
chmod 600 "${host_dump}" "${uploads_archive}" "${checksum_manifest}"

echo "Rehearsal database restored: ${rehearsal_database}"
echo "Backup artifact: ${host_dump}"
echo "Uploads artifact: ${uploads_archive}"
echo "Checksum manifest: ${checksum_manifest}"
echo
echo "Next: run Strapi once with DATABASE_NAME=${rehearsal_database}, then compare inventories."
