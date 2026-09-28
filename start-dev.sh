#!/usr/bin/env bash
# Starts all three frontends in one tmux session (backend must already be running).

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SESSION="uniflow-dev"

tmux new-session -d -s $SESSION -n client \
  "cd '$ROOT/uniFlow-client' && npm run dev"
tmux new-window -t $SESSION -n operator \
  "cd '$ROOT/uniFlow-operator' && npm run dev -- --host 0.0.0.0 --port 4000"
tmux new-window -t $SESSION -n technician \
  "cd '$ROOT/uniFlow-technician' && npx expo start"
tmux new-window -t $SESSION -n shell

tmux attach -t $SESSION
