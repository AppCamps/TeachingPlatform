#!/bin/bash

docker run \
  --rm -it \
  --name appcamps-db-migrate \
  -v $(pwd):/workspace \
  -p 80:3000 \
  --link appcamps-postgres:postgres \
  --entrypoint /workspace/scripts/docker-db-drop.sh \
  local/appcamps-teach

