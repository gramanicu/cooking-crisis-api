#!/bin/bash

if ! command -v redis-cli &> /dev/null
then
    sudo apt update
    sudo apt install redis-server
    sudo cp redis.conf /etc/redis/redis.conf
    sudo service redis-server start
fi
