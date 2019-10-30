#!/bin/bash

if [ -t 1 ]; then
    exec < /dev/tty
    env_mode="--tty-mode"
else
    env_mode="--gui-mode"
fi

# 将传入参数 $* 赋回 node，追加使用端环境
dirs-limiterjs $* $env_mode