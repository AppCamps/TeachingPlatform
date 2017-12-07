#!/bin/bash

docker run \
  --rm -it \
  -v $(pwd):/workspace \
  -p 80:3000 \
  --link appcamps-postgres-new:postgres \
  --entrypoint /workspace/scripts/docker-db-migrate.sh \
  local/appcamps-teach

