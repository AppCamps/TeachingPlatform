#!/bin/bash

docker run \
  --rm -it \
  -v $(pwd):/workspace \
  --link appcamps-postgres-new:postgres \
  --entrypoint /workspace/scripts/docker-db-seed.sh \
  local/appcamps-teach

