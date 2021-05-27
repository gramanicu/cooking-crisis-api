#!/bin/bash

if ! command -v redis-server &> /dev/null
then
    cd $(dirname $0)
    sudo apt update
    sudo apt install redis-server
    sudo cp redis.conf /etc/redis/redis.conf
    sudo service redis-server start
fi
