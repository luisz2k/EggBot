#!/bin/bash

process_name="server"

if pgrep -x "$process_name" >/dev/null; then
echo "The process $process_name is already running."
exit 0
else 
echo "Starting $process_name..." 
cd Minecraft || { echo "Error: Minecraft folder not found."; exit 1; }
./start_server.sh
echo Server Starting command has been executed
fi

