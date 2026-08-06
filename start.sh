#!/usr/bin/env bash
set -e

# ==============================================================================
# One-Command Zero-Dependency Boot Script
# AbbVie Indication Knowledge Platform
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}====================================================================${NC}"
echo -e "${PURPLE}  AbbVie Indication Knowledge Platform — Bootstrapping Services...  ${NC}"
echo -e "${PURPLE}====================================================================${NC}"
echo ""

# 1. Initialize and Seed SQLite Database
echo -e "${BLUE}[1/3] Initializing SQLite Seed Database & Graph Indices...${NC}"
cd "$ROOT_DIR/api"
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install -q fastapi uvicorn pydantic networkx pytest
fi

./venv/bin/python -c "from services.eval_dataset import get_eval_dataset; from services.session_manager import get_session_manager; print('Database Seeded:', get_eval_dataset().get_summary()['totalCases'], 'Golden Cases Ready')"
echo -e "${GREEN}✓ Database initialized and seeded successfully.${NC}"
echo ""

# 2. Check and Launch FastAPI Backend
echo -e "${BLUE}[2/3] Starting FastAPI Backend on http://0.0.0.0:8000...${NC}"
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✓ FastAPI backend is already running on port 8000.${NC}"
else
    ./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 &
    echo -e "${GREEN}✓ FastAPI backend spawned on PID $!.${NC}"
fi
echo ""

# 3. Check and Launch Next.js Dev Server
echo -e "${BLUE}[3/3] Starting Next.js 14 Frontend on http://0.0.0.0:3000...${NC}"
cd "$ROOT_DIR/web"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✓ Next.js 14 frontend is already running on port 3000.${NC}"
else
    npm run dev -- -p 3000 -H 0.0.0.0 &
    echo -e "${GREEN}✓ Next.js frontend spawned on PID $!.${NC}"
fi
echo ""

echo -e "${PURPLE}====================================================================${NC}"
echo -e "${GREEN}  ✓ Platform Ready!${NC}"
echo -e "  - Executive Workspace: ${CYAN}http://localhost:3000${NC}"
echo -e "  - Testing Admin Dashboard: ${CYAN}http://localhost:3000/admin/testing${NC}"
echo -e "  - RAGAS Evaluation Runner: ${CYAN}http://localhost:3000/test-harness/eval-runner${NC}"
echo -e "  - Golden Benchmark Suite: ${CYAN}http://localhost:3000/test-harness/golden-dataset${NC}"
echo -e "  - FastAPI Documentation: ${CYAN}http://localhost:8000/docs${NC}"
echo -e "${PURPLE}====================================================================${NC}"
