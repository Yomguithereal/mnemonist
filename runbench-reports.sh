#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(realpath $(dirname $0))"
cd $BASE_DIR

for PROF_LOG in ./prof/*/*/*.nodeprof.log ; do
  PROF_REPORT=$(dirname "$PROF_LOG")/$(basename "$PROF_LOG" .nodeprof.log).stack.txt
  if [ ! -e "${PROF_REPORT}" ] ; then
    node --prof-process "$PROF_LOG" > "$PROF_REPORT"
    echo
    echo Warnings about "Could not find function" are probably harmless
    echo
    echo "Processed $PROF_LOG to $PROF_REPORT"
    echo
    # else echo "Skipping $PROF_REPORT, already processed"
  fi
done
