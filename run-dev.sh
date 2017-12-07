#!/bin/bash

docker run \
  --name appcamps-www-new \
  --rm -it \
  -v $(pwd):/workspace \
  -p 80:3000 \
  --link appcamps-postgres-new:postgres \
  local/appcamps-teach

