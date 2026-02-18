#!/bin/bash
set -euo pipefail

# 웹 환경에서만 실행
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "=== [SessionStart] 의존성 설치 시작 ==="

# ── Python 백엔드 ────────────────────────────────────────────────────
echo "[1/2] Python 패키지 설치 중..."
cd "${CLAUDE_PROJECT_DIR}"
pip install -r requirements.txt -q

# ── React 프론트엔드 ─────────────────────────────────────────────────
echo "[2/2] Node.js 패키지 설치 중..."
cd "${CLAUDE_PROJECT_DIR}/client"
npm install --prefer-offline --no-audit --no-fund

echo "=== [SessionStart] 설치 완료 ==="
