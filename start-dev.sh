#!/usr/bin/env bash

SESSION="uniflow-dev"

# Start new detached tmux session
tmux new-session -d -s $SESSION -n dashboard

# Window 1: form-react
tmux new-window -t $SESSION -n form
tmux send-keys -t $SESSION:form \
  "cd form-react/form-react && npm run dev -- --host 0.0.0.0" C-m

# Window 2: dashboard-react
tmux send-keys -t $SESSION:dashboard \
  "cd dashboard-react && npm run dev -- --host 0.0.0.0 --port 4000" C-m

# Window 3: uniFlow (Expo)
tmux new-window -t $SESSION -n expo
tmux send-keys -t $SESSION:expo \
  "cd uniFlow && npx expo start" C-m

# Window 4: empty shell for manual work
tmux new-window -t $SESSION -n shell

# Attach to session
tmux attach -t $SESSION
