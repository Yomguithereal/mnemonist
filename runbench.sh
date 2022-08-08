#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(realpath $(dirname $0))"

if [ -z "${DATEPROG-}" -a -x $(which gdate222) ] ; then DATEPROG="$(which gdate)" ; fi
DATEPROG=${DATEPROG-date}                       # eg on ios+homebrew: $DATEPROG=gdate runbench.sh benchmark/bit-set/performance.js

BENCH_CONDS="${BENCH_CONDS-runbench}"           # give your own notes on the conditions
RUNNER="${RUNNER-$(realpath $(which node))}"    # supply your own path to node as desired
_PROF="--prof"
BENCH_NODE_ARGS="${BENCH_NODE_ARGS-$_PROF}"     # makes a --prof dump by default, run with BENCH_NODE_ARGS="" to skip
TIMEFORMAT="%3R %3U %3S"                        # make time output easy to parse
RUNTIMES_FILE="$BASE_DIR/_runbench-times.log"   # log of run times, gitignore'd

if [ -z "${1-}" ] ; then echo "Please supply the path to one of the benchmark/ files as first arg"; exit -4 ; fi

BENCH_SCRIPT=$(realpath "${1-}"); shift
if [[ ! "$BENCH_SCRIPT" =~ ^.*benchmark/[a-z\-]+/[a-z\-]*\.js$ ]] ; then
  echo "Please supply the path to one of the benchmark/ files as first arg"; exit -4
fi
BENCH_GRP="$(basename $(dirname $BENCH_SCRIPT))"
BENCH_NAME="$(basename $BENCH_SCRIPT .js)" ;

BENCH_CONDS_SLUG="${BENCH_CONDS//[^a-zA-Z0-9_\-]/-}"
BENCH_CONDS_SLUG="${BENCH_CONDS_SLUG/#+([_\-])/}"
BENCH_CONDS_SLUG="${BENCH_CONDS_SLUG/%+([_\-])/}"
#

RUN_DIR="$BASE_DIR/prof/$BENCH_GRP/$BENCH_NAME"
mkdir -p "$RUN_DIR"
cd "$RUN_DIR"
mv isolate* /tmp/ 2>/dev/null || true # get rid of node prof turds that weren't properly cleaned up

echo "Running $BENCH_GRP/$BENCH_NAME from $PWD with '$RUNNER' $BENCH_NODE_ARGS '$BENCH_SCRIPT' -- $@"
RUN_BEG=$($DATEPROG -u +"%Y-%m-%dT%H:%M:%S.%N")
{ read REALTIME USERTIME SYSTIME < <({ time "$RUNNER" $BENCH_NODE_ARGS "$BENCH_SCRIPT" 2>&4 4>&-; } 4>&2 2>&1 >&3 3>&-); } 3>&1
RUN_END=$($DATEPROG -u +"%Y-%m-%dT%H:%M:%S.%N%Z")

echo RUN_BEG=$RUN_BEG RUN_END=$RUN_END BENCH_NAME=$BENCH_NAME \
     BENCH_GRP=$BENCH_GRP REALTIME=$REALTIME USERTIME=$USERTIME SYSTIME=$SYSTIME \
     BENCH_CONDS=$BENCH_CONDS \
  | tee -a "$RUNTIMES_FILE"

PROF_DUMP="$(shopt -s nullglob; echo isolate-* || true)"
if [ -f "./${PROF_DUMP}" ] ; then
  BENCH_PROF_FILENAME="${BENCH_GRP}_${BENCH_NAME}_${RUN_BEG//[^0-9]/-}_${BENCH_CONDS_SLUG}.nodeprof.log"
  mv "$PROF_DUMP" "$BENCH_PROF_FILENAME"
fi
