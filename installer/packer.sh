#!/bin/bash

rm -f *.run
rm -f *.gz

binarycreator --offline-only -c config/config.xml -p packages plinfo-linux-amd64.run
