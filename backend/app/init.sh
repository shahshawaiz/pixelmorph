#!/bin/sh
# uvicorn server:app --host 0.0.0.0 --port 8765
python server.py --bind 0.0.0.0:8765

# python -m test.run_benchmarks
# exit 0
