#!/bin/bash

if [ -t 1 ]; then
    exec < /dev/tty
    env_mode="--tty-mode"
else
    env_mode="--gui-mode"
fi

# 将传入参数 $* 赋回 node，追加使用端环境
if [ -f $(pwd)/bin/dirs-limiter.js ]; then
    node $(pwd)/bin/dirs-limiter.js $* $env_mode
else
    echo 'Can be used only in git prepare-commit-msg hook.'
fi