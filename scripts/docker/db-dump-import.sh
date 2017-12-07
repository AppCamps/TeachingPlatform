#!/bin/bash

if (( $# == 0 )) 
then
  echo 'Required path parameter'
  echo 'Usage: db-dump-import <path-to-dump-file>'
  exit 1;
fi;

cat $1 | gunzip | psql -h 127.0.0.1 -U postgres appcamps_development
